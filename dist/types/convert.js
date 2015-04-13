"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var Type = _interopRequire(require("./type"));

var StringType = _interopRequire(require("./string"));

var NumberType = _interopRequire(require("./number"));

var BooleanType = _interopRequire(require("./boolean"));

var DateType = _interopRequire(require("./date"));

var ObjectType = _interopRequire(require("./object"));

var LinkedType = _interopRequire(require("./linked"));

var ArrayType = _interopRequire(require("./array"));

var ModelBase = _interopRequire(require("../modelbase"));

var SchemaBase = _interopRequire(require("../schemas/schemabase"));

var _ = _interopRequire(require("lodash"));

var Document = _interopRequire(require("../document"));

module.exports = function (type) {
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
};