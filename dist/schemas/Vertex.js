'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Graph2 = require('./Graph');

var _Graph3 = _interopRequireWildcard(_Graph2);

var Vertex = (function (_Graph) {
  function Vertex() {
    _classCallCheck(this, Vertex);

    if (_Graph != null) {
      _Graph.apply(this, arguments);
    }
  }

  _inherits(Vertex, _Graph);

  return Vertex;
})(_Graph3['default']);

exports['default'] = Vertex;
module.exports = exports['default'];