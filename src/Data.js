import _ from 'lodash';
import debug from 'debug';
import VirtualType from './types/Virtual';
import Mixed from './types/Mixed';

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

  forEach(returnType, fn) {
    if (typeof returnType === 'function') {
      fn = returnType;
      returnType = false;
    }

    Object.keys(this._data).forEach(key => {
      const value = returnType ? this._data[key] : this.get(key);
      fn(value, key);
    });
  }

  toString() {
    return this.toJSON();
  }

  toJSON(options = {}) {
    const json = {};

    Object.keys(this._data).forEach(propName => {
      const prop = this._data[propName];

      if (prop.isRecordID && options.recordID) {
        const value = prop.toJSON(options);
        if (typeof value === 'undefined') {
          return;
        }

        if (typeof options.recordID === 'string') {
          propName = options.recordID;
        }

        json[propName] = value;
        return;
      }

      if (prop instanceof VirtualType && !options.virtuals) {
        return;
      }

      if (prop.isMetadata && !options.metadata) {
        return;
      }

      if (options.modified && !prop.isModified) {
        return;
      }

      if (typeof options.exclude === 'function' && options.exclude(prop.name, prop.options)) {
        return;
      }

      const value = prop.toJSON(options);
      if (typeof value === 'undefined') {
        return;
      }

      // MONGOOSE: empty object is undefined for parent
      if (_.isPlainObject(value) && !Object.keys(value).length) {
        return;
      }

      json[propName] = value;
    });

    return json;
  }

  toObject(options = {}) {
    const json = {};

    Object.keys(this._data).forEach(propName => {
      const prop = this._data[propName];

      if (prop instanceof VirtualType && !options.virtuals) {
        return;
      }

      if (prop.isMetadata && !options.metadata) {
        return;
      }

      if (options.modified && !prop.isModified) {
        return;
      }

      const value = prop.toObject(options);
      if (typeof value === 'undefined') {
        return;
      }

      // MONGOOSE: empty object is undefined for parent
      if (_.isPlainObject(value) && !Object.keys(value).length) {
        return;
      }

      json[propName] = value;
    });

    return json;
  }

  isModified(path) {
    if (typeof path === 'undefined') {
      let isModified = false;
      this.forEach(true, function(prop) {
        if (prop.isModified) {
          isModified = true;
        }
      });

      return isModified;
    }

    const pos = path.indexOf('.');
    if (pos === -1) {
      if (!this._data[path]) {
        log('isModified Path not exists:' + path);
        return null;
      }

      return this._data[path].isModified;
    }

    const currentKey = path.substr(0, pos);
    const newPath = path.substr(pos + 1);

    if (!this._data[currentKey]) {
      log('isModified deep Path not exists:' + currentKey);
      return null;
    }

    const data = this._data[currentKey];
    if (!data || !data.get) {
      return null;
    }

    return data.get(newPath);
  }

  get(path) {
    const pos = path.indexOf('.');
    if (pos === -1) {
      if (!this._data[path]) {
        log('get Path not exists:' + path);
        return void 0;
      }

      return this._data[path].value;
    }

    const currentKey = path.substr(0, pos);
    const newPath = path.substr(pos + 1);

    if (!this._data[currentKey]) {
      log('get deep Path not exists:' + currentKey, path, newPath);
      return void 0;
    }

    const data = this._data[currentKey];
    if (!data || !data.get) {
      return void 0;
    }

    return data.get(newPath);
  }

  setAsOriginal() {
    this.forEach(true, (item) => item.setAsOriginal());
  }

  set(path, value, setAsOriginal) {
    if (_.isPlainObject(path)) {
      Object.keys(path).forEach(key => {
        this.set(key, path[key], setAsOriginal);
      });
      return this;
    }

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

  defineMixedProperty(fieldName) {
    const schema = this._schema;

    const prop = {
      schema: schema,
      type: Mixed,
      SchemaType: schema.convertType(Mixed),
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
