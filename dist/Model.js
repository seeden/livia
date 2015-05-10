'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _waterfall$each$serial = require('async');

var _extend = require('node.extend');

var _extend2 = _interopRequireWildcard(_extend);

var _debug = require('debug');

var _debug2 = _interopRequireWildcard(_debug);

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var _ModelBase2 = require('./ModelBase');

var _ModelBase3 = _interopRequireWildcard(_ModelBase2);

var _Schema = require('./schemas/Schema');

var _Schema2 = _interopRequireWildcard(_Schema);

var _Document = require('./Document');

var _Document2 = _interopRequireWildcard(_Document);

var log = _debug2['default']('orientose:model');

var Model = (function (_ModelBase) {
	function Model(name, schema, connection, options, callback) {
		var _this = this;

		_classCallCheck(this, Model);

		if (!schema instanceof _Schema2['default']) {
			throw new Error('This is not a schema');
		}

		if (!connection) {
			throw new Error('Connection is undefined');
		}

		if (typeof options === 'function') {
			callback = options;
			options = {};
		}

		options = options || {};

		options.dropUnusedProperties = options.dropUnusedProperties || false;
		options.dropUnusedIndexes = options.dropUnusedIndexes || false;

		_get(Object.getPrototypeOf(Model.prototype), 'constructor', this).call(this, name, options);

		callback = callback || function () {};

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

	_inherits(Model, _ModelBase);

	_createClass(Model, [{
		key: 'DocumentClass',
		get: function () {
			return this._DocumentClass;
		}
	}, {
		key: 'schema',
		get: function () {
			return this._schema;
		}
	}, {
		key: 'connection',
		get: function () {
			return this._connection;
		}
	}, {
		key: 'native',
		get: function () {
			return this.connection.native;
		}
	}, {
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
			var model = this.DocumentClass;
			if (className) {
				model = this.model(className);
			}

			if (!model) {
				throw new Error('There is no model for class: ' + className);
			}

			return new model({}).setupData(properties);
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
			if (typeof options === 'function') {
				callback = options;
				options = {};
			}

			options = options || {};

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
			if (typeof options === 'function') {
				callback = options;
				options = {};
			}

			options = options || {};
			options.scalar = false;
			options['new'] = true;

			return this.query().update(conditions, doc, options, callback);
		}
	}, {
		key: 'remove',
		value: function remove(conditions, callback) {
			return this.query().remove(conditions, callback);
		}
	}]);

	return Model;
})(_ModelBase3['default']);

exports['default'] = Model;
module.exports = exports['default'];