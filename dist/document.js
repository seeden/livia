"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var EventEmitter = require("events").EventEmitter;

var _ = _interopRequire(require("lodash"));

var Document = (function (_EventEmitter) {
	function Document(model, properties, options) {
		_classCallCheck(this, Document);

		_get(Object.getPrototypeOf(Document.prototype), "constructor", this).call(this);

		properties = properties || {};

		this._model = model;
		this._data = new model.schema.DataClass(properties, model.name);
		this._options = options || {};

		this._from = null;
		this._to = null;

		this._isNew = true;
	}

	_inherits(Document, _EventEmitter);

	_createClass(Document, {
		from: {
			value: function from(value) {
				this._from = value;
				return this;
			}
		},
		to: {
			value: function to(value) {
				this._to = value;
				return this;
			}
		},
		model: {
			value: function model(name) {
				return this._model.model(name);
			}
		},
		get: {
			value: function get(path) {
				return this._data.get(path);
			}
		},
		set: {
			value: function set(path, value) {
				this._data.set(path, value);
				return this;
			}
		},
		isNew: {
			get: function () {
				return this._isNew;
			}
		},
		isModified: {
			value: function isModified(path) {
				return this._data.isModified(path);
			}
		},
		setupData: {
			value: function setupData(properties) {
				this._data.setupData(properties);
				this._isNew = false;
				return this;
			}
		},
		toJSON: {
			value: function toJSON(options) {
				return this._data.toJSON(options);
			}
		},
		toObject: {
			value: function toObject(options) {
				return this._data.toObject(options);
			}
		},
		forEach: {
			value: function forEach(returnType, fn) {
				return this._data.forEach(returnType, fn);
			}
		},
		save: {
			value: function save(options, callback) {
				var _this = this;

				if (typeof options === "function") {
					callback = options;
					options = {};
				}

				options = options || {};

				var hooks = this._model.schema.hooks;
				hooks.execPre("validate", this, function (error) {
					if (error) {
						return callback(error);
					}

					hooks.execPre("save", _this, function (error) {
						if (error) {
							return callback(error);
						}

						if (_this.isNew) {
							var properties = _this.toObject({
								metadata: true,
								create: true
							});

							console.log(properties);

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

						console.log(properties);

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
		},
		remove: {
			value: function remove(callback) {
				var _this = this;

				var model = this._model;
				var hooks = model.schema.hooks;

				if (this.isNew) {
					return callback(null, this);
				}

				hooks.execPre("remove", this, function (error) {
					if (error) {
						return callback(error);
					}

					model.remove(_this, callback);
				});
			}
		}
	}, {
		findById: {
			value: function findById(id, callback) {
				this.findOne(id, callback);
			}
		},
		findOne: {
			value: function findOne(conditions, callback) {
				return this.currentModel.findOne(conditions, callback);
			}
		},
		find: {
			value: function find(conditions, callback) {
				return this.currentModel.find(conditions, callback);
			}
		},
		findOneAndUpdate: {
			value: function findOneAndUpdate(conditions, doc, options, callback) {
				return this.currentModel.findOneAndUpdate(conditions, doc, options, callback);
			}
		},
		create: {
			value: function create(properties, options, callback) {
				if (typeof options === "function") {
					callback = options;
					options = {};
				}

				options = options || {};

				return new this(properties, options).save(callback);
			}
		},
		update: {
			value: function update(conditions, doc, options, callback) {
				return this.currentModel.update(conditions, doc, options, callback);
			}
		},
		remove: {
			value: function remove(conditions, callback) {
				return this.currentModel.remove(conditions, callback);
			}
		},
		createClass: {
			value: function createClass(model) {
				var DocumentModel = (function (_Document) {
					function DocumentModel(properties) {
						_classCallCheck(this, DocumentModel);

						_get(Object.getPrototypeOf(DocumentModel.prototype), "constructor", this).call(this, model, properties);
					}

					_inherits(DocumentModel, _Document);

					_createClass(DocumentModel, null, {
						model: {

							/**
       Frized api mongoose
       */

							value: (function (_model) {
								var _modelWrapper = function model(_x) {
									return _model.apply(this, arguments);
								};

								_modelWrapper.toString = function () {
									return _model.toString();
								};

								return _modelWrapper;
							})(function (modelName) {
								return model.model(modelName);
							})
						},
						modelName: {

							/**
       Frized api mongoose
       */

							get: function () {
								return model.name;
							}
						},
						currentModel: {
							get: function () {
								return model;
							}
						}
					});

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
		}
	});

	return Document;
})(EventEmitter);

module.exports = Document;