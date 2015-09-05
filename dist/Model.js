'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _ModelBase2 = require('./ModelBase');

var _ModelBase3 = _interopRequireDefault(_ModelBase2);

var _schemasSchema = require('./schemas/Schema');

var _schemasSchema2 = _interopRequireDefault(_schemasSchema);

var _schemasEdge = require('./schemas/Edge');

var _schemasEdge2 = _interopRequireDefault(_schemasEdge);

var _Document = require('./Document');

var _Document2 = _interopRequireDefault(_Document);

var log = (0, _debug2['default'])('orientose:model');

var Model = (function (_ModelBase) {
  _inherits(Model, _ModelBase);

  function Model(name, schema, connection) {
    var _this = this;

    var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
    var callback = arguments.length <= 4 || arguments[4] === undefined ? function () {} : arguments[4];

    _classCallCheck(this, Model);

    if (!name) {
      throw new Error('Name is undefined');
    }

    if (!schema instanceof _schemasSchema2['default']) {
      throw new Error('This is not a schema');
    }

    if (!connection) {
      throw new Error('Connection is undefined');
    }

    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    _get(Object.getPrototypeOf(Model.prototype), 'constructor', this).call(this, name, options);

    this._schema = schema;
    this._connection = connection;

    this._DocumentClass = _Document2['default'].createClass(this);

    if (options.ensure === false) {
      return callback(null, this);
    }

    this.ensureClass(function (err, model) {
      if (err) {
        log('Model ' + _this.name + ': ' + err.message);
      }

      callback(err, model);
    });
  }

  _createClass(Model, [{
    key: 'model',
    value: function model(name) {
      return this.connection.model(name);
    }
  }, {
    key: 'ensureClass',
    value: function ensureClass(callback) {
      this.connection.ensureClass(this, callback);
    }
  }, {
    key: 'createDocument',
    value: function createDocument(properties, className) {
      var ModelClass = this.DocumentClass;
      if (className) {
        ModelClass = this.model(className);
      }

      if (!ModelClass) {
        throw new Error('There is no model for class: ' + className);
      }

      return new ModelClass({}).setupData(properties);
    }
  }, {
    key: 'query',
    value: function query(options) {
      return this.connection.query(this, options);
    }
  }, {
    key: 'create',
    value: function create(doc, callback) {
      return this.query().create(doc, callback);
    }
  }, {
    key: 'update',
    value: function update(conditions, doc, options, callback) {
      if (options === undefined) options = {};

      if (typeof options === 'function') {
        callback = options;
        options = {};
      }

      return this.query().update(conditions, doc, options, callback);
    }
  }, {
    key: 'find',
    value: function find(conditions, callback) {
      return this.query().find(conditions, callback);
    }
  }, {
    key: 'findOne',
    value: function findOne(conditions, callback) {
      return this.query().findOne(conditions, callback);
    }
  }, {
    key: 'findOneAndUpdate',
    value: function findOneAndUpdate(conditions, doc, options, callback) {
      if (options === undefined) options = {};

      if (typeof options === 'function') {
        callback = options;
        options = {};
      }

      options.scalar = false;
      options['new'] = true;

      return this.query().update(conditions, doc, options, callback);
    }
  }, {
    key: 'remove',
    value: function remove(conditions, callback) {
      return this.query().remove(conditions, callback);
    }
  }, {
    key: 'findOneAndRemove',
    value: function findOneAndRemove(conditions, options, callback) {
      if (options === undefined) options = {};

      if (typeof options === 'function') {
        callback = options;
        options = {};
      }

      options.limit = 1;

      return this.query().remove(conditions).options(options).exec(callback);
    }
  }, {
    key: 'DocumentClass',
    get: function get() {
      return this._DocumentClass;
    }
  }, {
    key: 'schema',
    get: function get() {
      return this._schema;
    }
  }, {
    key: 'connection',
    get: function get() {
      return this._connection;
    }
  }, {
    key: 'native',
    get: function get() {
      return this.connection.native;
    }
  }, {
    key: 'isEdge',
    get: function get() {
      return this.schema instanceof _schemasEdge2['default'];
    }
  }]);

  return Model;
})(_ModelBase3['default']);

exports['default'] = Model;
module.exports = exports['default'];