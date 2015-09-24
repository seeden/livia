'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x5, _x6, _x7) { var _again = true; _function: while (_again) { var object = _x5, property = _x6, receiver = _x7; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x5 = parent; _x6 = property; _x7 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _typesVirtual = require('./types/Virtual');

var _typesVirtual2 = _interopRequireDefault(_typesVirtual);

var _typesMixed = require('./types/Mixed');

var _typesMixed2 = _interopRequireDefault(_typesMixed);

var _utilsProps = require('./utils/props');

var log = (0, _debug2['default'])('orientose:data');

var Data = (function () {
  function Data(holder, schema, properties, className, mainData) {
    if (properties === undefined) properties = {};

    var _this = this;

    _classCallCheck(this, Data);

    mainData = mainData || this;

    this._holder = holder;
    this._schema = schema;
    this._data = {};
    this._className = className;
    this._mainData = mainData;

    schema.traverse(function (propName, prop) {
      _this._data[propName] = new prop.SchemaType(_this, prop, propName, mainData);
    });

    this.set(properties);
  }

  _createClass(Data, [{
    key: 'toString',
    value: function toString() {
      return this.toJSON();
    }
  }, {
    key: 'canSkipProp',
    value: function canSkipProp(prop) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var excludeAvailable = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

      // virtual can be skiped always
      if (prop instanceof _typesVirtual2['default'] && !options.virtuals) {
        return true;
      }

      // metadata can be skiped except explicit
      if (prop.isMetadata && !options.metadata) {
        if (!options.sub && (options.create && prop.create) || options.update && prop.update) {
          return false;
        } else if (option.sub && (options.create && prop.subCreate) || options.update && prop.subUpdate) {
          return false;
        }

        return true;
      }

      // child is always required (Object, Array)
      if (options.sub) {
        return false;
      }

      // modified can be skiped explicitli
      if (options.modified && !prop.isModified()) {
        return true;
      }

      if (excludeAvailable && typeof options.exclude === 'function' && options.exclude(prop.name, prop.options)) {
        return true;
      }

      return false;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      var _this2 = this;

      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var obj = {};

      var opt = _extends({}, options, {
        sub: true
      });

      Object.keys(this._data).forEach(function (propName) {
        var prop = _this2._data[propName];

        // move record id to different variable
        if (prop.isRecordID && options.recordID) {
          var _value = prop.toJSON(opt);
          if (typeof _value === 'undefined') {
            return;
          }

          if (typeof options.recordID === 'string') {
            propName = options.recordID;
          }

          obj[propName] = _value;
          return;
        }

        if (_this2.canSkipProp(prop, options, true)) {
          return;
        }

        var value = prop.toJSON(opt);
        if (typeof value === 'undefined') {
          return;
        }

        // MONGOOSE: empty object is undefined for parent
        if (_lodash2['default'].isPlainObject(value) && !Object.keys(value).length) {
          return;
        }

        obj[propName] = value;
      });

      return obj;
    }
  }, {
    key: 'toObject',
    value: function toObject() {
      var _this3 = this;

      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var obj = {};

      var opt = _extends({}, options, {
        sub: true
      });

      Object.keys(this._data).forEach(function (propName) {
        var prop = _this3._data[propName];

        if (_this3.canSkipProp(prop, options)) {
          return;
        }

        var value = prop.toObject(opt);
        if (typeof value === 'undefined') {
          return;
        }

        // MONGOOSE: empty object is undefined for parent
        if (_lodash2['default'].isPlainObject(value) && !Object.keys(value).length) {
          return;
        }

        obj[propName] = value;
      });

      return obj;
    }
  }, {
    key: 'isModified',
    value: function isModified(path) {
      return (0, _utilsProps.process)(this._data, path, 'isModified', false, function (data) {
        var isModified = false;

        Object.keys(data).forEach(function (propName) {
          var prop = data[propName];
          isModified = prop.isModified() || isModified;
        });

        return isModified;
      });
    }
  }, {
    key: 'get',
    value: function get(path) {
      return (0, _utilsProps.process)(this._data, path, 'get', void 0, function (data) {
        return data;
      });
    }
  }, {
    key: 'set',
    value: function set(path, value, setAsOriginal) {
      var _this4 = this;

      if (_lodash2['default'].isPlainObject(path)) {
        Object.keys(path).forEach(function (key) {
          _this4.set(key, path[key], setAsOriginal);
        });

        return this;
      }

      // TODO replace with props.process
      var pos = path.indexOf('.');
      if (pos === -1) {
        var property = this._data[path];
        if (!property) {
          var schema = this._schema;
          if (schema.isStrict) {
            log('set Path not exists:' + path);
            return this;
          }

          property = this.defineMixedProperty(path);
        }

        property.value = value;

        if (setAsOriginal) {
          property.setAsOriginal();
        }

        return this;
      }

      var currentKey = path.substr(0, pos);
      var newPath = path.substr(pos + 1);

      if (!this._data[currentKey]) {
        log('set deep Path not exists:' + currentKey);
        return this;
      }

      var data = this._data[currentKey];
      if (!data || !data.set) {
        return this;
      }

      data.set(newPath, value, setAsOriginal);
      return this;
    }
  }, {
    key: 'setupData',
    value: function setupData(properties) {
      this.set(properties, null, true);
    }
  }, {
    key: 'setAsOriginal',
    value: function setAsOriginal() {
      var _this5 = this;

      Object.keys(this._data).forEach(function (propName) {
        return _this5._data[propName].setAsOriginal();
      });
    }
  }, {
    key: 'defineMixedProperty',
    value: function defineMixedProperty(fieldName) {
      var _this6 = this;

      var schema = this._schema;

      var prop = {
        schema: schema,
        type: _typesMixed2['default'],
        SchemaType: schema.convertType(_typesMixed2['default']),
        options: {}
      };

      var property = this._data[fieldName] = new prop.SchemaType(this, prop, fieldName, this._mainData);

      // define getter and setter for holder
      Object.defineProperty(this._holder, fieldName, {
        enumerable: true,
        configurable: true,
        get: function get() {
          return _this6.get(fieldName);
        },
        set: function set(value) {
          return _this6.set(fieldName, value);
        }
      });

      return property;
    }
  }], [{
    key: 'createClass',
    value: function createClass(schema) {
      var DataClass = (function (_Data) {
        _inherits(DataClass, _Data);

        function DataClass(holder, properties, className, mainData) {
          _classCallCheck(this, DataClass);

          _get(Object.getPrototypeOf(DataClass.prototype), 'constructor', this).call(this, holder, schema, properties, className, mainData);
        }

        // define properties
        return DataClass;
      })(Data);

      schema.traverse(function (fieldName) {
        Object.defineProperty(DataClass.prototype, fieldName, {
          enumerable: true,
          configurable: true,
          get: function get() {
            return this.get(fieldName);
          },
          set: function set(value) {
            return this.set(fieldName, value);
          }
        });
      });

      return DataClass;
    }
  }]);

  return Data;
})();

exports['default'] = Data;
module.exports = exports['default'];