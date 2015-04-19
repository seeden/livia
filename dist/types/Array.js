'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _Type2 = require('./type');

var _Type3 = _interopRequireWildcard(_Type2);

var _Schema = require('../schemas/Schema');

var _Schema2 = _interopRequireWildcard(_Schema);

var ArrayType = (function (_Type) {
	function ArrayType(data, prop, name, mainData) {
		_classCallCheck(this, ArrayType);

		_get(Object.getPrototypeOf(ArrayType.prototype), 'constructor', this).call(this, data, prop, name, mainData);

		if (!prop.item) {
			throw new Error('Type of the array item is not defined');
		}

		this._original = [];
		this._value = [];
	}

	_inherits(ArrayType, _Type);

	_createClass(ArrayType, [{
		key: '_createItem',
		value: function _createItem(value) {
			var item = new this.prop.item.schemaType(this.data, this.prop.item, this.name, this.mainData);
			item.value = value;

			return item;
		}
	}, {
		key: '_empty',
		value: function _empty() {
			this._value = [];
		}
	}, {
		key: '_serialize',
		value: function _serialize(items) {
			var _this = this;

			this._empty();

			items.forEach(function (item) {
				_this.push(item);
			});

			return this._value;
		}
	}, {
		key: '_deserialize',
		value: function _deserialize() {
			return this;
		}
	}, {
		key: 'set',
		value: function set(index, value) {
			return this._value[index] = this._createItem(value);
		}
	}, {
		key: 'push',
		value: function push(value) {
			return this._value.push(this._createItem(value));
		}
	}, {
		key: 'pop',
		value: function pop() {
			var item = this._value.pop();
			return item ? item.value : item;
		}
	}, {
		key: 'forEach',
		value: function forEach(fn) {
			return this._value.forEach(function (item) {
				fn(item.value);
			});
		}
	}, {
		key: 'map',
		value: function map(fn) {
			return this._value.map(function (item) {
				return fn(item.value);
			});
		}
	}, {
		key: 'filter',
		value: function filter(fn) {
			return this._value.filter(function (item) {
				return fn(item.value);
			});
		}
	}, {
		key: 'toJSON',
		value: function toJSON(options) {
			return this._value.map(function (item) {
				return item.toJSON(options);
			});
		}
	}, {
		key: 'toObject',
		value: function toObject(options) {
			return this._value.map(function (item) {
				return item.toObject(options);
			});
		}
	}, {
		key: 'isModified',
		get: function () {
			if (this._original.length !== this._value.length) {
				return true;
			}

			var isModified = false;
			this._value.forEach(function (prop) {
				if (prop.isModified) {
					isModified = true;
				}
			});

			return isModified;
		}
	}], [{
		key: 'toString',
		value: function toString() {
			return 'Array';
		}
	}, {
		key: 'getDbType',
		value: function getDbType(options) {
			return 'EMBEDDEDLIST';
		}
	}, {
		key: 'getPropertyConfig',
		value: function getPropertyConfig(propOptions) {
			var item = propOptions.item;

			return {
				linkedType: item.schemaType.getDbType(item.options)
			};
		}
	}, {
		key: 'isArray',
		get: function () {
			return true;
		}
	}]);

	return ArrayType;
})(_Type3['default']);

exports['default'] = ArrayType;
module.exports = exports['default'];