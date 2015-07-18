export default class Adapter {
  constructor(options = {}) {
    this._options = options;
  }

  get options() {
    return this._options;
  }

  get native() {
    throw new Error('Please override native getter');
  }

  connect(/*callback*/) {
    throw new Error('Please override connect method');
  }

  ensureClass(/*model, callback*/) {
    throw new Error('Please override ensureClass method');
  }

  query(/*model, options*/) {
    throw new Error('Please override query method');
  }
}
