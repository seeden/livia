"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var SchemaBase = _interopRequire(require("./schemabase"));

var Kareem = _interopRequire(require("kareem"));

var _ = _interopRequire(require("lodash"));

var VirtualType = _interopRequire(require("../types/virtual"));

var Data = _interopRequire(require("../data"));

var convertType = _interopRequire(require("../types/convert"));

var MixedType = _interopRequire(require("../types/mixed"));

var IndexType = _interopRequire(require("../constants/indextype"));

var debug = _interopRequire(require("debug"));

var log = debug("orientose:schema");

var Schema = (function (_SchemaBase) {
	function Schema(props, options) {
		_classCallCheck(this, Schema);

		_get(Object.getPrototypeOf(Schema.prototype), "constructor", this).call(this, options);

		this.methods = {};
		this.statics = {};

		this._paths = {};
		this._indexes = {};
		this._virtuals = {};
		this._hooks = new Kareem();

		this._dataClass = null;

		this.add(props);
	}

	_inherits(Schema, _SchemaBase);

	_createClass(Schema, {
		extendClassName: {
			get: function () {
				return this._options.extend;
			}
		},
		hooks: {
			get: function () {
				return this._hooks;
			}
		},
		DataClass: {
			get: function () {
				if (!this._dataClass) {
					this._dataClass = Data.createClass(this);
				}
				return this._dataClass;
			}
		},
		add: {
			value: function add(props) {
				var _this = this;

				props = props || {};

				if (!_.isObject(props)) {
					throw new Error("Props is not an object");
				}

				Object.keys(props).forEach(function (propName) {
					return _this.setPath(propName, props[propName]);
				});
				return this;
			}
		},
		getSubdocumentSchemaConstructor: {
			value: function getSubdocumentSchemaConstructor() {
				return Schema;
			}
		},
		_indexName: {
			value: function _indexName(properties) {
				var props = Object.keys(properties).map(function (prop) {
					return prop.replace(".", "-");
				});

				return props.join("_");
			}
		},
		index: {
			value: function index(properties, options) {
				options = options || {};

				if (typeof properties === "string") {
					properties = _defineProperty({}, properties, 1);
				}

				var name = options.name || this._indexName(properties);
				var type = options.type || IndexType.NOTUNIQUE;
				if (options.unique) {
					type = IndexType.UNIQUE;
				} else if (options.text) {
					type = IndexType.FULLTEXT;
				}

				if (this._indexes[name]) {
					throw new Error("Index with name ${name} is already defined.");
				}

				//fix 2dsphere index from mongoose
				if (type.toUpperCase() === "2DSPHERE") {
					type = "SPATIAL ENGINE LUCENE";

					var keys = Object.keys(properties);
					if (keys.length !== 1) {
						throw new Error("We can not fix index on multiple properties");
					}

					properties = _defineProperty({}, keys[0] + ".coordinates", 1);
				}

				this._indexes[name] = {
					properties: properties,
					type: type,
					nullValuesIgnored: !options.sparse,
					options: options
				};

				return this;
			}
		},
		hasIndex: {
			value: function hasIndex(name) {
				return !!this._indexes[name];
			}
		},
		getIndex: {
			value: function getIndex(name) {
				return this._indexes[name];
			}
		},
		indexNames: {
			get: function () {
				return Object.keys(this._indexes);
			}
		},
		get: {
			value: function get(key) {
				return this.options[key];
			}
		},
		set: {
			value: function set(key, value) {
				this.options[key] = value;
				return this;
			}
		},
		getSchemaType: {
			value: function getSchemaType(path) {
				var prop = this.getPath(path);
				return prop ? prop.schemaType : void 0;
			}
		},
		getPath: {
			value: function getPath(path, stopOnArray) {
				var pos = path.indexOf(".");
				if (pos === -1) {
					return this._props[path];
				}

				var subPath = path.substr(pos + 1);
				var propName = path.substr(0, pos);

				var prop = this._props[propName];
				if (!prop) {
					return prop;
				}

				if (prop.type instanceof Schema) {
					return prop.type.getPath(subPath);
				}

				if (!stopOnArray && prop.item && prop.item.type instanceof Schema) {
					return prop.item.type.getPath(subPath);
				}
			}
		},
		setPath: {
			value: function setPath(path, options) {
				// ignore {_id: false}
				if (options === false) {
					return this;
				}

				options = options || {};

				var pos = path.indexOf(".");
				if (pos === -1) {
					try {
						var normalizedOptions = this.normalizeOptions(options, path);
					} catch (e) {
						log("Problem with path: " + path);
						throw e;
					}

					if (!normalizedOptions) {
						return this;
					}

					this._props[path] = normalizedOptions;

					if (!options.index) {
						return this;
					}

					this.index(_defineProperty({}, path, path), {
						name: options.indexName,
						unique: options.unique,
						sparse: options.sparse,
						type: options.indexType
					});

					return this;
				}

				var subPath = path.substr(pos + 1);
				var propName = path.substr(0, pos);

				var prop = this._props[propName];
				if (prop && prop.type instanceof Schema) {
					prop.type.setPath(subPath, options);
				}

				return this;
			}
		},
		has: {
			value: function has(property) {
				return !!this._props[property];
			}
		},
		propertyNames: {
			value: function propertyNames() {
				return Object.keys(this._props);
			}
		},
		method: {
			value: function method(name, fn) {
				if (_.isObject(name)) {
					for (var index in name) {
						this.methods[index] = name[index];
					}
					return;
				}

				this.methods[name] = fn;
				return this;
			}
		},
		"static": {
			value: function _static(name, fn) {
				if (_.isObject(name)) {
					for (var index in name) {
						this.statics[index] = name[index];
					}
					return;
				}

				this.statics[name] = fn;
				return this;
			}
		},
		virtual: {
			value: (function (_virtual) {
				var _virtualWrapper = function virtual(_x, _x2) {
					return _virtual.apply(this, arguments);
				};

				_virtualWrapper.toString = function () {
					return _virtual.toString();
				};

				return _virtualWrapper;
			})(function (path, options) {
				options = options || {};

				var schema = this;
				var pos = path.indexOf(".");
				if (pos !== -1) {
					var subPaths = path.split(".");
					var path = subPaths.pop();

					var prop = this.getPath(subPaths.join("."));
					if (!prop) {
						throw new Error("Field does not exists " + subPaths.join("."));
					}

					var type = prop.item ? prop.item.type : prop.type;

					if (!type || !(type instanceof Schema)) {
						throw new Error("Field does not exists " + subPaths.join("."));
					}

					return type.virtual(path, options);
				}

				if (this._virtuals[path]) {
					return this._virtuals[path].getset;
				}

				var virtual = this._virtuals[path] = {
					schemaType: VirtualType,
					options: options,
					getset: {
						get: function get(fn) {
							options.get = fn;
							return this;
						},
						set: function set(fn) {
							options.set = fn;
							return this;
						}
					}
				};

				return virtual.getset;
			})
		},
		alias: {
			value: function alias(to, from) {
				this.virtual(from).get(function () {
					return this[to];
				}).set(function (value) {
					this[to] = value;
				});

				return this;
			}
		},
		pre: {
			value: function pre(name, async, fn) {
				this._hooks.pre(name, async, fn);
				return this;
			}
		},
		post: {
			value: function post(name, async, fn) {
				this._hooks.post(name, async, fn);
				return this;
			}
		},
		plugin: {
			value: function plugin(pluginFn, options) {
				options = options || {};

				pluginFn(this, options);
				return this;
			}
		},
		path: {
			value: (function (_path) {
				var _pathWrapper = function path(_x3, _x4) {
					return _path.apply(this, arguments);
				};

				_pathWrapper.toString = function () {
					return _path.toString();
				};

				return _pathWrapper;
			})(function (path) {
				for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
					args[_key - 1] = arguments[_key];
				}

				if (args.length === 0) {
					var prop = this.getPath(path, true);
					if (!prop) {
						return prop;
					}

					return Schema.toMongoose(prop, path);
				}

				this.setPath(path, args[0]);
				return this;
			})
		},
		traverse: {
			value: function traverse(fn, traverseChildren, parentPath) {
				var props = this._props;
				var virtuals = this._virtuals;

				Object.keys(props).forEach(function (name) {
					var prop = props[name];
					var path = parentPath ? parentPath + "." + name : name;

					var canTraverseChildren = fn(name, prop, path, false);
					if (canTraverseChildren === false || !traverseChildren) {
						return;
					}

					if (prop.type instanceof Schema) {
						prop.type.traverse(fn, traverseChildren, path);
					}

					if (prop.item && prop.item.type instanceof Schema) {
						prop.item.type.traverse(fn, traverseChildren, path);
					}
				});

				//traverse virtual poroperties
				Object.keys(virtuals).forEach(function (name) {
					var prop = virtuals[name];
					var path = parentPath ? parentPath + "." + name : name;

					fn(name, prop, path, true);
				});

				return this;
			}
		},
		eachPath: {
			value: function eachPath(fn) {
				this.traverse(function (name, prop, path, isVirtual) {
					if (isVirtual) {
						return false;
					}

					var config = Schema.toMongoose(prop, path);
					if (!config) {
						return;
					}

					fn(path, config);

					if (prop.item) {
						return false;
					}
				}, true);
			}
		},
		normalizeOptions: {
			value: function normalizeOptions(options, path) {
				if (!options) {
					return null;
				}

				//convert basic types
				var basicTypes = [String, Number, Boolean, Date];
				if (basicTypes.indexOf(options) !== -1) {
					options = {
						type: options
					};
				}

				//if it is one of our types
				if (_.isFunction(options)) {
					options = {
						type: options
					};
				}

				//1. convert objects
				if (_.isPlainObject(options) && (!options.type || options.type.type)) {
					options = {
						type: options
					};
				}

				//2. prepare array
				if (_.isArray(options)) {
					options = {
						type: options
					};
				}

				var type = options instanceof Schema ? options : options.type;

				var SubSchema = this.getSubdocumentSchemaConstructor();

				//create schema from plain object
				if (_.isPlainObject(type)) {
					type = Object.keys(type).length ? new SubSchema(type) : MixedType;
				}

				var normalised = {
					schema: this,
					type: type,
					schemaType: convertType(type, Schema),
					options: options
				};

				if (_.isArray(type)) {
					var itemOptions = type.length ? type[0] : { type: MixedType };
					normalised.item = this.normalizeOptions(itemOptions);
				}

				return normalised;
			}
		}
	}, {
		toMongoose: {
			value: function toMongoose(prop, path) {
				var options = prop.options || {};

				if (prop.type instanceof Schema) {
					return;
				}

				var config = {
					path: path,
					instance: prop.schemaType.toString(),
					setters: [],
					getters: [],
					options: options,
					defaultValue: options["default"]
				};

				if (prop.item) {
					if (prop.item.type instanceof Schema) {
						config.schema = prop.item.type;
					}
				}

				return config;
			}
		}
	});

	return Schema;
})(SchemaBase);

module.exports = Schema;