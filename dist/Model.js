"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _async = require("async");

var waterfall = _async.waterfall;
var each = _async.each;
var serial = _async.serial;

var extend = _interopRequire(require("node.extend"));

var debug = _interopRequire(require("debug"));

var _ = _interopRequire(require("lodash"));

var ModelBase = _interopRequire(require("./ModelBase"));

var Schema = _interopRequire(require("./schemas/Schema"));

var Document = _interopRequire(require("./Document"));

var log = debug("orientose:model");

var Model = (function (_ModelBase) {
	function Model(name, schema, connection, options, callback) {
		var _this = this;

		_classCallCheck(this, Model);

		if (!schema instanceof Schema) {
			throw new Error("This is not a schema");
		}

		if (!connection) {
			throw new Error("Connection is undefined");
		}

		if (typeof options === "function") {
			callback = options;
			options = {};
		}

		options = options || {};

		options.dropUnusedProperties = options.dropUnusedProperties || false;
		options.dropUnusedIndexes = options.dropUnusedIndexes || false;

		_get(Object.getPrototypeOf(Model.prototype), "constructor", this).call(this, name, options);

		callback = callback || function () {};

		this._schema = schema;
		this._connection = connection;

		this._DocumentClass = Document.createClass(this);

		if (options.ensure !== false) {
			return this.ensureClass(function (err, model) {
				if (err) {
					log("Model " + _this.name + ": " + err.message);
				}

				callback(err, model);
			});
		}

		callback(null, this);
	}

	_inherits(Model, _ModelBase);

	_createClass(Model, {
		DocumentClass: {
			get: function () {
				return this._DocumentClass;
			}
		},
		schema: {
			get: function () {
				return this._schema;
			}
		},
		connection: {
			get: function () {
				return this._connection;
			}
		},
		db: {
			get: function () {
				return this.connection.db;
			}
		},
		model: {
			value: function model(name) {
				return this.connection.model(name);
			}
		},
		ensureClass: {
			value: function ensureClass(callback) {
				this.connection.ensureClass(this, callback);
			}
		},
		createDocument: {
			value: function createDocument(properties, className) {
				var model = this.DocumentClass;
				if (className) {
					model = this.model(className);
				}

				if (!model) {
					throw new Error("There is no model for class: " + className);
				}

				return new model({}).setupData(properties);
			}
		},
		query: {
			value: function query(options) {
				return this.connection.query(this, options);
			}
		},
		create: {
			value: function create(doc, callback) {
				return this.query().create(doc, callback);
			}
		},
		update: {
			value: function update(conditions, doc, options, callback) {
				if (typeof options === "function") {
					callback = options;
					options = {};
				}

				options = options || {};

				return this.query().update(conditions, doc, options, callback);
			}
		},
		find: {
			value: function find(conditions, callback) {
				return this.query().find(conditions, callback);
			}
		},
		findOne: {
			value: function findOne(conditions, callback) {
				return this.query().findOne(conditions, callback);
			}
		},
		findOneAndUpdate: {
			value: function findOneAndUpdate(conditions, doc, options, callback) {
				if (typeof options === "function") {
					callback = options;
					options = {};
				}

				options = options || {};
				options.scalar = false;
				options["new"] = true;

				return this.query().update(conditions, doc, options, callback);
			}
		},
		remove: {
			value: function remove(conditions, callback) {
				return this.query().remove(conditions, callback);
			}
		}
	});

	return Model;
})(ModelBase);

module.exports = Model;