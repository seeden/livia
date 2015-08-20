'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Type2 = require('./Type');

var _Type3 = _interopRequireDefault(_Type2);

var ObjectType = (function (_Type) {
  _inherits(ObjectType, _Type);

  function ObjectType() {
    _classCallCheck(this, ObjectType);

    _get(Object.getPrototypeOf(ObjectType.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ObjectType, [{
    key: 'set',
    value: function set(key, value) {
      if (!this._value) {
        var className = this.data._className;
        var abstractClassName = _Type3['default'].computeAbstractClassName(className, this.name);

        this._value = new this.schema.DataClass(this, {}, abstractClassName, this.mainData);
      }

      this._value[key] = value;
    }
  }, {
    key: '_serialize',
    value: function _serialize(props) {
      var _this = this;

      Object.keys(props).forEach(function (propName) {
        return _this.set(propName, props[propName]);
      });
      return this._value;
    }
  }, {
    key: '_deserialize',
    value: function _deserialize() {
      return this._value;
    }
  }, {
    key: 'toJSON',
    value: function toJSON(options) {
      var value = this.value;
      return value ? value.toJSON(options) : value;
    }
  }, {
    key: 'toObject',
    value: function toObject(options) {
      var value = this.value;
      return value ? value.toObject(options) : value;
    }
  }, {
    key: 'schema',

    /*
    constructor(data, prop, name, mainData) {
      super(data, prop, name, mainData);
        //this._value = new this._schema.DataClass(this, {}, this._computeClassName(data, prop), mainData);
    }*/

    get: function get() {
      return this.prop.type;
    }
  }, {
    key: 'isModified',
    get: function get() {
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
})(_Type3['default']);

exports['default'] = ObjectType;
module.exports = exports['default'];