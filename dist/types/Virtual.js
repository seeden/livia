"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Type = _interopRequire(require("./type"));

var Virtual = (function (_Type) {
	function Virtual() {
		_classCallCheck(this, Virtual);

		if (_Type != null) {
			_Type.apply(this, arguments);
		}
	}

	_inherits(Virtual, _Type);

	_createClass(Virtual, {
		_preSerialize: {
			value: function _preSerialize(value) {
				return this._serialize(value);
			}
		},
		_preDeserialize: {
			value: function _preDeserialize(value) {
				return this._deserialize(value);
			}
		},
		_serialize: {
			value: function _serialize(value) {
				this.applySet(this.mainData, value);
			}
		},
		_deserialize: {
			value: function _deserialize() {
				return this.applyGet(this.mainData);
			}
		},
		applyGet: {
			value: function applyGet(scope) {
				if (!this.options.get) {
					throw new Error("Getter is not defined");
				}

				return this.options.get.call(scope, this);
			}
		},
		applySet: {
			value: function applySet(scope, value) {
				if (!this.options.set) {
					return this;
				}

				this.options.set.call(scope, value, this);
				return this;
			}
		},
		isModified: {
			get: function () {
				return false;
			}
		}
	}, {
		toString: {
			value: function toString() {
				return "Virtual";
			}
		}
	});

	return Virtual;
})(Type);

module.exports = Virtual;