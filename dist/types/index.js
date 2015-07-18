'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Type = require('./Type');

var _Type2 = _interopRequireWildcard(_Type);

var _BooleanType = require('./Boolean');

var _BooleanType2 = _interopRequireWildcard(_BooleanType);

var _NumberType = require('./Number');

var _NumberType2 = _interopRequireWildcard(_NumberType);

var _StringType = require('./String');

var _StringType2 = _interopRequireWildcard(_StringType);

var _ArrayType = require('./Array');

var _ArrayType2 = _interopRequireWildcard(_ArrayType);

var _ObjectType = require('./Object');

var _ObjectType2 = _interopRequireWildcard(_ObjectType);

var _MixedType = require('./Mixed');

var _MixedType2 = _interopRequireWildcard(_MixedType);

var _DateType = require('./Date');

var _DateType2 = _interopRequireWildcard(_DateType);

var _LinkedType = require('./Linked');

var _LinkedType2 = _interopRequireWildcard(_LinkedType);

exports['default'] = {
  Type: _Type2['default'],
  Boolean: _BooleanType2['default'],
  String: _StringType2['default'],
  Number: _NumberType2['default'],
  Date: _DateType2['default'],
  Array: _ArrayType2['default'],
  Mixed: _MixedType2['default'],
  Object: _ObjectType2['default'],
  Linked: _LinkedType2['default']
};
module.exports = exports['default'];