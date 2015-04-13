"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Type = _interopRequire(require("./type"));

var _ = _interopRequire(require("lodash"));

var _oriento = require("oriento");

var orineto = _interopRequire(_oriento);

var RecordID = _oriento.RecordID;

var RIDType = (function (_Type) {
	function RIDType() {
		_classCallCheck(this, RIDType);

		if (_Type != null) {
			_Type.apply(this, arguments);
		}
	}

	_inherits(RIDType, _Type);

	_createClass(RIDType, {
		_serialize: {
			value: function _serialize(value) {
				var record = new RecordID(value);
				if (!record) {
					throw new Error("Problem with parsing of RID: " + value);
				}

				return record;
			}
		},
		_deserialize: {
			value: function _deserialize(value) {
				return value;
			}
		},
		toObject: {
			value: function toObject(options) {
				return this.value;
			}
		},
		toJSON: {
			value: function toJSON(options) {
				return this.value ? this.value.toString() : null;
			}
		}
	}, {
		toString: {
			value: function toString() {
				return "String";
			}
		},
		getDbType: {
			value: function getDbType(options) {
				return "LINK";
			}
		}
	});

	return RIDType;
})(Type);

module.exports = RIDType;