'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _Type2 = require('./Type');

var _Type3 = _interopRequireWildcard(_Type2);

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var ObjectType = (function (_Type) {
	function ObjectType() {
		_classCallCheck(this, ObjectType);

		if (_Type != null) {
			_Type.apply(this, arguments);
		}
	}

	_inherits(ObjectType, _Type);

	_createClass(ObjectType, [{
		key: 'schema',

		/*
  constructor(data, prop, name, mainData) {
  	super(data, prop, name, mainData);
  
  	//this._value = new this._schema.DataClass({}, this._computeClassName(data, prop), mainData);
  }*/

		get: function () {
			return this.prop.type;
		}
	}, {
		key: 'set',
		value: function set(key, value) {
			if (!this._value) {
				var className = this.data._className;
				var abstractClassName = _Type3['default'].computeAbstractClassName(className, this.name);

				this._value = new this.schema.DataClass({}, abstractClassName, this.mainData);
			}

			this._value[key] = value;
		}
	}, {
		key: '_serialize',
		value: function _serialize(props) {
			for (var propName in props) {
				this.set(propName, props[propName]);
			}
			return this._value;
		}
	}, {
		key: '_deserialize',
		value: function _deserialize() {
			return this._value;
		}
	}, {
		key: 'toJSON',
		value: function toJSON(options) {
			var value = this.value;
			return value ? value.toJSON(options) : value;
		}
	}, {
		key: 'toObject',
		value: function toObject(options) {
			var value = this.value;
			return value ? value.toObject(options) : value;
		}
	}, {
		key: 'isModified',
		get: function () {
			if (!this._value) {
				return this.original !== this.value;
			}

			var isModified = false;
			this._value.forEach(true, function (prop) {
				isModified = prop.isModified || isModified;
			});

			return isModified;
		}
	}], [{
		key: 'getDbType',
		value: function getDbType() {
			return 'EMBEDDED';
		}
	}, {
		key: 'toString',
		value: function toString() {
			return 'Object';
		}
	}, {
		key: 'isObject',
		get: function () {
			return true;
		}
	}, {
		key: 'isEmbedded',
		value: function isEmbedded(prop) {
			return true;
		}
	}, {
		key: 'isAbstract',
		value: function isAbstract(prop) {
			return true;
		}
	}, {
		key: 'getEmbeddedSchema',
		value: function getEmbeddedSchema(prop) {
			return prop.type;
		}
	}]);

	return ObjectType;
})(_Type3['default']);

exports['default'] = ObjectType;
module.exports = exports['default'];