'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _async = require('async');

var Pool = (function () {
  function Pool() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Pool);

    this._options = options;

    this._next = 0;
    this._connections = [];
  }

  _createClass(Pool, [{
    key: 'createConnection',
    value: function createConnection(callback) {
      var _this = this;

      var options = this.options;
      var create = options.create;

      if (!create) {
        return callback(new Error('Create is not defined'));
      }

      create(function (err, conn) {
        if (err) {
          return callback(err);
        }

        if (!conn) {
          return callback(new Error('Connection is undefined'));
        }

        _this._connections.push(conn);

        callback(null);
      });
    }
  }, {
    key: 'destroyConnection',
    value: function destroyConnection(conn, callback) {
      var _this2 = this;

      var options = this.options;
      var destroy = options.destroy;

      if (!destroy) {
        return callback(new Error('Destroy is not defined'));
      }

      destroy(conn, function (err) {
        if (err) {
          return callback(err);
        }

        var pos = _this2._connections.indexOf(conn);
        if (pos !== -1) {
          _this2._connections.splice(pos, 1);
        }

        callback(null);
      });
    }
  }, {
    key: 'resize',
    value: function resize(newSize, callback) {
      var _this3 = this;

      var count = newSize - this.size;

      if (count > 0) {
        (0, _async.times)(count, function (n, next) {
          return _this3.createConnection(next);
        }, callback);
        return;
      }

      callback(null);
    }
  }, {
    key: 'close',
    value: function close(callback) {
      var _this4 = this;

      (0, _async.each)(this._connections, function (conn, cb) {
        _this4.destroyConnection(conn, cb);
      }, callback);
    }
  }, {
    key: 'options',
    get: function get() {
      return this._options;
    }
  }, {
    key: 'size',
    get: function get() {
      return this._connections.length;
    }
  }, {
    key: 'next',
    get: function get() {
      if (!this._connections.length) {
        throw new Error('There is no connection');
      }

      var next = this._next;
      var conn = this._connections[next];

      next++;
      if (next >= this.size) {
        next = 0;
      }

      this._next = next;

      return conn;
    }
  }]);

  return Pool;
})();

exports['default'] = Pool;
module.exports = exports['default'];