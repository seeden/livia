'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var _StringType2 = require('./String');

var _StringType3 = _interopRequireWildcard(_StringType2);

var _Document = require('../Document');

var _Document2 = _interopRequireWildcard(_Document);

var LinkedType = (function (_StringType) {
	function LinkedType() {
		_classCallCheck(this, LinkedType);

		if (_StringType != null) {
			_StringType.apply(this, arguments);
		}
	}

	_inherits(LinkedType, _StringType);

	_createClass(LinkedType, [{
		key: '_serialize',
		value: function _serialize(value) {
			if (_import2['default'].isPlainObject(value)) {
				var doc = this._value = this._value instanceof _Document2['default'] ? this._value : new this.options.type({});

				doc.set(value);
				return doc;
			}

			return _get(Object.getPrototypeOf(LinkedType.prototype), '_serialize', this).call(this, value);
		}
	}, {
		key: 'toJSON',
		value: function toJSON(options) {
			var value = this.value;
			if (value instanceof _Document2['default']) {
				return value.toJSON(options);
			}

			return _get(Object.getPrototypeOf(LinkedType.prototype), 'toJSON', this).call(this, options);
		}
	}, {
		key: 'toObject',
		value: function toObject(options) {
			var value = this.value;
			if (value instanceof _Document2['default']) {
				return value.toObject(options);
			}

			return _get(Object.getPrototypeOf(LinkedType.prototype), 'toObject', this).call(this, options);
		}
	}, {
		key: 'isModified',
		get: function () {
			if (this._value instanceof _Document2['default']) {
				var isModified = false;

				this._value.forEach(true, function (prop) {
					if (prop.isModified) {
						isModified = true;
					}
				});

				return isModified;
			}

			return _get(Object.getPrototypeOf(LinkedType.prototype), 'isModified', this);
		}
	}, {
		key: 'linkedClass',
		get: function () {
			var type = this.options.type;
			return type.modelName ? type.modelName : null;
		}
	}]);

	return LinkedType;
})(_StringType3['default']);

exports['default'] = LinkedType;
module.exports = exports['default'];