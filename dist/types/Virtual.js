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

var Virtual = (function (_Type) {
  _inherits(Virtual, _Type);

  function Virtual() {
    _classCallCheck(this, Virtual);

    _get(Object.getPrototypeOf(Virtual.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Virtual, [{
    key: '_preSerialize',
    value: function _preSerialize(value) {
      return this._serialize(value);
    }
  }, {
    key: '_preDeserialize',
    value: function _preDeserialize(value) {
      return this._deserialize(value);
    }
  }, {
    key: '_serialize',
    value: function _serialize(value) {
      this.applySet(this.mainData, value);
    }
  }, {
    key: '_deserialize',
    value: function _deserialize() {
      return this.applyGet(this.mainData);
    }
  }, {
    key: 'applyGet',
    value: function applyGet(scope) {
      if (!this.options.get) {
        throw new Error('Getter is not defined');
      }

      return this.options.get.call(scope, this, this.data);
    }
  }, {
    key: 'applySet',
    value: function applySet(scope, value) {
      if (!this.options.set) {
        return this;
      }

      this.options.set.call(scope, value, this, this.data);
      return this;
    }
  }, {
    key: 'isModified',
    get: function get() {
      return false;
    }
  }], [{
    key: 'toString',
    value: function toString() {
      return 'Virtual';
    }
  }]);

  return Virtual;
})(_Type3['default']);

exports['default'] = Virtual;
module.exports = exports['default'];