import _ from 'lodash';

export default class Type {
  constructor(data, prop, name, mainData) {
    if (!data || !prop || !name || !mainData) {
      throw new Error('Data or prop is undefined');
    }

    const options = prop.options || {};

    this._data = data;
    this._mainData = mainData;
    this._prop = prop;
    this._options = options;
    this._name = name;

    this._default = options.default;

    this._value = void 0;
    this._original = void 0;

    this._handleNull = true;
    this._handleUndefined = true;
  }

  get data() {
    return this._data;
  }

  get mainData() {
    return this._mainData;
  }

  get original() {
    return this._original;
  }

  get options() {
    return this._options;
  }

  get prop() {
    return this._prop;
  }

  get name() {
    return this._name;
  }

  get hasDefault() {
    return typeof this._default !== 'undefined';
  }

  get isMetadata() {
    return !!this.options.metadata;
  }

  get isRecordID() {
    return !!this.options.isRecordID;
  }

  set value(value) {
    this._deserializedValue = null;
    this._value = this._preSerialize(value);
  }

  _preSerialize(value) {
    if (value === null && this._handleNull) {
      return value;
    } else if (typeof value === 'undefined' && this._handleUndefined) {
      return value;
    }

    return this._serialize(value);
  }

  _serialize(/*value*/) {
    throw new Error('You need to override _serialize');
  }

  _deserialize(/*value*/) {
    throw new Error('You need to override _deserialize');
  }

  get serializedValue() {
    let value = this._value;
    if (typeof value === 'undefined') {
      value = this.serializedDefaultValue;
    }

    return value;
  }

  get deserializedValue() {
    return this._preDeserialize();
  }

  get value() {
    return this.deserializedValue;
  }

  _preDeserialize(fn, disableDefault) {
    let value = this._value;

    if (typeof value === 'undefined' && !disableDefault) {
      value = this.serializedDefaultValue;
    }

    if (value === null && this._handleNull) {
      return value;
    } else if (typeof value === 'undefined' && this._handleUndefined) {
      return value;
    }

    return fn ? fn(value) : this._deserialize(value);
  }

  get serializedDefaultValue() {
    let value = this._default;
    if (typeof value === 'function') {
      value = value.apply(this.data);
    }

    return this._preSerialize(value);
  }

  setAsOriginal() {
    this._original = this._preDeserialize();
    return this;
  }

  rollback() {
    if (this.options.readonly) {
      return this;
    }

    this.value = this.original;
    return this;
  }

  get isModified() {
    return this.original !== this.value;
  }

  setupData(data) {
    this.value = data;
    this._original = data;

    // parent.childChanged(this);
  }

  toJSON(options = {}) {
    return this._preDeserialize(function(value) {
      return value && value.toJSON ? value.toJSON(options) : value;
    }, options.disableDefault);
  }

  toObject(options = {}) {
    return this._preDeserialize(function(value) {
      return value && value.toObject ? value.toObject(options) : value;
    }, options.disableDefault);
  }

  set(path, value) {
    throw new Error('Set path is not supported by this type ');
  }

  get(path) {
    throw new Error('Get path is not supported by this type ');
  }

  static toString() {
    throw new Error('Method toString is not defined');
  }

  static getDbType() {
    throw new Error('You need to override getter dbType');
  }

  static get isSchemaType() {
    return true;
  }

  static getPropertyConfig(/*options*/) {
    return {};
  }

  static computeAbstractClassName(className, propName) {
    return className + 'A' + _.capitalize(propName);
  }

  static isEmbedded(/*prop*/) {
    return false;
  }

  static isAbstract(/*prop*/) {
    return false;
  }

  static getEmbeddedSchema(/*prop*/) {
    return null;
  }
}
