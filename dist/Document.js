'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _EventEmitter2 = require('events');

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var Document = (function (_EventEmitter) {
	function Document(model, properties, options) {
		_classCallCheck(this, Document);

		_get(Object.getPrototypeOf(Document.prototype), 'constructor', this).call(this);

		properties = properties || {};

		this._model = model;
		this._data = new model.schema.DataClass(properties, model.name);
		this._options = options || {};

		this._from = null;
		this._to = null;

		this._isNew = true;
	}

	_inherits(Document, _EventEmitter);

	_createClass(Document, [{
		key: 'currentModel',
		get: function () {
			return this._model;
		}
	}, {
		key: 'from',
		value: function from(value) {
			this._from = value;
			return this;
		}
	}, {
		key: 'to',
		value: function to(value) {
			this._to = value;
			return this;
		}
	}, {
		key: 'model',
		value: function model(name) {
			return this._model.model(name);
		}
	}, {
		key: 'get',
		value: function get(path) {
			return this._data.get(path);
		}
	}, {
		key: 'set',
		value: function set(path, value) {
			this._data.set(path, value);
			return this;
		}
	}, {
		key: 'isNew',
		get: function () {
			return this._isNew;
		}
	}, {
		key: 'isModified',
		value: function isModified(path) {
			return this._data.isModified(path);
		}
	}, {
		key: 'setupData',
		value: function setupData(properties) {
			this._data.setupData(properties);
			this._isNew = false;
			return this;
		}
	}, {
		key: 'toJSON',
		value: function toJSON(options) {
			options = options || {};

			if (typeof options.transformDocument === 'function') {
				var value = options.transformDocument(this);
				if (typeof value !== 'undefined') {
					return value;
				}
			}

			return this._data.toJSON(options);
		}
	}, {
		key: 'toObject',
		value: function toObject(options) {
			options = options || {};

			if (typeof options.transformDocument === 'function') {
				var value = options.transformDocument(this);
				if (typeof value !== 'undefined') {
					return value;
				}
			}

			return this._data.toObject(options);
		}
	}, {
		key: 'forEach',
		value: function forEach(returnType, fn) {
			return this._data.forEach(returnType, fn);
		}
	}, {
		key: 'save',
		value: function save(options, callback) {
			var _this = this;

			if (typeof options === 'function') {
				callback = options;
				options = {};
			}

			options = options || {};

			var hooks = this._model.schema.hooks;
			hooks.execPre('validate', this, function (error) {
				if (error) {
					return callback(error);
				}

				hooks.execPre('save', _this, function (error) {
					if (error) {
						return callback(error);
					}

					if (_this.isNew) {
						var properties = _this.toObject({
							metadata: true,
							create: true
						});

						_this._model.create(properties).from(_this._from).to(_this._to).options(options).exec(function (error, user) {
							if (error) {
								return callback(error);
							}

							_this.setupData(user.toJSON({
								metadata: true
							}));

							callback(null, _this);
						});

						return;
					}

					var properties = _this.toObject({
						metadata: true,
						modified: true,
						update: true
					});

					_this._model.update(_this, properties, options).exec(function (err, total) {
						if (err) {
							return callback(err);
						}

						_this.setupData(properties);
						callback(null, _this);
					});
				});
			});
		}
	}, {
		key: 'remove',
		value: function remove(callback) {
			var _this2 = this;

			var model = this._model;
			var hooks = model.schema.hooks;

			if (this.isNew) {
				return callback(null, this);
			}

			hooks.execPre('remove', this, function (error) {
				if (error) {
					return callback(error);
				}

				model.remove(_this2, callback);
			});
		}
	}], [{
		key: 'isDocumentClass',
		get: function () {
			return true;
		}
	}, {
		key: 'findById',
		value: function findById(id, callback) {
			this.findOne(id, callback);
		}
	}, {
		key: 'findOne',
		value: function findOne(conditions, callback) {
			return this.currentModel.findOne(conditions, callback);
		}
	}, {
		key: 'find',
		value: function find(conditions, callback) {
			return this.currentModel.find(conditions, callback);
		}
	}, {
		key: 'findOneAndUpdate',
		value: function findOneAndUpdate(conditions, doc, options, callback) {
			return this.currentModel.findOneAndUpdate(conditions, doc, options, callback);
		}
	}, {
		key: 'create',
		value: function create(properties, options, callback) {
			if (typeof options === 'function') {
				callback = options;
				options = {};
			}

			options = options || {};

			return new this(properties, options).save(callback);
		}
	}, {
		key: 'update',
		value: function update(conditions, doc, options, callback) {
			return this.currentModel.update(conditions, doc, options, callback);
		}
	}, {
		key: 'remove',
		value: function remove(conditions, callback) {
			return this.currentModel.remove(conditions, callback);
		}
	}, {
		key: 'createClass',
		value: function createClass(model) {
			var DocumentModel = (function (_Document) {
				function DocumentModel(properties) {
					_classCallCheck(this, DocumentModel);

					_get(Object.getPrototypeOf(DocumentModel.prototype), 'constructor', this).call(this, model, properties);
				}

				_inherits(DocumentModel, _Document);

				_createClass(DocumentModel, null, [{
					key: 'model',

					/**
     Frized api mongoose
     */
					value: (function (_model) {
						function model(_x) {
							return _model.apply(this, arguments);
						}

						model.toString = function () {
							return _model.toString();
						};

						return model;
					})(function (modelName) {
						return model.model(modelName);
					})
				}, {
					key: 'modelName',

					/**
     Frized api mongoose
     */
					get: function () {
						return model.name;
					}
				}, {
					key: 'currentModel',
					get: function () {
						return model;
					}
				}]);

				return DocumentModel;
			})(Document);

			;

			var schema = model.schema;

			//add basic data getters and setters
			schema.traverse(function (fieldName, fieldOptions) {
				Object.defineProperty(DocumentModel.prototype, fieldName, {
					enumerable: true,
					configurable: true,
					get: function get() {
						return this.get(fieldName);
					},
					set: function set(value) {
						this.set(fieldName, value);
						return this;
					}
				});
			});

			//add methods
			for (var methodName in schema.methods) {
				var fn = schema.methods[methodName];
				DocumentModel.prototype[methodName] = fn;
			}

			//add statics
			for (var staticName in schema.statics) {
				var fn = schema.statics[staticName];
				DocumentModel[staticName] = fn;
			}

			return DocumentModel;
		}
	}]);

	return Document;
})(_EventEmitter2.EventEmitter);

exports['default'] = Document;
module.exports = exports['default'];