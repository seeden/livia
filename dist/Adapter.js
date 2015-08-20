'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Pool = require('./Pool');

var _Pool2 = _interopRequireDefault(_Pool);

var DEFAULT_POOL_SIZE = 5;

var Adapter = (function () {
  function Adapter() {
    var _this = this;

    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Adapter);

    this._options = options;

    this._pool = new _Pool2['default']({
      create: function create(cb) {
        return _this.createConnection(cb);
      },
      destroy: function destroy(conn, cb) {
        return _this.destroyConnection(conn, cb);
      }
    });
  }

  _createClass(Adapter, [{
    key: 'prepare',
    value: function prepare(callback) {
      var poolSize = this.options.poolSize || DEFAULT_POOL_SIZE;

      this._pool.resize(poolSize, callback);
    }
  }, {
    key: 'createConnection',
    value: function createConnection() /* callback */{
      throw new Error('Please override createConnection method');
    }
  }, {
    key: 'destroyConnection',
    value: function destroyConnection() /* conn, callback */{
      throw new Error('Please override destroyConnection method');
    }
  }, {
    key: 'ensureClass',
    value: function ensureClass() /* model, callback */{
      throw new Error('Please override ensureClass method');
    }
  }, {
    key: 'query',
    value: function query() /* model, options */{
      throw new Error('Please override query method');
    }
  }, {
    key: 'close',
    value: function close(callback) {
      this._pool.close(callback);
    }
  }, {
    key: 'options',
    get: function get() {
      return this._options;
    }
  }, {
    key: 'native',
    get: function get() {
      return this._pool.next;
    }
  }]);

  return Adapter;
})();

exports['default'] = Adapter;
module.exports = exports['default'];