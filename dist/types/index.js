"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var BooleanType = _interopRequire(require("./boolean"));

var IntegerType = _interopRequire(require("./integer"));

var LongType = _interopRequire(require("./long"));

var NumberType = _interopRequire(require("./number"));

var StringType = _interopRequire(require("./string"));

var ArrayType = _interopRequire(require("./array"));

var ObjectType = _interopRequire(require("./object"));

var MixedType = _interopRequire(require("./mixed"));

var RIDType = _interopRequire(require("./rid"));

var DateType = _interopRequire(require("./date"));

module.exports = {
	Boolean: BooleanType,
	Integer: IntegerType,
	Long: LongType,
	String: StringType,
	Number: NumberType,
	EmbeddedList: ArrayType,
	Mixed: MixedType,
	Rid: RIDType,
	Date: DateType,
	Embedded: ObjectType
};