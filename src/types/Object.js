import SubType from './SubType';
import _ from 'lodash';

export default class ObjectType extends SubType {
  constructor(data, prop, name, mainData) {
    prop.options = prop.options || {};
    if (typeof prop.options.default === 'undefined') {
      prop.options.default = {}; // mongoose default value
    }

    super(data, prop, name, mainData);
  }

  get schema() {
    return this.prop.type;
  }

  get deserializedValue() {
    if (!this._value) {
      this._value = this._preDeserialize();
    }

    return this._value;
  }

  _createData() {
    const className = this.data._className;
    const abstractClassName = SubType.computeAbstractClassName(className, this.name);

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
    if (!this._value) {
      return this.original !== this._value;
    }

    let isModified = false;
    this._value.forEach(true, function(prop) {
      isModified = prop.isModified || isModified;
    });

    return isModified;
  }

  set(key, value, setAsOriginal) {
    const before = this._value;
    if (!this._value) {
      this._value = this._createData();
    }

    try {
      this._value.set(key, value, setAsOriginal);
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

  setAsOriginal() {
    this._value.forEach(true, (prop) => prop.setAsOriginal());
    return super.setAsOriginal();
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
