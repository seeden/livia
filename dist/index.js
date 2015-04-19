'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Adapter = require('./Adapter');

var _Adapter2 = _interopRequireWildcard(_Adapter);

var _Connection = require('./Connection');

var _Connection2 = _interopRequireWildcard(_Connection);

var _Schema = require('./schemas/Schema');

var _Schema2 = _interopRequireWildcard(_Schema);

var _Vertex = require('./schemas/Vertex');

var _Vertex2 = _interopRequireWildcard(_Vertex);

var _Edge = require('./schemas/Edge');

var _Edge2 = _interopRequireWildcard(_Edge);

var _Graph = require('./schemas/Graph');

var _Graph2 = _interopRequireWildcard(_Graph);

var _Model = require('./Model');

var _Model2 = _interopRequireWildcard(_Model);

var _Query = require('./Query');

var _Query2 = _interopRequireWildcard(_Query);

var _Document = require('./Document');

var _Document2 = _interopRequireWildcard(_Document);

var _Type = require('./types/index');

var _Type2 = _interopRequireWildcard(_Type);

var _Index = require('./constants/IndexType');

var _Index2 = _interopRequireWildcard(_Index);

_Schema2['default'].Vertex = _Vertex2['default'];
_Schema2['default'].Edge = _Edge2['default'];
_Schema2['default'].Graph = _Graph2['default'];

_Connection2['default'].Schema = _Schema2['default'];
_Connection2['default'].Model = _Model2['default'];
_Connection2['default'].Type = _Type2['default'];
_Connection2['default'].Adapter = _Adapter2['default'];
_Connection2['default'].Query = _Query2['default'];
_Connection2['default'].Document = _Document2['default'];

_Connection2['default'].Index = _Index2['default'];

exports['default'] = _Connection2['default'];
module.exports = exports['default'];