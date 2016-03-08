import { EventEmitter } from 'events';
import isArray from 'lodash/isArray';

import Types from '../types/index';

export default class SchemaBase extends EventEmitter {
  constructor(options = {}) {
    super();

    this._props = {};
    this._options = options;
  }

  get options() {
    return this._options;
  }

  convertType(type, options = {}) {
    if (!type) {
      throw new Error('Type is not defined');
    } else if (type.isSchemaType) {
      return type;
    } else if (type instanceof SchemaBase) {
      return Types.Object;
    } else if (type.isDocumentClass) {
      return Types.Linked;
    } else if (isArray(type)) {
      return Types.Array;
    } else if (type === String) {
      return Types.String;
    } else if (type === Number) {
      return Types.Number;
    } else if (type === Boolean) {
      return Types.Boolean;
    } else if (type === Date) {
      return Types.Date;
    }

    throw new Error('Unrecognized type');
  }
}
