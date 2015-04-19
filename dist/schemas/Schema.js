'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: key == null || typeof Symbol == 'undefined' || key.constructor !== Symbol, configurable: true, writable: true }); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _Kareem = require('kareem');

var _Kareem2 = _interopRequireWildcard(_Kareem);

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var _debug = require('debug');

var _debug2 = _interopRequireWildcard(_debug);

var _SchemaBase2 = require('./SchemaBase');

var _SchemaBase3 = _interopRequireWildcard(_SchemaBase2);

var _VirtualType = require('../types/Virtual');

var _VirtualType2 = _interopRequireWildcard(_VirtualType);

var _Data = require('../Data');

var _Data2 = _interopRequireWildcard(_Data);

var _MixedType = require('../types/Mixed');

var _MixedType2 = _interopRequireWildcard(_MixedType);

var _IndexType = require('../constants/IndexType');

var _IndexType2 = _interopRequireWildcard(_IndexType);

var _extend = require('node.extend');

var _extend2 = _interopRequireWildcard(_extend);

var log = _debug2['default']('orientose:schema');

var Schema = (function (_SchemaBase) {
	function Schema(props, options) {
		_classCallCheck(this, Schema);

		_get(Object.getPrototypeOf(Schema.prototype), 'constructor', this).call(this, options);

		this.methods = {};
		this.statics = {};

		this._paths = {};
		this._indexes = {};
		this._virtuals = {};
		this._hooks = new _Kareem2['default']();

		this._dataClass = null;

		this.add(props);
	}

	_inherits(Schema, _SchemaBase);

	_createClass(Schema, [{
		key: 'extendClassName',
		get: function () {
			return this._options.extend;
		}
	}, {
		key: 'hooks',
		get: function () {
			return this._hooks;
		}
	}, {
		key: 'DataClass',
		get: function () {
			if (!this._dataClass) {
				this._dataClass = _Data2['default'].createClass(this);
			}
			return this._dataClass;
		}
	}, {
		key: 'add',
		value: function add(props) {
			var _this = this;

			props = props || {};

			if (!_import2['default'].isObject(props)) {
				throw new Error('Props is not an object');
			}

			Object.keys(props).forEach(function (propName) {
				return _this.setPath(propName, props[propName]);
			});
			return this;
		}
	}, {
		key: 'getSubdocumentSchemaConstructor',
		value: function getSubdocumentSchemaConstructor() {
			return Schema;
		}
	}, {
		key: '_indexName',
		value: function _indexName(properties) {
			var props = Object.keys(properties).map(function (prop) {
				return prop.replace('.', '-');
			});

			return props.join('_');
		}
	}, {
		key: 'index',
		value: function index(properties, options) {
			options = options || {};

			if (typeof properties === 'string') {
				properties = _defineProperty({}, properties, 1);
			}

			var name = options.name || this._indexName(properties);
			var type = options.type || _IndexType2['default'].BASIC;

			if (type === true) {
				type = _IndexType2['default'].BASIC;
			} else if (type === 'text' || type === 'fulltext' || options.text) {
				type = _IndexType2['default'].FULLTEXT;
			} else if (type === '2dsphere') {
				type = _IndexType2['default'].SPATIAL;
			}

			if (this._indexes[name]) {
				throw new Error('Index with name ${name} is already defined.');
			}

			this._indexes[name] = _extend2['default']({}, options, {
				properties: properties,
				type: type,
				nullValuesIgnored: !options.sparse
			});

			return this;
		}
	}, {
		key: 'hasIndex',
		value: function hasIndex(name) {
			return !!this._indexes[name];
		}
	}, {
		key: 'getIndex',
		value: function getIndex(name) {
			return this._indexes[name];
		}
	}, {
		key: 'indexNames',
		get: function () {
			return Object.keys(this._indexes);
		}
	}, {
		key: 'get',
		value: function get(key) {
			return this.options[key];
		}
	}, {
		key: 'set',
		value: function set(key, value) {
			this.options[key] = value;
			return this;
		}
	}, {
		key: 'getSchemaType',
		value: function getSchemaType(path) {
			var prop = this.getPath(path);
			return prop ? prop.schemaType : void 0;
		}
	}, {
		key: 'getPath',
		value: function getPath(path, stopOnArray) {
			var pos = path.indexOf('.');
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
	}, {
		key: 'setPath',
		value: function setPath(path, options) {
			// ignore {_id: false}
			if (options === false) {
				return this;
			}

			options = options || {};

			var pos = path.indexOf('.');
			if (pos === -1) {
				try {
					var normalizedOptions = this.normalizeOptions(options, path);
				} catch (e) {
					log('Problem with path: ' + path);
					throw e;
				}

				if (!normalizedOptions) {
					return this;
				}

				this._props[path] = normalizedOptions;

				if (!options.index && !options.unique && !options.sparse) {
					return this;
				}

				var index = options.index || {};

				this.index(_defineProperty({}, path, path), {
					unique: options.unique || index.unique,
					sparse: options.sparse || index.sparse,
					hash: options.hash || index.hash,
					name: options.indexName || index.name,
					engine: options.engine || index.engine,
					type: options.indexType || index.type || index,
					metadata: options.indexMetadata || index.metadata
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
	}, {
		key: 'has',
		value: function has(property) {
			return !!this._props[property];
		}
	}, {
		key: 'propertyNames',
		value: function propertyNames() {
			return Object.keys(this._props);
		}
	}, {
		key: 'method',
		value: function method(name, fn) {
			if (_import2['default'].isObject(name)) {
				for (var index in name) {
					this.methods[index] = name[index];
				}
				return;
			}

			this.methods[name] = fn;
			return this;
		}
	}, {
		key: 'static',
		value: function _static(name, fn) {
			if (_import2['default'].isObject(name)) {
				for (var index in name) {
					this.statics[index] = name[index];
				}
				return;
			}

			this.statics[name] = fn;
			return this;
		}
	}, {
		key: 'virtual',
		value: (function (_virtual) {
			function virtual(_x, _x2) {
				return _virtual.apply(this, arguments);
			}

			virtual.toString = function () {
				return _virtual.toString();
			};

			return virtual;
		})(function (path, options) {
			options = options || {};

			var schema = this;
			var pos = path.indexOf('.');
			if (pos !== -1) {
				var subPaths = path.split('.');
				var path = subPaths.pop();

				var prop = this.getPath(subPaths.join('.'));
				if (!prop) {
					throw new Error('Field does not exists ' + subPaths.join('.'));
				}

				var type = prop.item ? prop.item.type : prop.type;

				if (!type || !(type instanceof Schema)) {
					throw new Error('Field does not exists ' + subPaths.join('.'));
				}

				return type.virtual(path, options);
			}

			if (this._virtuals[path]) {
				return this._virtuals[path].getset;
			}

			var virtual = this._virtuals[path] = {
				schemaType: _VirtualType2['default'],
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
	}, {
		key: 'alias',
		value: function alias(to, from) {
			this.virtual(from).get(function () {
				return this[to];
			}).set(function (value) {
				this[to] = value;
			});

			return this;
		}
	}, {
		key: 'pre',
		value: function pre(name, async, fn) {
			this._hooks.pre(name, async, fn);
			return this;
		}
	}, {
		key: 'post',
		value: function post(name, async, fn) {
			this._hooks.post(name, async, fn);
			return this;
		}
	}, {
		key: 'plugin',
		value: function plugin(pluginFn, options) {
			options = options || {};

			pluginFn(this, options);
			return this;
		}
	}, {
		key: 'path',
		value: (function (_path) {
			function path(_x3, _x4) {
				return _path.apply(this, arguments);
			}

			path.toString = function () {
				return _path.toString();
			};

			return path;
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
	}, {
		key: 'traverse',
		value: function traverse(fn, traverseChildren, parentPath) {
			var props = this._props;
			var virtuals = this._virtuals;

			Object.keys(props).forEach(function (name) {
				var prop = props[name];
				var path = parentPath ? parentPath + '.' + name : name;

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
				var path = parentPath ? parentPath + '.' + name : name;

				fn(name, prop, path, true);
			});

			return this;
		}
	}, {
		key: 'eachPath',
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
	}, {
		key: 'normalizeOptions',
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
			if (_import2['default'].isFunction(options)) {
				options = {
					type: options
				};
			}

			//1. convert objects
			if (_import2['default'].isPlainObject(options) && (!options.type || options.type.type)) {
				options = {
					type: options
				};
			}

			//2. prepare array
			if (_import2['default'].isArray(options)) {
				options = {
					type: options
				};
			}

			var type = options instanceof Schema ? options : options.type;

			var SubSchema = this.getSubdocumentSchemaConstructor();

			//create schema from plain object
			if (_import2['default'].isPlainObject(type)) {
				type = Object.keys(type).length ? new SubSchema(type) : _MixedType2['default'];
			}

			var normalised = {
				schema: this,
				type: type,
				schemaType: this.convertType(type),
				options: options
			};

			if (_import2['default'].isArray(type)) {
				var itemOptions = type.length ? type[0] : { type: _MixedType2['default'] };
				normalised.item = this.normalizeOptions(itemOptions);
			}

			return normalised;
		}
	}], [{
		key: 'toMongoose',
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
				defaultValue: options['default']
			};

			if (prop.item) {
				if (prop.item.type instanceof Schema) {
					config.schema = prop.item.type;
				}
			}

			return config;
		}
	}]);

	return Schema;
})(_SchemaBase3['default']);

exports['default'] = Schema;
module.exports = exports['default'];