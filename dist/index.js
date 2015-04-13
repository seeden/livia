"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var Adapter = _interopRequire(require("./adapter"));

var Connection = _interopRequire(require("./connection"));

var Schema = _interopRequire(require("./schemas/index"));

var Model = _interopRequire(require("./model"));

var Type = _interopRequire(require("./types/index"));

Connection.Schema = SchemaOrient;
Connection.Model = Model;
Connection.Type = Type;
Connection.Adapter = Adapter;

module.exports = Connection;