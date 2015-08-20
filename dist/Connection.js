'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _events = require('events');

var _Model = require('./Model');

var _Model2 = _interopRequireDefault(_Model);

var Connection = (function (_EventEmitter) {
  _inherits(Connection, _EventEmitter);

  function Connection(adapter) {
    var callback = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];

    _classCallCheck(this, Connection);

    _get(Object.getPrototypeOf(Connection.prototype), 'constructor', this).call(this);

    this._adapter = adapter;
    this._models = new Map();

    adapter.prepare(callback);
  }

  _createClass(Connection, [{
    key: 'ensureClass',
    value: function ensureClass(model, callback) {
      this.adapter.ensureClass(model, callback);
    }
  }, {
    key: 'query',
    value: function query(model, options) {
      return this.adapter.query(model, options);
    }
  }, {
    key: 'model',
    value: function model(name, schema, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }

      options = options || {};
      callback = callback || function () {};

      if (typeof schema === 'undefined') {
        if (!this._models.has(name)) {
          throw new Error('Model ' + name + ' does not exists');
        }

        return this._models.get(name).DocumentClass;
      }

      if (this._models.has(name)) {
        throw new Error('Model already exists');
      }

      this._models.set(name, new _Model2['default'](name, schema, this, options, function (err, model) {
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
  }, {
    key: 'modelNames',
    value: function modelNames() {
      return this._models.keys();
    }
  }, {
    key: 'native',
    get: function get() {
      return this.adapter.native;
    }
  }, {
    key: 'adapter',
    get: function get() {
      return this._adapter;
    }
  }]);

  return Connection;
})(_events.EventEmitter);

exports['default'] = Connection;
module.exports = exports['default'];