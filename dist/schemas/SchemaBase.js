"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var EventEmitter = require("events").EventEmitter;

var _ = _interopRequire(require("lodash"));

var Type = _interopRequire(require("../types/Type"));

var StringType = _interopRequire(require("../types/String"));

var NumberType = _interopRequire(require("../types/Number"));

var BooleanType = _interopRequire(require("../types/Boolean"));

var DateType = _interopRequire(require("../types/Date"));

var ObjectType = _interopRequire(require("../types/Object"));

var LinkedType = _interopRequire(require("../types/Linked"));

var ArrayType = _interopRequire(require("../types/Array"));

var Document = _interopRequire(require("../Document"));

var SchemaBase = (function (_EventEmitter) {
	function SchemaBase(options) {
		_classCallCheck(this, SchemaBase);

		_get(Object.getPrototypeOf(SchemaBase.prototype), "constructor", this).call(this);

		this._props = {};
		this._options = options || {};
	}

	_inherits(SchemaBase, _EventEmitter);

	_createClass(SchemaBase, {
		options: {
			get: function () {
				return this._options;
			}
		},
		convertType: {
			value: function convertType(type) {
				if (!type) {
					throw new Error("Type is not defined");
				} else if (type.isSchemaType) {
					return type;
				} else if (type instanceof SchemaBase) {
					return ObjectType;
				} else if (type.prototype && type.prototype.constructor && type.prototype.constructor.__proto__ === Document) {
					return LinkedType;
				} else if (_.isArray(type)) {
					return ArrayType;
				} else if (type === String) {
					return StringType;
				} else if (type === Number) {
					return NumberType;
				} else if (type === Boolean) {
					return BooleanType;
				} else if (type === Date) {
					return DateType;
				}

				throw new Error("Unrecognized type");
			}
		}
	});

	return SchemaBase;
})(EventEmitter);

module.exports = SchemaBase;