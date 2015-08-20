import { EventEmitter } from 'events';

export default class ModelBase extends EventEmitter {
  constructor(name, options) {
    super();

    if (!name) {
      throw new Error('Model name is not defined');
    }

    this._name = name;
    this._options = options || {};
  }

  get name() {
    return this._name;
  }

  get options() {
    return this._options;
  }
}
