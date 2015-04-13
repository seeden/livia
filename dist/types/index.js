"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var BooleanType = _interopRequire(require("./Boolean"));

var NumberType = _interopRequire(require("./Number"));

var StringType = _interopRequire(require("./String"));

var ArrayType = _interopRequire(require("./Array"));

var ObjectType = _interopRequire(require("./Object"));

var MixedType = _interopRequire(require("./Mixed"));

var DateType = _interopRequire(require("./Date"));

module.exports = {
	Boolean: BooleanType,
	String: StringType,
	Number: NumberType,
	EmbeddedList: ArrayType,
	Mixed: MixedType,
	Date: DateType,
	Embedded: ObjectType
};