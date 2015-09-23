'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ('value' in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _SubType2 = require('./SubType');

var _SubType3 = _interopRequireDefault(_SubType2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utilsExtendedArray = require('../utils/ExtendedArray');

var _utilsExtendedArray2 = _interopRequireDefault(_utilsExtendedArray);

var ArrayType = (function (_SubType) {
  _inherits(ArrayType, _SubType);

  function ArrayType(data, prop, name, mainData) {
    _classCallCheck(this, ArrayType);

    if (!prop.item) {
      throw new Error('Type of the array item is not defined');
    }

    prop.options = prop.options || {};
    if (typeof prop.options['default'] === 'undefined') {
      prop.options['default'] = []; // mongoose default value
    }

    _get(Object.getPrototypeOf(ArrayType.prototype), 'constructor', this).call(this, data, prop, name, mainData);
  }

  _createClass(ArrayType, [{
    key: '_createItem',
    value: function _createItem(value) {
      var item = new this.prop.item.SchemaType(this.data, this.prop.item, this.name, this.mainData);
      item.value = value;

      return item;
    }
  }, {
    key: '_initArrayValue',
    value: function _initArrayValue() {
      if (this._value) {
        return;
      }

      // use default value
      this.value = this._default || [];
    }
  }, {
    key: '_throwIfUndefined',
    value: function _throwIfUndefined() {
      if (!this.deserializedValue) {
        throw new Error('Array is undefined');
      }
    }
  }, {
    key: '_serialize',
    value: function _serialize(items) {
      var _this = this;

      return items.map(function (item) {
        return _this._createItem(item);
      });
    }
  }, {
    key: '_deserialize',
    value: function _deserialize(items) {
      return items.map(function (item) {
        return item.value;
      });
    }
  }, {
    key: 'get',
    value: function get(path) {
      if (!path) {
        return this.value;
      }

      var value = this.serializedValue;
      if (!value) {
        return void 0;
      }

      var pos = path.indexOf('.');
      if (pos === -1) {
        var _index = parseInt(path, 10);
        return value[_index];
      }

      var index = parseInt(path.substr(0, pos), 10);
      var newPath = path.substr(pos + 1);

      var item = value[index];
      if (!item || !item.get) {
        return void 0;
      }

      return item.get(newPath);
    }
  }, {
    key: 'set',
    value: function set(path, value, setAsOriginal) {
      var before = this._value;

      try {
        var pos = path.indexOf('.');
        if (pos === -1) {
          var directItems = this.value;
          var _index2 = parseInt(path, 10);

          directItems[_index2] = value;
          return;
        }

        var items = this.serializedValue;
        if (!items) {
          throw new Error('You need to initialize array first');
        }

        var index = parseInt(path.substr(0, pos), 10);
        var newPath = path.substr(pos + 1);

        var item = items[index];
        if (!item || !item.set) {
          throw new Error('You need to initialize array item first');
        }

        item.set(newPath, value, setAsOriginal);
        this._value = items;
      } catch (e) {
        this._value = before;
        throw e;
      }
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var opt = options;
      if (options.update && options.modified) {
        opt = _extends({}, options, {
          modified: false
        });
      }

      return this._preDeserialize(function (items) {
        return items.map(function (item) {
          return item.toJSON(opt);
        });
      }, options.disableDefault);
    }
  }, {
    key: 'toObject',
    value: function toObject() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var opt = options;
      if (options.update && options.modified) {
        opt = _extends({}, options, {
          modified: false
        });
      }

      return this._preDeserialize(function (items) {
        return items.map(function (item) {
          return item.toObject(opt);
        });
      }, options.disableDefault);
    }
  }, {
    key: 'isModified',
    value: function isModified(path) {
      var value = this.deserializedValue;
      var original = this._original;

      if (!original || !value) {
        return original !== value;
      }

      if (original.length !== value.length) {
        return true;
      }

      for (var i = 0; i < value.length; i++) {
        var val = value[i];
        var org = original[i];
        var isObject = _lodash2['default'].isObject(val);

        if (isObject && JSON.stringify(val) === JSON.stringify(org)) {
          continue;
        }

        if (value[i] !== original[i]) {
          return true;
        }
      }

      return false;
    }
  }, {
    key: 'value',
    set: function set(val) {
      this._customArray = null;
      _set(Object.getPrototypeOf(ArrayType.prototype), 'value', val, this);
    },
    get: function get() {
      var _this2 = this;

      var value = this.deserializedValue;
      if (!value) {
        return value;
      }

      if (!this._customArray) {
        (function () {
          var arr = _this2._customArray = new _utilsExtendedArray2['default'](_this2);
          value.forEach(function (val, index) {
            arr[index] = val;
          });
        })();
      }

      return this._customArray;
    }
  }], [{
    key: 'toString',
    value: function toString() {
      return 'Array';
    }
  }, {
    key: 'getDbType',
    value: function getDbType(prop) {
      var item = prop.item;
      var isLink = item.type.isDocumentClass || item.options && item.options.ref;
      var isSet = item.options && item.options.set;

      if (isLink) {
        return isSet ? 'LINKSET' : 'LINKLIST';
      }

      return isSet ? 'EMBEDDEDSET' : 'EMBEDDEDLIST';
    }
  }, {
    key: 'getPropertyConfig',
    value: function getPropertyConfig(prop) {
      var item = prop.item;

      if (item.type.isDocumentClass) {
        return {
          linkedClass: item.type.modelName
        };
      }

      if (item.options && item.options.ref) {
        return {
          linkedClass: item.options.ref
        };
      }

      return {
        linkedType: item.SchemaType.getDbType(item.options)
      };
    }
  }, {
    key: 'isEmbedded',
    value: function isEmbedded(prop) {
      var dbType = ArrayType.getDbType(prop);
      return _lodash2['default'].startsWith(dbType, 'EMBEDDED');
    }
  }, {
    key: 'isAbstract',
    value: function isAbstract(prop) {
      var isEmbedded = this.isEmbedded(prop);
      if (!isEmbedded) {
        return false;
      }

      var item = prop.item;
      return item.SchemaType.isAbstract(item);
    }
  }, {
    key: 'getEmbeddedSchema',
    value: function getEmbeddedSchema(prop) {
      if (!ArrayType.isEmbedded(prop)) {
        return null;
      }

      var item = prop.item;
      return item.SchemaType.getEmbeddedSchema(item);
    }
  }, {
    key: 'isArray',
    get: function get() {
      return true;
    }
  }]);

  return ArrayType;
})(_SubType3['default']);

exports['default'] = ArrayType;
module.exports = exports['default'];