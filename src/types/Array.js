import SubType from './SubType';
import _ from 'lodash';
import ExtendArray from '../utils/ExtendedArray';

export default class ArrayType extends SubType {
  constructor(data, prop, name, mainData) {
    if (!prop.item) {
      throw new Error('Type of the array item is not defined');
    }

    prop.options = prop.options || {};
    if (typeof prop.options.default === 'undefined') {
      prop.options.default = []; // mongoose default value
    }

    super(data, prop, name, mainData);
  }

  _createItem(value) {
    const item = new this.prop.item.SchemaType(this.data, this.prop.item, this.name, this.mainData);
    item.value = value;

    return item;
  }

  _initArrayValue() {
    if (this._value) {
      return;
    }

    // use default value
    this.value = this._default || [];
  }

  _throwIfUndefined() {
    if (!this.deserializedValue) {
      throw new Error('Array is undefined');
    }
  }

  _serialize(items) {
    return items.map((item) => this._createItem(item));
  }

  _deserialize(items) {
    return items.map(item => item.value);
  }

  set value(val) {
    this._customArray = null;
    super.value = val;
  }

  get value() {
    const value = this.deserializedValue;
    if (!value) {
      return value;
    }

    if (!this._customArray) {
      const arr = this._customArray = new ExtendArray(this);
      value.forEach(function(val, index) {
        arr[index] = val;
      });
    }

    return this._customArray;
  }

  get(path) {
    if (!path) {
      return this.value;
    }

    const value = this.serializedValue;
    if (!value) {
      return void 0;
    }

    const pos = path.indexOf('.');
    if (pos === -1) {
      const index = parseInt(path, 10);
      return value[index];
    }

    const index = parseInt(path.substr(0, pos), 10);
    const newPath = path.substr(pos + 1);

    const item = value[index];
    if (!item || !item.get) {
      return void 0;
    }

    return item.get(newPath);
  }

  set(path, value, setAsOriginal) {
    const before = this._value;

    try {
      const pos = path.indexOf('.');
      if (pos === -1) {
        const directItems = this.value;
        const index = parseInt(path, 10);

        directItems[index] = value;
        return;
      }


      const items = this.serializedValue;
      if (!items) {
        throw new Error('You need to initialize array first');
      }

      const index = parseInt(path.substr(0, pos), 10);
      const newPath = path.substr(pos + 1);

      const item = items[index];
      if (!item || !item.set) {
        throw new Error('You need to initialize array item first');
      }

      item.set(newPath, value, setAsOriginal);
      this._value = items;
    } catch(e) {
      this._value = before;
      throw e;
    }
  }

  toJSON(options = {}) {
    let opt = options;
    if (options.update && options.modified) {
      opt = {
        ...options,
        modified: false
      };
    }

    return this._preDeserialize(function(items) {
      return items.map((item) => item.toJSON(opt));
    }, options.disableDefault);
  }

  toObject(options = {}) {
    let opt = options;
    if (options.update && options.modified) {
      opt = {
        ...options,
        modified: false
      };
    }

    return this._preDeserialize(function(items) {
      return items.map((item) => item.toObject(opt));
    }, options.disableDefault);
  }

  isModified(path) {
    const value = this.deserializedValue;
    const original = this._original;

    if (!original || !value) {
      return original !== value;
    }

    if (original.length !== value.length) {
      return true;
    }

    for (let i = 0; i < value.length; i++) {
      const val = value[i];
      const org = original[i];
      const isObject = _.isObject(val);

      if (isObject && JSON.stringify(val) === JSON.stringify(org)) {
        continue;
      }

      if (value[i] !== original[i]) {
        return true;
      }
    }

    return false;
  }

  static toString() {
    return 'Array';
  }

  static getDbType(prop) {
    const options = prop.options || {};
    const item = prop.item;

    const isLink = item.type.isDocumentClass || (item.options && item.options.ref);

    // no from child, it is a setting for the  array
    const isSet = options.isSet;
    const isMap = options.isMap;

    const base = isLink ? 'LINK' : 'EMBEDDED';

    if (isSet) {
      return `${base}SET`;
    } else if (isMap) {
      return `${base}MAP`;
    }

    return `${base}LIST`;
  }

  static getPropertyConfig(prop) {
    const item = prop.item;

    if (item.type.isDocumentClass) {
      return {
        linkedClass: item.type.modelName
      };
    }

    if (item.options && item.options.ref) {
      return {
        linkedClass: item.options.ref
      };
    }

    return {
      linkedType: item.SchemaType.getDbType(item.options)
    };
  }

  static get isArray() {
    return true;
  }

  static isEmbedded(prop) {
    const dbType = ArrayType.getDbType(prop);
    return _.startsWith(dbType, 'EMBEDDED');
  }

  static isAbstract(prop) {
    const isEmbedded = this.isEmbedded(prop);
    if (!isEmbedded) {
      return false;
    }

    const item = prop.item;
    return item.SchemaType.isAbstract(item);
  }

  static getEmbeddedSchema(prop) {
    if (!ArrayType.isEmbedded(prop)) {
      return null;
    }

    const item = prop.item;
    return item.SchemaType.getEmbeddedSchema(item);
  }
}
