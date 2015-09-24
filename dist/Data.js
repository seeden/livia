'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

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
    key: 'toJSON',
    value: function toJSON() {
      var _this2 = this;

      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var json = {};

      Object.keys(this._data).forEach(function (propName) {
        var prop = _this2._data[propName];

        if (prop.isRecordID && options.recordID) {
          var _value = prop.toJSON(options);
          if (typeof _value === 'undefined') {
            return;
          }

          if (typeof options.recordID === 'string') {
            propName = options.recordID;
          }

          json[propName] = _value;
          return;
        }

        if (prop instanceof _typesVirtual2['default'] && !options.virtuals) {
          return;
        }

        if (prop.isMetadata && !options.metadata) {
          return;
        }

        if (options.modified && !prop.isModified() && !prop.isMetadata) {
          return;
        }

        if (typeof options.exclude === 'function' && options.exclude(prop.name, prop.options)) {
          return;
        }

        var value = prop.toJSON(options);
        if (typeof value === 'undefined') {
          return;
        }

        // MONGOOSE: empty object is undefined for parent
        if (_lodash2['default'].isPlainObject(value) && !Object.keys(value).length) {
          return;
        }

        json[propName] = value;
      });

      return json;
    }
  }, {
    key: 'toObject',
    value: function toObject() {
      var _this3 = this;

      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var json = {};

      Object.keys(this._data).forEach(function (propName) {
        var prop = _this3._data[propName];

        if (prop instanceof _typesVirtual2['default'] && !options.virtuals) {
          return;
        }

        if (prop.isMetadata && !options.metadata) {
          return;
        }

        if (options.modified && !prop.isModified() && !prop.isMetadata) {
          return;
        }

        var value = prop.toObject(options);
        if (typeof value === 'undefined') {
          return;
        }

        // MONGOOSE: empty object is undefined for parent
        if (_lodash2['default'].isPlainObject(value) && !Object.keys(value).length) {
          return;
        }

        json[propName] = value;
      });

      return json;
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