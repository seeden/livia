import Type from './Type';

export default class SubType extends Type {
  get deserializedValue() {
    if (!this._deserializedValue) {
      this._deserializedValue = this._preDeserialize();
    }

    return this._deserializedValue;
  }
/*
  toObject(options = {}) {
    let opt = options;
    if (options.update && options.modified) {
      opt = {
        ...options,
        modified: false
      };
    }

    return super.toObject(opt);
  }

  toJSON(options = {}) {
    let opt = options;
    if (options.update && options.modified) {
      opt = {
        ...options,
        modified: false
      };
    }

    return super.toJSON(opt);
  }

  */
}
