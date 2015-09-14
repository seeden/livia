import Type from './Type';

export default class Virtual extends Type {
  _preSerialize(value) {
    return this._serialize(value);
  }

  _preDeserialize(value) {
    return this._deserialize(value);
  }

  _serialize(value) {
    this.applySet(this.mainData, value);
  }

  _deserialize() {
    return this.applyGet(this.mainData);
  }

  applyGet(scope) {
    if (!this.options.get) {
      throw new Error('Getter is not defined');
    }

    return this.options.get.call(scope, this, this.data);
  }

  applySet(scope, value) {
    if (!this.options.set) {
      return this;
    }

    this.options.set.call(scope, value, this, this.data);
    return this;
  }

  get isModified() {
    return false;
  }

  static toString() {
    return 'Virtual';
  }
}
