'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _events = require('events');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _typesIndex = require('../types/index');

var _typesIndex2 = _interopRequireDefault(_typesIndex);

var SchemaBase = (function (_EventEmitter) {
  _inherits(SchemaBase, _EventEmitter);

  function SchemaBase() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, SchemaBase);

    _get(Object.getPrototypeOf(SchemaBase.prototype), 'constructor', this).call(this);

    this._props = {};
    this._options = options;
  }

  _createClass(SchemaBase, [{
    key: 'convertType',
    value: function convertType(type) {
      if (!type) {
        throw new Error('Type is not defined');
      } else if (type.isSchemaType) {
        return type;
      } else if (type instanceof SchemaBase) {
        return _typesIndex2['default'].Object;
      } else if (type.isDocumentClass) {
        return _typesIndex2['default'].Linked;
      } else if (_lodash2['default'].isArray(type)) {
        return _typesIndex2['default'].Array;
      } else if (type === String) {
        return _typesIndex2['default'].String;
      } else if (type === Number) {
        return _typesIndex2['default'].Number;
      } else if (type === Boolean) {
        return _typesIndex2['default'].Boolean;
      } else if (type === Date) {
        return _typesIndex2['default'].Date;
      }

      throw new Error('Unrecognized type');
    }
  }, {
    key: 'options',
    get: function get() {
      return this._options;
    }
  }]);

  return SchemaBase;
})(_events.EventEmitter);

exports['default'] = SchemaBase;
module.exports = exports['default'];