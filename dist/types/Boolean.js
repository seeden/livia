'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _Type2 = require('./Type');

var _Type3 = _interopRequireWildcard(_Type2);

var BooleanType = (function (_Type) {
	function BooleanType() {
		_classCallCheck(this, BooleanType);

		if (_Type != null) {
			_Type.apply(this, arguments);
		}
	}

	_inherits(BooleanType, _Type);

	_createClass(BooleanType, [{
		key: '_serialize',
		value: function _serialize(value) {
			if (typeof value === 'string') {
				value = value.toLowerCase();
				if (value === 'true' || value === 'yes' || value === '1') {
					return true;
				}

				return false;
			}

			return Boolean(value);
		}
	}, {
		key: '_deserialize',
		value: function _deserialize(value) {
			return value;
		}
	}], [{
		key: 'toString',
		value: function toString() {
			return 'Boolean';
		}
	}, {
		key: 'getDbType',
		value: function getDbType() {
			return 'BOOLEAN';
		}
	}]);

	return BooleanType;
})(_Type3['default']);

exports['default'] = BooleanType;
module.exports = exports['default'];