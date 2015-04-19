'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Schema2 = require('./Schema');

var _Schema3 = _interopRequireWildcard(_Schema2);

var Graph = (function (_Schema) {
  function Graph() {
    _classCallCheck(this, Graph);

    if (_Schema != null) {
      _Schema.apply(this, arguments);
    }
  }

  _inherits(Graph, _Schema);

  return Graph;
})(_Schema3['default']);

exports['default'] = Graph;
module.exports = exports['default'];