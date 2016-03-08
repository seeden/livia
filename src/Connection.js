import { EventEmitter } from 'events';
import Model from './Model';

export default class Connection extends EventEmitter {
  constructor(adapter, callback = function () {}) {
    super();

    this._adapter = adapter;
    this._models = new Map();

    adapter.prepare(callback);
  }

  get native() {
    return this.adapter.native;
  }

  get adapter() {
    return this._adapter;
  }

  ensureClass(model, callback) {
    this.adapter.ensureClass(model, callback);
  }

  query(model, options) {
    return this.adapter.query(model, options);
  }

  model(name, schema, options = {}, callback = function () {}) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    if (typeof schema === 'undefined') {
      if (!this._models.has(name)) {
        throw new Error(`Model ${name} does not exists`);
      }

      return this._models.get(name).DocumentClass;
    }

    if (this._models.has(name)) {
      throw new Error('Model already exists');
    }

    this._models.set(name, new Model(name, schema, this, options, function (err, model) {
      if (err) {
        return callback(err);
      }

      callback(null, model.DocumentClass);
    }));

    return this._models.get(name).DocumentClass;
  }

  /*
  Returns an array of model names created on this connection.
  */
  modelNames() {
    return this._models.keys();
  }
}
