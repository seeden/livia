"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Graph = _interopRequire(require("./graph"));

var Edge = (function (_Graph) {
  function Edge() {
    _classCallCheck(this, Edge);

    if (_Graph != null) {
      _Graph.apply(this, arguments);
    }
  }

  _inherits(Edge, _Graph);

  return Edge;
})(Graph);

module.exports = Edge;