'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var Adapter = (function () {
  function Adapter() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Adapter);

    this._options = options;
  }

  _createClass(Adapter, [{
    key: 'options',
    get: function () {
      return this._options;
    }
  }, {
    key: 'native',
    get: function () {
      throw new Error('Please override native getter');
    }
  }, {
    key: 'connect',
    value: function connect() {
      throw new Error('Please override connect method');
    }
  }, {
    key: 'ensureClass',
    value: function ensureClass() {
      throw new Error('Please override ensureClass method');
    }
  }, {
    key: 'query',
    value: function query() {
      throw new Error('Please override query method');
    }
  }]);

  return Adapter;
})();

exports['default'] = Adapter;
module.exports = exports['default'];
/*callback*/ /*model, callback*/ /*model, options*/