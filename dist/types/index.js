'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Type = require('./Type');

var _Type2 = _interopRequireDefault(_Type);

var _Boolean = require('./Boolean');

var _Boolean2 = _interopRequireDefault(_Boolean);

var _Number = require('./Number');

var _Number2 = _interopRequireDefault(_Number);

var _String = require('./String');

var _String2 = _interopRequireDefault(_String);

var _Array = require('./Array');

var _Array2 = _interopRequireDefault(_Array);

var _Object = require('./Object');

var _Object2 = _interopRequireDefault(_Object);

var _Mixed = require('./Mixed');

var _Mixed2 = _interopRequireDefault(_Mixed);

var _Date = require('./Date');

var _Date2 = _interopRequireDefault(_Date);

var _Linked = require('./Linked');

var _Linked2 = _interopRequireDefault(_Linked);

exports['default'] = {
  'Type': _Type2['default'],
  'Boolean': _Boolean2['default'],
  'String': _String2['default'],
  'Number': _Number2['default'],
  'Date': _Date2['default'],
  'Array': _Array2['default'],
  'Mixed': _Mixed2['default'],
  'Object': _Object2['default'],
  'Linked': _Linked2['default']
};
module.exports = exports['default'];