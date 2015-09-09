import Kareem from 'kareem';
import _ from 'lodash';
import debug from 'debug';
import SchemaBase from './SchemaBase';
import VirtualType from '../types/Virtual';
import Data from '../Data';
import MixedType from '../types/Mixed';
import IndexType from '../constants/IndexType';

const log = debug('orientose:schema');

const RESERVED_FIELDS = ['model', 'isNew', 'isModified', 'get', 'set'];

export default class Schema extends SchemaBase {
  constructor(props, options) {
    super(options);

    this.methods = {};
    this.statics = {};

    this._paths = {};
    this._indexes = {};
    this._virtuals = {};
    this._hooks = new Kareem();

    this._dataClass = null;

    this.add(props);
  }

  get extendClassName() {
    return this._options.extend;
  }

  get hooks() {
    return this._hooks;
  }

  get DataClass() {
    if (!this._dataClass) {
      this._dataClass = Data.createClass(this);
    }
    return this._dataClass;
  }

  add(props = {}) {
    if (!_.isObject(props)) {
      throw new Error('Props is not an object');
    }

    Object.keys(props).forEach(propName => this.setPath(propName, props[propName]));
    return this;
  }

  getSubdocumentSchemaConstructor() {
    return Schema;
  }

  _indexName(properties) {
    const props = Object.keys(properties).map(function(prop) {
      return prop.replace('.', '-');
    });

    return props.join('_');
  }

  index(properties, options = {}) {
    if (typeof properties === 'string') {
      properties = { [properties]: 1 };
    }

    const propNames = Object.keys(properties);
    if (!propNames.length) {
      throw new Error('You need to select a properties');
    }

    const firstProp = properties[propNames[0]];
    const name = options.name || this._indexName(properties);
    let type = options.type || IndexType.BASIC;

    if (type === true) {
      type = IndexType.BASIC;
    } else if (type === 'text' || type === 'fulltext' || options.text || firstProp === 'text') {
      type = IndexType.FULLTEXT;
    } else if (type === '2dsphere') {
      type = IndexType.SPATIAL;
    }

    if (this._indexes[name]) {
      throw new Error('Index with name ${name} is already defined.');
    }

    this._indexes[name] = {
      ...options,
      properties: properties,
      type: type,
      nullValuesIgnored: !options.sparse
    };

    return this;
  }

  hasIndex(name) {
    return !!this._indexes[name];
  }

  getIndex(name) {
    return this._indexes[name];
  }

  get indexNames() {
    return Object.keys(this._indexes);
  }

  get(key) {
    return this.options[key];
  }

  set(key, value) {
    this.options[key] = value;
    return this;
  }

  getSchemaType(path) {
    const prop = this.getPath(path);
    return prop ? prop.SchemaType : void 0;
  }

  getPath(path, stopOnArray) {
    const pos = path.indexOf('.');
    if (pos === -1) {
      return this._props[path];
    }

    const subPath = path.substr(pos + 1);
    const propName = path.substr(0, pos);

    const prop = this._props[propName];
    if (!prop) {
      return prop;
    }

    if (prop.type instanceof Schema) {
      return prop.type.getPath(subPath);
    }

    if (!stopOnArray && prop.item && prop.item.type instanceof Schema) {
      return prop.item.type.getPath(subPath);
    }
  }

  setPath(path, options = {}) {
    // ignore {_id: false}
    if (options === false) {
      return this;
    }

    const pos = path.indexOf('.');
    if (pos === -1) {
      if (RESERVED_FIELDS.indexOf(path) !== -1) {
        throw new Error(`This field name ${path} is reserved`);
      }

      let normalizedOptions = null;

      try {
        normalizedOptions = this.normalizeOptions(options, path);
      } catch(e) {
        log('Problem with path: ' + path);
        throw e;
      }

      if (!normalizedOptions) {
        return this;
      }

      this._props[path] = normalizedOptions;

      if (!options.index && !options.unique && !options.sparse) {
        return this;
      }

      const index = options.index || {};

      this.index({
        [path]: path
      }, {
        unique: options.unique || index.unique,
        sparse: options.sparse || index.sparse,
        hash: options.hash || index.hash,
        name: options.indexName || index.name,
        engine: options.engine || index.engine,
        type: options.indexType || index.type || index,
        metadata: options.indexMetadata || index.metadata
      });

      return this;
    }

    const subPath = path.substr(pos + 1);
    const propName = path.substr(0, pos);

    const prop = this._props[propName];
    if (prop && prop.type instanceof Schema) {
      prop.type.setPath(subPath, options);
    }

    return this;
  }

  has(property) {
    return !!this._props[property];
  }

  propertyNames() {
    return Object.keys(this._props);
  }

  method(name, fn) {
    if (_.isObject(name)) {
      Object.keys(name).forEach((index) => this.methods[index] = name[index]);
      return this;
    }

    this.methods[name] = fn;
    return this;
  }

  static(name, fn) {
    if (_.isObject(name)) {
      Object.keys(name).forEach((index) => this.statics[index] = name[index]);
      return this;
    }

    this.statics[name] = fn;
    return this;
  }

  virtual(path, options = {}) {
    const pos = path.indexOf('.');
    if (pos !== -1) {
      const subPaths = path.split('.');
      const field = subPaths.pop();

      const prop = this.getPath(subPaths.join('.'));
      if (!prop) {
        throw new Error('Field does not exists ' + subPaths.join('.'));
      }

      const type = prop.item ? prop.item.type : prop.type;

      if (!type || !(type instanceof Schema)) {
        throw new Error('Field does not exists ' + subPaths.join('.'));
      }

      return type.virtual(field, options);
    }

    if (this._virtuals[path]) {
      return this._virtuals[path].getset;
    }

    const virtual = this._virtuals[path] = {
      SchemaType: VirtualType,
      options: options,
      getset: {
        get: function(fn) {
          options.get = fn;
          return this;
        },
        set: function(fn) {
          options.set = fn;
          return this;
        }
      }
    };

    return virtual.getset;
  }

  alias(to, from) {
    this.virtual(from).get(function() {
      return this[to];
    }).set(function(value) {
      this[to] = value;
    });

    return this;
  }

  pre(name, async, fn) {
    this._hooks.pre(name, async, fn);
    return this;
  }

  post(name, async, fn) {
    this._hooks.post(name, async, fn);
    return this;
  }

  plugin(pluginFn, options = {}) {
    pluginFn(this, options);
    return this;
  }

  path(path, ...args) {
    if (args.length === 0) {
      const prop = this.getPath(path, true);
      if (!prop) {
        return prop;
      }

      return Schema.toMongoose(prop, path);
    }

    this.setPath(path, args[0]);
    return this;
  }

  traverse(fn, traverseChildren, parentPath) {
    const props = this._props;
    const virtuals = this._virtuals;

    Object.keys(props).forEach(function(name) {
      const prop = props[name];
      const path = parentPath ? parentPath + '.' + name : name;

      const canTraverseChildren = fn(name, prop, path, false);
      if (canTraverseChildren === false || !traverseChildren) {
        return;
      }

      if (prop.type instanceof Schema) {
        prop.type.traverse(fn, traverseChildren, path);
      }

      if (prop.item && prop.item.type instanceof Schema) {
        prop.item.type.traverse(fn, traverseChildren, path);
      }
    });

    // traverse virtual poroperties
    Object.keys(virtuals).forEach(function(name) {
      const prop = virtuals[name];
      const path = parentPath ? parentPath + '.' + name : name;

      fn(name, prop, path, true);
    });

    return this;
  }

  eachPath(fn) {
    this.traverse(function(name, prop, path, isVirtual) {
      if (isVirtual) {
        return false;
      }

      const config = Schema.toMongoose(prop, path);
      if (!config) {
        return void 0;
      }

      fn(path, config);

      if (prop.item) {
        return false;
      }
    }, true);
  }

  normalizeOptions(options) {
    if (!options) {
      return null;
    }

    // convert basic types
    const basicTypes = [String, Number, Boolean, Date];
    if (basicTypes.indexOf(options) !== -1) {
      options = {
        type: options
      };
    }

    // if it is one of our types
    if (_.isFunction(options)) {
      options = {
        type: options
      };
    }

    // 1. convert objects
    if (_.isPlainObject(options) && (!options.type || options.type.type)) {
      options = {
        type: options
      };
    }

    // 2. prepare array
    if (_.isArray(options)) {
      options = {
        type: options
      };
    }

    let type = options instanceof Schema
      ? options
      : options.type;

    const SubSchema = this.getSubdocumentSchemaConstructor();

    // create schema from plain object
    if (_.isPlainObject(type)) {
      type = Object.keys(type).length
        ? new SubSchema(type)
        : MixedType;
    }

    const normalised = {
      schema: this,
      type: type,
      SchemaType: this.convertType(type),
      options: options
    };

    if (_.isArray(type)) {
      const itemOptions = type.length ? type[0] : { type: MixedType };
      normalised.item = this.normalizeOptions(itemOptions);
    }

    return normalised;
  }

  static toMongoose(prop, path) {
    const options = prop.options || {};

    if (prop.type instanceof Schema) {
      return void 0;
    }

    const config = {
      path: path,
      instance: prop.SchemaType.toString(),
      setters: [],
      getters: [],
      options: options,
      defaultValue: options.default
    };

    if (prop.item) {
      if (prop.item.type instanceof Schema) {
        config.schema = prop.item.type;
      }
    }

    return config;
  }
}
