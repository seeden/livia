import Type from './Type';

export default class DateType extends Type {
  _serialize(value) {
    if (value instanceof Number || typeof value === 'number' || String(value) == Number(value)) {
      value = Number(value);
    }

    return new Date(value);
  }

  _deserialize(value) {
    return value;
  }

  toJSON(options) {
    return this.toObject(options);
  }

  toObject() {
    const value = this.value;
    return value && value.getTime
      ? value.getTime()
      : value;
  }

  static toString() {
    return 'Date';
  }

  static getDbType() {
    return 'DATETIME';
  }
}
