import Type from './Type';

export default class SubType extends Type {
  get deserializedValue() {
    if (!this._deserializedValue) {
      this._deserializedValue = this._preDeserialize();
    }

    return this._deserializedValue;
  }
}
