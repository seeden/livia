'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x6, _x7, _x8) { var _again = true; _function: while (_again) { var object = _x6, property = _x7, receiver = _x8; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x6 = parent; _x7 = property; _x8 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _kareem = require('kareem');

var _kareem2 = _interopRequireDefault(_kareem);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _SchemaBase2 = require('./SchemaBase');

var _SchemaBase3 = _interopRequireDefault(_SchemaBase2);

var _typesVirtual = require('../types/Virtual');

var _typesVirtual2 = _interopRequireDefault(_typesVirtual);

var _Data = require('../Data');

var _Data2 = _interopRequireDefault(_Data);

var _typesMixed = require('../types/Mixed');

var _typesMixed2 = _interopRequireDefault(_typesMixed);

var _constantsIndexType = require('../constants/IndexType');

var _constantsIndexType2 = _interopRequireDefault(_constantsIndexType);

var _nodeExtend = require('node.extend');

var _nodeExtend2 = _interopRequireDefault(_nodeExtend);

var log = (0, _debug2['default'])('orientose:schema');

var RESERVED_FIELDS = ['model', 'isNew', 'isModified', 'get', 'set'];

var Schema = (function (_SchemaBase) {
  _inherits(Schema, _SchemaBase);

  function Schema(props, options) {
    _classCallCheck(this, Schema);

    _get(Object.getPrototypeOf(Schema.prototype), 'constructor', this).call(this, options);

    this.methods = {};
    this.statics = {};

    this._paths = {};
    this._indexes = {};
    this._virtuals = {};
    this._hooks = new _kareem2['default']();

    this._dataClass = null;

    this.add(props);
  }

  _createClass(Schema, [{
    key: 'add',
    value: function add() {
      var _this = this;

      var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if (!_lodash2['default'].isObject(props)) {
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
    value: function index(properties) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      if (typeof properties === 'string') {
        properties = _defineProperty({}, properties, 1);
      }

      var propNames = Object.keys(properties);
      if (!propNames.length) {
        throw new Error('You need to select a properties');
      }

      var firstProp = properties[propNames[0]];
      var name = options.name || this._indexName(properties);
      var type = options.type || _constantsIndexType2['default'].BASIC;

      if (type === true) {
        type = _constantsIndexType2['default'].BASIC;
      } else if (type === 'text' || type === 'fulltext' || options.text || firstProp === 'text') {
        type = _constantsIndexType2['default'].FULLTEXT;
      } else if (type === '2dsphere') {
        type = _constantsIndexType2['default'].SPATIAL;
      }

      if (this._indexes[name]) {
        throw new Error('Index with name ${name} is already defined.');
      }

      this._indexes[name] = (0, _nodeExtend2['default'])({}, options, {
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
      return prop ? prop.SchemaType : void 0;
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
    value: function setPath(path) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      // ignore {_id: false}
      if (options === false) {
        return this;
      }

      var pos = path.indexOf('.');
      if (pos === -1) {
        if (RESERVED_FIELDS.indexOf(path) !== -1) {
          throw new Error('This field name ' + path + ' is reserved');
        }

        var normalizedOptions = null;

        try {
          normalizedOptions = this.normalizeOptions(options, path);
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
      var _this2 = this;

      if (_lodash2['default'].isObject(name)) {
        Object.keys(name).forEach(function (index) {
          return _this2.methods[index] = name[index];
        });
        return this;
      }

      this.methods[name] = fn;
      return this;
    }
  }, {
    key: 'static',
    value: function _static(name, fn) {
      var _this3 = this;

      if (_lodash2['default'].isObject(name)) {
        Object.keys(name).forEach(function (index) {
          return _this3.statics[index] = name[index];
        });
        return this;
      }

      this.statics[name] = fn;
      return this;
    }
  }, {
    key: 'virtual',
    value: function virtual(path) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var pos = path.indexOf('.');
      if (pos !== -1) {
        var subPaths = path.split('.');
        var field = subPaths.pop();

        var prop = this.getPath(subPaths.join('.'));
        if (!prop) {
          throw new Error('Field does not exists ' + subPaths.join('.'));
        }

        var type = prop.item ? prop.item.type : prop.type;

        if (!type || !(type instanceof Schema)) {
          throw new Error('Field does not exists ' + subPaths.join('.'));
        }

        return type.virtual(field, options);
      }

      if (this._virtuals[path]) {
        return this._virtuals[path].getset;
      }

      var virtual = this._virtuals[path] = {
        SchemaType: _typesVirtual2['default'],
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
    }
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
    value: function plugin(pluginFn) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      pluginFn(this, options);
      return this;
    }
  }, {
    key: 'path',
    value: function path(_path) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (args.length === 0) {
        var prop = this.getPath(_path, true);
        if (!prop) {
          return prop;
        }

        return Schema.toMongoose(prop, _path);
      }

      this.setPath(_path, args[0]);
      return this;
    }
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

      // traverse virtual poroperties
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
          return void 0;
        }

        fn(path, config);

        if (prop.item) {
          return false;
        }
      }, true);
    }
  }, {
    key: 'normalizeOptions',
    value: function normalizeOptions(options) {
      if (!options) {
        return null;
      }

      // convert basic types
      var basicTypes = [String, Number, Boolean, Date];
      if (basicTypes.indexOf(options) !== -1) {
        options = {
          type: options
        };
      }

      // if it is one of our types
      if (_lodash2['default'].isFunction(options)) {
        options = {
          type: options
        };
      }

      // 1. convert objects
      if (_lodash2['default'].isPlainObject(options) && (!options.type || options.type.type)) {
        options = {
          type: options
        };
      }

      // 2. prepare array
      if (_lodash2['default'].isArray(options)) {
        options = {
          type: options
        };
      }

      var type = options instanceof Schema ? options : options.type;

      var SubSchema = this.getSubdocumentSchemaConstructor();

      // create schema from plain object
      if (_lodash2['default'].isPlainObject(type)) {
        type = Object.keys(type).length ? new SubSchema(type) : _typesMixed2['default'];
      }

      var normalised = {
        schema: this,
        type: type,
        SchemaType: this.convertType(type),
        options: options
      };

      if (_lodash2['default'].isArray(type)) {
        var itemOptions = type.length ? type[0] : { type: _typesMixed2['default'] };
        normalised.item = this.normalizeOptions(itemOptions);
      }

      return normalised;
    }
  }, {
    key: 'extendClassName',
    get: function get() {
      return this._options.extend;
    }
  }, {
    key: 'hooks',
    get: function get() {
      return this._hooks;
    }
  }, {
    key: 'DataClass',
    get: function get() {
      if (!this._dataClass) {
        this._dataClass = _Data2['default'].createClass(this);
      }
      return this._dataClass;
    }
  }, {
    key: 'indexNames',
    get: function get() {
      return Object.keys(this._indexes);
    }
  }], [{
    key: 'toMongoose',
    value: function toMongoose(prop, path) {
      var options = prop.options || {};

      if (prop.type instanceof Schema) {
        return void 0;
      }

      var config = {
        path: path,
        instance: prop.SchemaType.toString(),
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