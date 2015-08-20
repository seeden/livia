'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Type2 = require('./Type');

var _Type3 = _interopRequireDefault(_Type2);

var _nodeExtend = require('node.extend');

var _nodeExtend2 = _interopRequireDefault(_nodeExtend);

/*
TODO decide about prons and cons
class ArrayExt extends Array {
  constructor(base) {
    super();

    this._base = base;
  }

  get base() {
    return this._base;
  }

  push(value) {
    super.push(this.base.createItem(value));
  }

  get isModified() {
    return this.base.isModified;
  }
}*/

var ArrayType = (function (_Type) {
  _inherits(ArrayType, _Type);

  function ArrayType(data, prop, name, mainData) {
    _classCallCheck(this, ArrayType);

    _get(Object.getPrototypeOf(ArrayType.prototype), 'constructor', this).call(this, data, prop, name, mainData);

    if (!prop.item) {
      throw new Error('Type of the array item is not defined');
    }

    this._original = [];
    this._value = [];
  }

  _createClass(ArrayType, [{
    key: 'createItem',
    value: function createItem(value) {
      var item = new this.prop.item.SchemaType(this.data, this.prop.item, this.name, this.mainData);
      item.value = value;

      return item;
    }
  }, {
    key: '_empty',
    value: function _empty() {
      this._value = [];
    }
  }, {
    key: '_serialize',
    value: function _serialize(items) {
      var _this = this;

      this._empty();

      items.forEach(function (item) {
        _this.push(item);
      });

      return this._value;
    }
  }, {
    key: '_deserialize',
    value: function _deserialize() {
      return this;
    }
  }, {
    key: 'set',
    value: function set(index, value) {
      this._value[index] = this.createItem(value);
      return this;
    }
  }, {
    key: 'get',
    value: function get(index) {
      var item = this._value[index];
      return item ? item.value : item;
    }
  }, {
    key: 'push',
    value: function push(value) {
      return this._value.push(this.createItem(value));
    }
  }, {
    key: 'pop',
    value: function pop() {
      var item = this._value.pop();
      return item ? item.value : item;
    }
  }, {
    key: 'splice',
    value: function splice() {
      var value = this._value;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      value.splice.apply(value, args).map(function (item) {
        return item.value;
      });
    }
  }, {
    key: 'forEach',
    value: function forEach(fn) {
      return this._value.forEach(function (item, index, array) {
        fn(item.value, index, array);
      });
    }
  }, {
    key: 'map',
    value: function map(fn) {
      return this._value.map(function (item, index, array) {
        return fn(item.value, index, array);
      });
    }
  }, {
    key: 'filter',
    value: function filter(fn) {
      return this._value.filter(function (item) {
        return fn(item.value);
      }).map(function (item) {
        return item.value;
      });
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var opt = options;
      if (options.update && options.modified) {
        opt = (0, _nodeExtend2['default'])({}, options, { modified: false });
      }

      return this._value.map(function (item) {
        return item.toJSON(opt);
      });
    }
  }, {
    key: 'toObject',
    value: function toObject() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var opt = options;
      if (options.update && options.modified) {
        opt = (0, _nodeExtend2['default'])({}, options, { modified: false });
      }

      return this._value.map(function (item) {
        return item.toObject(opt);
      });
    }
  }, {
    key: 'length',
    get: function get() {
      return this._value.length;
    }
  }, {
    key: 'isModified',
    get: function get() {
      if (this._original.length !== this._value.length) {
        return true;
      }

      var isModified = false;
      this._value.forEach(function (prop) {
        if (prop.isModified) {
          isModified = true;
        }
      });

      return isModified;
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

      return item.type.isDocumentClass ? 'LINKLIST' : 'EMBEDDEDLIST';
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

      return {
        linkedType: item.SchemaType.getDbType(item.options)
      };
    }
  }, {
    key: 'isEmbedded',
    value: function isEmbedded(prop) {
      var dbType = ArrayType.getDbType(prop);
      return dbType === 'EMBEDDEDLIST';
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
})(_Type3['default']);

exports['default'] = ArrayType;
module.exports = exports['default'];