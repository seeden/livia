"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Type = _interopRequire(require("./type"));

var DateType = (function (_Type) {
	function DateType() {
		_classCallCheck(this, DateType);

		if (_Type != null) {
			_Type.apply(this, arguments);
		}
	}

	_inherits(DateType, _Type);

	_createClass(DateType, {
		_serialize: {
			value: function _serialize(value) {
				return new Date(value);
			}
		},
		_deserialize: {
			value: function _deserialize(value) {
				return value;
			}
		},
		toJSON: {
			value: function toJSON(options) {
				return this.toObject();
			}
		},
		toObject: {
			value: function toObject(options) {
				var value = this.value;
				return value && value.getTime ? value.getTime() : value.value;
			}
		}
	}, {
		toString: {
			value: function toString() {
				return "Date";
			}
		},
		getDbType: {
			value: function getDbType(options) {
				return "DATETIME";
			}
		}
	});

	return DateType;
})(Type);

module.exports = DateType;