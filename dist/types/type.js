"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Type = (function () {
	function Type(data, prop, name, mainData) {
		_classCallCheck(this, Type);

		if (!data || !prop || !name || !mainData) {
			throw new Error("Data or prop is undefined");
		}

		var options = prop.options || {};

		this._data = data;
		this._mainData = mainData;
		this._prop = prop;
		this._options = options;
		this._name = name;

		this._default = options["default"];
		this._value = void 0;
		this._original = void 0;

		this._handleNull = true;
		this._handleUndefined = true;
	}

	_createClass(Type, {
		data: {
			get: function () {
				return this._data;
			}
		},
		mainData: {
			get: function () {
				return this._mainData;
			}
		},
		original: {
			get: function () {
				return this._original;
			}
		},
		options: {
			get: function () {
				return this._options;
			}
		},
		prop: {
			get: function () {
				return this._prop;
			}
		},
		name: {
			get: function () {
				return this._name;
			}
		},
		hasDefault: {
			get: function () {
				return typeof this._default !== "undefined";
			}
		},
		isMetadata: {
			get: function () {
				return !!this.options.metadata;
			}
		},
		value: {
			set: function (value) {
				this._value = this._preSerialize(value);
			},
			get: function () {
				var value = this._preDeserialize(this._value);
				if (typeof value !== "undefined") {
					return value;
				}

				var defaultValue = this._default;
				if (typeof defaultValue === "function") {
					defaultValue = defaultValue.apply(this.data);
				}

				return this._preDeserialize(this._preSerialize(defaultValue));
			}
		},
		_preSerialize: {
			value: function _preSerialize(value) {
				if (value === null && this._handleNull) {
					return value;
				} else if (typeof value === "undefined" && this._handleUndefined) {
					return value;
				}

				return this._serialize(value);
			}
		},
		_preDeserialize: {
			value: function _preDeserialize(value) {
				if (value === null && this._handleNull) {
					return value;
				} else if (typeof value === "undefined" && this._handleUndefined) {
					return value;
				}

				return this._deserialize(value);
			}
		},
		_serialize: {
			value: function _serialize(value) {
				throw new Error("You need to override _serialize");
			}
		},
		_deserialize: {
			value: function _deserialize(value) {
				throw new Error("You need to override _deserialize");
			}
		},
		setAsOriginal: {
			value: function setAsOriginal() {
				this._original = this.value;
				return this;
			}
		},
		rollback: {
			value: function rollback() {
				if (this.options.readonly) {
					return;
				}

				this.value = this.original;
				return this;
			}
		},
		isModified: {
			get: function () {
				return this.original !== this.value;
			}
		},
		setupData: {
			value: function setupData(data) {
				this._value = this._serialize(data);
				this._original = this.value;

				//parent.childChanged(this);
			}
		},
		toJSON: {
			value: function toJSON(options) {
				var value = this.toObject(options);

				return value && value.toJSON ? value.toJSON(options) : value;
			}
		},
		toObject: {
			value: function toObject(options) {
				return this.value;
			}
		}
	}, {
		toString: {
			value: function toString() {
				throw new Error("Method toString is not defined");
			}
		},
		getDbType: {
			value: function getDbType(options) {
				throw new Error("You need to override getter dbType");
			}
		},
		isSchemaType: {
			get: function () {
				return true;
			}
		},
		getPropertyConfig: {
			value: function getPropertyConfig(options) {
				return {};
			}
		}
	});

	return Type;
})();

module.exports = Type;