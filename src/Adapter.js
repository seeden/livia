import Pool from './Pool';

const DEFAULT_POOL_SIZE = 5;

export default class Adapter {
  constructor(options = {}) {
    this._options = options;

    this._pool = new Pool({
      create: (cb) => this.createConnection(cb),
      destroy: (conn, cb) => this.destroyConnection(conn, cb)
    });
  }

  get options() {
    return this._options;
  }

  get native() {
    return this._pool.next;
  }

  prepare(callback) {
    const poolSize = this.options.poolSize || DEFAULT_POOL_SIZE;

    this._pool.resize(poolSize, callback);
  }

  createConnection(/* callback */) {
    throw new Error('Please override createConnection method');
  }

  destroyConnection(/* conn, callback */) {
    throw new Error('Please override destroyConnection method');
  }

  ensureClass(/* model, callback */) {
    throw new Error('Please override ensureClass method');
  }

  query(/* model, options */) {
    throw new Error('Please override query method');
  }

  close(callback) {
    this._pool.close(callback);
  }
}
