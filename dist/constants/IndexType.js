"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var keymirror = _interopRequire(require("keymirror"));

module.exports = keymirror({
	NOTUNIQUE: null, //basic index
	UNIQUE: null, //unique index
	FULLTEXT: null, //text index
	DICTIONARY: null //
});