import _ from 'lodash';
import StringType from './String';
import Document from '../Document';

export default class LinkedType extends StringType {
  _serialize(value) {
    if (value instanceof Document) {
      return value;
    } else if (_.isPlainObject(value)) {
      return new this.options.type(value);
    }

    return super._serialize(value);
  }

  get(path) {
    if (this._value instanceof Document) {
      return this._value.get(path);
    }

    super.get(path);
  }

  set(path, value) {
    if (this._value instanceof Document) {
      return this._value.set(path, value);
    }

    super.set(path, value);
  }

  get isModified() {
    if (this._value instanceof Document) {
      return this._value.isModified();
    }

    return super.isModified;
  }

  get linkedClass() {
    const type = this.options.type;
    return type.modelName ? type.modelName : null;
  }
}
