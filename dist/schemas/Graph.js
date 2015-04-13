"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Schema = _interopRequire(require("./Schema"));

var Graph = (function (_Schema) {
  function Graph() {
    _classCallCheck(this, Graph);

    if (_Schema != null) {
      _Schema.apply(this, arguments);
    }
  }

  _inherits(Graph, _Schema);

  return Graph;
})(Schema);

module.exports = Graph;