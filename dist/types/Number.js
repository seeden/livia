'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _Type2 = require('./type');

var _Type3 = _interopRequireWildcard(_Type2);

var NumberType = (function (_Type) {
	function NumberType() {
		_classCallCheck(this, NumberType);

		if (_Type != null) {
			_Type.apply(this, arguments);
		}
	}

	_inherits(NumberType, _Type);

	_createClass(NumberType, [{
		key: '_serialize',
		value: function _serialize(value) {
			return Number(value);
		}
	}, {
		key: '_deserialize',
		value: function _deserialize(value) {
			return value;
		}
	}], [{
		key: 'toString',
		value: function toString() {
			return 'Number';
		}
	}, {
		key: 'getDbType',
		value: function getDbType(options) {
			return 'DOUBLE';
		}
	}]);

	return NumberType;
})(_Type3['default']);

exports['default'] = NumberType;
module.exports = exports['default'];