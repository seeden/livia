'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _keymirror = require('keymirror');

var _keymirror2 = _interopRequireWildcard(_keymirror);

exports['default'] = _keymirror2['default']({
  BASIC: null, // basic index
  DICTIONARY: null, // dictionary index
  FULLTEXT: null, // text index
  SPATIAL: null
});
module.exports = exports['default'];