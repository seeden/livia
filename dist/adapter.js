"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Adapter = (function () {
	function Adapter() {
		_classCallCheck(this, Adapter);
	}

	_createClass(Adapter, {
		ensureClass: {
			value: function ensureClass(model, callback) {
				throw new Error("Please override ensureClass method");
			}
		},
		query: {
			value: function query(model, options) {
				throw new Error("Please override query method");
				return new Query(model, options);
			}
		}
	});

	return Adapter;
})();

module.exports = Adapter;