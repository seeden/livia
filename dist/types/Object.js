"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Type = _interopRequire(require("./type"));

var _ = _interopRequire(require("lodash"));

var ObjectType = (function (_Type) {
	function ObjectType(data, prop, name, mainData) {
		_classCallCheck(this, ObjectType);

		_get(Object.getPrototypeOf(ObjectType.prototype), "constructor", this).call(this, data, prop, name, mainData);

		this._schema = prop.type;

		this._value = new this._schema.DataClass({}, this._computeClassName(data, prop), mainData);
	}

	_inherits(ObjectType, _Type);

	_createClass(ObjectType, {
		_computeClassName: {
			value: function _computeClassName(data, prop) {
				var schemaType = prop.schemaType;
				var options = prop.options;
				var className = data._className;
				var type = schemaType.getDbType(options);

				if (type === "EMBEDDED" && schemaType.isObject) {
					return className + "A" + _.capitalize(this.name);
				} else if (type === "EMBEDDEDLIST" && schemaType.isArray && prop.item) {
					var item = prop.item;
					if (item.schemaType.isObject) {
						return className + "A" + _.capitalize(propName);
					}
				}

				return;
			}
		},
		set: {
			value: function set(key, value) {
				if (!this._value) {
					this._value = new this._schema.DataClass({}, this._computeClassName(this.data, this.prop), this.mainData);
				}

				this._value[key] = value;
			}
		},
		_serialize: {
			value: function _serialize(props) {
				for (var propName in props) {
					this.set(propName, props[propName]);
				}
				return this._value;
			}
		},
		_deserialize: {
			value: function _deserialize() {
				return this._value;
			}
		},
		toJSON: {
			value: function toJSON(options) {
				var value = this.value;
				return value ? value.toJSON(options) : value;
			}
		},
		toObject: {
			value: function toObject(options) {
				var value = this.value;
				return value ? value.toObject(options) : value;
			}
		},
		isModified: {
			get: function () {
				if (!this._value) {
					return this.original !== this.value;
				}

				var isModified = false;

				this._value.forEach(true, function (prop) {
					if (prop.isModified) {
						isModified = true;
					}
				});

				return isModified;
			}
		}
	}, {
		getDbType: {
			value: function getDbType(options) {
				return "EMBEDDED";
			}
		},
		toString: {
			value: function toString() {
				return "Object";
			}
		},
		isObject: {
			get: function () {
				return true;
			}
		}
	});

	return ObjectType;
})(Type);

module.exports = ObjectType;