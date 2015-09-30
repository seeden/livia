import _ from 'lodash';
import debug from 'debug';
import VirtualType from './types/Virtual';
import Mixed from './types/Mixed';
import { process } from './utils/props';

const log = debug('orientose:data');

export default class Data {
  constructor(holder, schema, properties = {}, className, mainData) {
    mainData = mainData || this;

    this._holder = holder;
    this._schema = schema;
    this._data = {};
    this._className = className;
    this._mainData = mainData;

    schema.traverse((propName, prop) => {
      this._data[propName] = new prop.SchemaType(this, prop, propName, mainData);
    });

    this.set(properties);
  }

  toString() {
    return this.toJSON();
  }

  canSkipProp(prop, options = {}, excludeAvailable = false) {
    const propOptions = prop.options;

    // virtual can be skiped always
    if (prop instanceof VirtualType && !options.virtuals) {
      return true;
    }

    // metadata can be skiped except explicit
    if (prop.isMetadata && !options.metadata) {
      if (!options.sub && ((options.create && propOptions.create) || (options.update && propOptions.update))) {
        return false;
      } else if (options.sub && ((options.create && propOptions.subCreate) || (options.update && propOptions.subUpdate))) {
        return false;
      }

      return true;
    }

    // child is always required (Object, Array)
    if (options.sub) {
      return false;
    }

    // modified can be skiped explicitli
    if (options.modified && !prop.isModified()) {
      return true;
    }

    if (excludeAvailable && typeof options.exclude === 'function' && options.exclude(prop.name, propOptions)) {
      return true;
    }

    return false;
  }

  toJSON(options = {}) {
    const obj = {};

    const opt = {
      ...options,
      sub: true
    };

    Object.keys(this._data).forEach(propName => {
      const prop = this._data[propName];

      // move record id to different variable
      if (prop.isRecordID && options.recordID) {
        const value = prop.toJSON(opt);
        if (typeof value === 'undefined') {
          return;
        }

        if (typeof options.recordID === 'string') {
          propName = options.recordID;
        }

        obj[propName] = value;
        return;
      }

      if (this.canSkipProp(prop, options, true)) {
        return;
      }

      const value = prop.toJSON(opt);
      if (typeof value === 'undefined') {
        return;
      }

      // MONGOOSE: empty object is undefined for parent
      if (_.isPlainObject(value) && !Object.keys(value).length) {
        return;
      }

      obj[propName] = value;
    });

    return obj;
  }

  toObject(options = {}) {
    const obj = {};

    const opt = {
      ...options,
      sub: true
    };

    Object.keys(this._data).forEach(propName => {
      const prop = this._data[propName];

      if (this.canSkipProp(prop, options)) {
        return;
      }

      const value = prop.toObject(opt);
      if (typeof value === 'undefined') {
        return;
      }

      // MONGOOSE: empty object is undefined for parent
      if (_.isPlainObject(value) && !Object.keys(value).length) {
        return;
      }

      obj[propName] = value;
    });

    return obj;
  }

  isModified(path) {
    return process(this._data, path, 'isModified', false, function(data) {
      let isModified = false;

      Object.keys(data).forEach(function(propName) {
        const prop = data[propName];
        isModified = prop.isModified() || isModified;
      });

      return isModified;
    });
  }

  get(path) {
    return process(this._data, path, 'get', void 0, function(data) {
      return data;
    });
  }

  set(path, value, setAsOriginal) {
    if (_.isPlainObject(path)) {
      Object.keys(path).forEach(key => {
        this.set(key, path[key], setAsOriginal);
      });

      return this;
    }

    // TODO replace with props.process
    const pos = path.indexOf('.');
    if (pos === -1) {
      let property = this._data[path];
      if (!property) {
        const schema = this._schema;
        if (schema.isStrict) {
          log('set Path not exists:' + path);
          return this;
        }

        property = this.defineMixedProperty(path);
      }

      property.value = value;

      if (setAsOriginal) {
        property.setAsOriginal();
      }

      return this;
    }

    const currentKey = path.substr(0, pos);
    const newPath = path.substr(pos + 1);

    if (!this._data[currentKey]) {
      log('set deep Path not exists:' + currentKey);
      return this;
    }

    const data = this._data[currentKey];
    if (!data || !data.set) {
      return this;
    }

    data.set(newPath, value, setAsOriginal);
    return this;
  }

  setupData(properties) {
    this.set(properties, null, true);
  }

  setAsOriginal() {
    Object.keys(this._data).forEach((propName) => this._data[propName].setAsOriginal());
  }

  defineMixedProperty(fieldName) {
    const schema = this._schema;

    const prop = {
      schema: schema,
      type: Mixed,
      SchemaType: schema.convertType(Mixed, {}),
      options: {}
    };

    const property = this._data[fieldName] = new prop.SchemaType(this, prop, fieldName, this._mainData);

    // define getter and setter for holder
    Object.defineProperty(this._holder, fieldName, {
      enumerable: true,
      configurable: true,
      get: () => this.get(fieldName),
      set: (value) => this.set(fieldName, value)
    });

    return property;
  }

  static createClass(schema) {
    class DataClass extends Data {
      constructor(holder, properties, className, mainData) {
        super(holder, schema, properties, className, mainData);
      }
    }

    // define properties
    schema.traverse(function(fieldName) {
      Object.defineProperty(DataClass.prototype, fieldName, {
        enumerable: true,
        configurable: true,
        get: function() {
          return this.get(fieldName);
        },
        set: function(value) {
          return this.set(fieldName, value);
        }
      });
    });

    return DataClass;
  }
}
