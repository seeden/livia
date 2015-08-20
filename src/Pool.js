import { times, each } from 'async';

export default class Pool {
  constructor(options = {}) {
    this._options = options;

    this._next = 0;
    this._connections = [];
  }

  get options() {
    return this._options;
  }

  get size() {
    return this._connections.length;
  }

  createConnection(callback) {
    const options = this.options;
    const create = options.create;

    if (!create) {
      return callback(new Error('Create is not defined'));
    }

    create((err, conn) => {
      if (err) {
        return callback(err);
      }

      if (!conn) {
        return callback(new Error('Connection is undefined'));
      }

      this._connections.push(conn);

      callback(null);
    });
  }

  destroyConnection(conn, callback) {
    const options = this.options;
    const destroy = options.destroy;

    if (!destroy) {
      return callback(new Error('Destroy is not defined'));
    }

    destroy(conn, (err) => {
      if (err) {
        return callback(err);
      }

      const pos = this._connections.indexOf(conn);
      if (pos !== -1) {
        this._connections.splice(pos, 1);
      }

      callback(null);
    });
  }

  get next() {
    if (!this._connections.length) {
      throw new Error('There is no connection');
    }

    let next = this._next;
    const conn = this._connections[next];

    next++;
    if (next >= this.size) {
      next = 0;
    }

    this._next = next;

    return conn;
  }

  resize(newSize, callback) {
    const count = newSize - this.size;

    if (count > 0) {
      times(count, (n, next) => this.createConnection(next), callback);
      return;
    }

    callback(null);
  }

  close(callback) {
    each(this._connections, (conn, cb) => {
      this.destroyConnection(conn, cb);
    }, callback);
  }
}
