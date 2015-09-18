'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _SubType2 = require('./SubType');

var _SubType3 = _interopRequireDefault(_SubType2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var ObjectType = (function (_SubType) {
  _inherits(ObjectType, _SubType);

  function ObjectType(data, prop, name, mainData) {
    _classCallCheck(this, ObjectType);

    _get(Object.getPrototypeOf(ObjectType.prototype), 'constructor', this).call(this, data, prop, name, mainData);

    if (typeof this._default === 'undefined') {
      this._default = {}; // MONGOOSE: default value
    }
  }

  _createClass(ObjectType, [{
    key: '_createData',
    value: function _createData() {
      var className = this.data._className;
      var abstractClassName = _SubType3['default'].computeAbstractClassName(className, this.name);

      return new this.schema.DataClass(this, {}, abstractClassName, this.mainData);
    }
  }, {
    key: '_serialize',
    value: function _serialize(props) {
      if (!_lodash2['default'].isObject(props)) {
        throw new Error('Property ' + this.name + ' value must be an object you gave: ' + props);
      }

      var keys = Object.keys(props);
      var value = this._createData();

      keys.forEach(function (propName) {
        value.set(propName, props[propName]);
      });

      return value;
    }
  }, {
    key: '_deserialize',
    value: function _deserialize(value) {
      return value;
    }
  }, {
    key: 'set',
    value: function set(key, value, setAsOriginal) {
      var before = this._value;
      if (!this._value) {
        this._value = this._createData();
      }

      try {
        this._value.set(key, value, setAsOriginal);
      } catch (e) {
        this._value = before;
        throw e;
      }
    }
  }, {
    key: 'get',
    value: function get(path) {
      var value = this.serializedValue;
      if (!value) {
        return void 0;
      }

      return value.get(path);
    }
  }, {
    key: 'schema',
    get: function get() {
      return this.prop.type;
    }
  }, {
    key: 'deserializedValue',
    get: function get() {
      if (!this._value) {
        this._value = this._preDeserialize();
      }

      return this._value;
    }
  }, {
    key: 'isModified',
    get: function get() {
      return true;
      if (!this._value) {
        return this.original !== this.value;
      }

      var isModified = false;
      this._value.forEach(true, function (prop) {
        isModified = prop.isModified || isModified;
      });

      return isModified;
    }
  }], [{
    key: 'getDbType',
    value: function getDbType() {
      return 'EMBEDDED';
    }
  }, {
    key: 'toString',
    value: function toString() {
      return 'Object';
    }
  }, {
    key: 'isEmbedded',
    value: function isEmbedded() {
      return true;
    }
  }, {
    key: 'isAbstract',
    value: function isAbstract() {
      return true;
    }
  }, {
    key: 'getEmbeddedSchema',
    value: function getEmbeddedSchema(prop) {
      return prop.type;
    }
  }, {
    key: 'isObject',
    get: function get() {
      return true;
    }
  }]);

  return ObjectType;
})(_SubType3['default']);

exports['default'] = ObjectType;
module.exports = exports['default'];