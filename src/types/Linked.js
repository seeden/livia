import _ from 'lodash';
import StringType from './String';
import Document from '../Document';

export default class LinkedType extends StringType {
  _serialize(value) {
    if (value instanceof Document) {
      return value;
    } else if (_.isPlainObject(value)) {
      const Doc = this.getDocumentClass();
      if (!Doc) {
        throw new Error(`Document is not defined for property ${this.name}`);
      }

      return new Doc(value);
    }

    return super._serialize(value);
  }

  get(path) {
    if (this._value instanceof Document) {
      return this._value.get(path);
    }

    return super.get(path);
  }

  set(path, value, setAsOriginal) {
    if (this._value instanceof Document) {
      return this._value.set(path, value, setAsOriginal);
    }

    return super.set(path, value, setAsOriginal);
  }

  isModified(path) {
    if (this._value instanceof Document) {
      return this._value.isModified(path);
    }

    return super.isModified(path);
  }

  setAsOriginal() {
    super.setAsOriginal();

    if (this._value instanceof Document) {
      return this._value.setAsOriginal(true);
    }

    return this;
  }
}
