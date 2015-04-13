"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _ = _interopRequire(require("lodash"));

var StringType = _interopRequire(require("./String"));

var Document = _interopRequire(require("../document"));

var LinkedType = (function (_StringType) {
	function LinkedType() {
		_classCallCheck(this, LinkedType);

		if (_StringType != null) {
			_StringType.apply(this, arguments);
		}
	}

	_inherits(LinkedType, _StringType);

	_createClass(LinkedType, {
		_serialize: {
			value: function _serialize(value) {
				if (_.isPlainObject(value)) {
					var doc = this._value = this._value instanceof Document ? this._value : new this.options.type({});

					doc.set(value);
					return doc;
				}

				return _get(Object.getPrototypeOf(LinkedType.prototype), "_serialize", this).call(this, value);
			}
		},
		toJSON: {
			value: function toJSON(options) {
				var value = this.value;
				if (value instanceof Document) {
					return value.toJSON(options);
				}

				return _get(Object.getPrototypeOf(LinkedType.prototype), "toJSON", this).call(this, options);
			}
		},
		toObject: {
			value: function toObject(options) {
				var value = this.value;
				if (value instanceof Document) {
					return value.toObject(options);
				}

				return _get(Object.getPrototypeOf(LinkedType.prototype), "toObject", this).call(this, options);
			}
		},
		isModified: {
			get: function () {
				if (this._value instanceof Document) {
					var isModified = false;

					this._value.forEach(true, function (prop) {
						if (prop.isModified) {
							isModified = true;
						}
					});

					return isModified;
				}

				return _get(Object.getPrototypeOf(LinkedType.prototype), "isModified", this);
			}
		},
		linkedClass: {
			get: function () {
				var type = this.options.type;
				return type.modelName ? type.modelName : null;
			}
		}
	});

	return LinkedType;
})(StringType);

module.exports = LinkedType;