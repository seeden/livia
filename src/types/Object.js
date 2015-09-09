import Type from './Type';
import _ from 'lodash';

export default class ObjectType extends Type {
  constructor(data, prop, name, mainData) {
    super(data, prop, name, mainData);

    if (typeof this._default === 'undefined') {
      this._default = {}; // MONGOOSE: default value
    }
  }

  get schema() {
    return this.prop.type;
  }

  _createData() {
    const className = this.data._className;
    const abstractClassName = Type.computeAbstractClassName(className, this.name);

    return new this.schema.DataClass(this, {}, abstractClassName, this.mainData);
  }

  _serialize(props) {
    if (!_.isObject(props)) {
      throw new Error(`Property ${this.name} value must be an object you gave: ${props}`);
    }

    const keys = Object.keys(props);
    const value = this._createData();

    keys.forEach(function(propName) {
      value.set(propName, props[propName]);
    });

    return value;
  }

  _deserialize(value) {
    return value;
  }

  get isModified() {
    return true;
    if (!this._value) {
      return this.original !== this.value;
    }

    let isModified = false;
    this._value.forEach(true, function(prop) {
      isModified = prop.isModified || isModified;
    });

    return isModified;
  }

  set(key, value) {
    const before = this._value;
    if (!this._value) {
      this._value = this._createData();
    }

    try {
      this._value.set(key, value);
    } catch(e) {
      this._value = before;
      throw e;
    }
  }

  get(path) {
    const value = this.serializedValue;
    if (!value) {
      return void 0;
    }

    return value.get(path);
  }

  static getDbType() {
    return 'EMBEDDED';
  }

  static toString() {
    return 'Object';
  }

  static get isObject() {
    return true;
  }

  static isEmbedded() {
    return true;
  }

  static isAbstract() {
    return true;
  }

  static getEmbeddedSchema(prop) {
    return prop.type;
  }
}
