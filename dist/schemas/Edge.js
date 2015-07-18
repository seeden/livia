'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Graph2 = require('./Graph');

var _Graph3 = _interopRequireWildcard(_Graph2);

var Edge = (function (_Graph) {
  function Edge(props, options) {
    _classCallCheck(this, Edge);

    _get(Object.getPrototypeOf(Edge.prototype), 'constructor', this).call(this, props, options);

    this.methods.from = function from() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (args.length) {
        this._from = args[0];
        return this;
      }

      return this._from;
    };

    this.methods.to = function to() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      if (args.length) {
        this._to = args[0];
        return this;
      }

      return this._to;
    };
  }

  _inherits(Edge, _Graph);

  return Edge;
})(_Graph3['default']);

exports['default'] = Edge;
module.exports = exports['default'];