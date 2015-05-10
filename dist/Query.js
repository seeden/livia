'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _debug = require('debug');

var _debug2 = _interopRequireWildcard(_debug);

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var _extend = require('node.extend');

var _extend2 = _interopRequireWildcard(_extend);

var _Document = require('./Document');

var _Document2 = _interopRequireWildcard(_Document);

var _GraphSchema = require('./schemas/Graph');

var _GraphSchema2 = _interopRequireWildcard(_GraphSchema);

var _EdgeSchema = require('./schemas/Edge');

var _EdgeSchema2 = _interopRequireWildcard(_EdgeSchema);

var _LogicOperators = require('./constants/LogicOperators');

var _LogicOperators2 = _interopRequireWildcard(_LogicOperators);

var _ComparisonOperators = require('./constants/ComparisonOperators');

var _ComparisonOperators2 = _interopRequireWildcard(_ComparisonOperators);

var _ChildrenOperators = require('./constants/ChildrenOperators');

var _ChildrenOperators2 = _interopRequireWildcard(_ChildrenOperators);

var _Type = require('./types/Type');

var _Type2 = _interopRequireWildcard(_Type);

var log = _debug2['default']('orientose:query');

var Operation = {
	DELETE: 'DELETE',
	UPDATE: 'UPDATE',
	SELECT: 'SELECT',
	INSERT: 'INSERT'
};

var Operator = {
	OR: 'or',
	AND: 'and',
	WHERE: 'where'
};

var Query = (function () {
	function Query(model, options) {
		_classCallCheck(this, Query);

		options = options || {};

		if (!model) {
			throw new Error('Model is not defined');
		}

		this._paramIndex = 1;

		this._model = model;
		this._target = model.name;

		this._first = false;
		this._scalar = false;

		this._limit = null;
		this._skip = null;
		this._sort = null;
		this._fetchPlan = null;
		this._return = null;

		this._from = null;
		this._to = null;

		this._operation = null;

		this._params = {};

		this._operators = [];
		this._set = null;
	}

	_createClass(Query, [{
		key: 'model',
		get: function () {
			return this._model;
		}
	}, {
		key: 'schema',
		get: function () {
			return this.model.schema;
		}
	}, {
		key: 'native',
		get: function () {
			throw new Error('Please override native method');
		}
	}, {
		key: 'paramify',
		value: function paramify(key) {
			return key.replace(/([^A-Za-z0-9])/g, '');
		}
	}, {
		key: 'nextParamName',
		value: function nextParamName(propertyName) {
			return this.paramify(propertyName) + '_op_' + this._paramIndex++;
		}
	}, {
		key: 'addParam',
		value: function addParam(paramName, value) {
			this._params[paramName] = value;
		}
	}, {
		key: 'addParams',
		value: function addParams(params) {
			params = params || {};
			_extend2['default'](this._params, params);
		}
	}, {
		key: 'createComparisonQuery',
		value: function createComparisonQuery(propertyName, operator, value) {
			var paramName = this.nextParamName(propertyName);

			if (value === null) {
				if (operator === '=') {
					return propertyName + ' IS NULL';
				} else if (operator === '!=' || operator === '<>' || operator === 'NOT') {
					return propertyName + ' IS NOT NULL';
				}
			}

			this.addParam(paramName, value);
			return propertyName + ' ' + operator + ' :' + paramName;
		}
	}, {
		key: 'prepareValue',
		value: function prepareValue(value) {
			var _this = this;

			if (!value) {
				return value;
			} else if (value instanceof _Document2['default']) {
				return value.toObject();
			} else if (_import2['default'].isArray(value)) {
				return value.map(function (item) {
					return _this.prepareValue(item);
				});
			}

			return value;
		}
	}, {
		key: 'queryLanguage',
		value: function queryLanguage(conditions, parentPath) {
			var _this2 = this;

			var items = [];

			Object.keys(conditions).forEach(function (propertyName) {
				var value = conditions[propertyName];
				if (typeof value === 'undefined') {
					return;
				}

				if (_LogicOperators2['default'][propertyName]) {
					var subQueries = [];

					value.forEach(function (conditions) {
						var query = _this2.queryLanguage(conditions, parentPath);
						if (!query) {
							return;
						}

						subQueries.push(query);
					});

					if (!subQueries.length) {
						return;
					} else if (subQueries.length === 1) {
						return items.push(subQueries[0]);
					}

					var query = '(' + subQueries.join(') ' + _LogicOperators2['default'][propertyName] + ' (') + ')';
					return items.push(query);
				}

				value = _this2.prepareValue(value);

				if (!_import2['default'].isPlainObject(value)) {
					var query = _this2.createComparisonQuery(propertyName, '=', value);
					return items.push(query);
				}

				Object.keys(value).forEach(function (operation) {
					var operationValue = _this2.prepareValue(value[operation]);
					var query = null;

					if (_ChildrenOperators2['default'][operation]) {
						var currentPath = parentPath ? parentPath + '.' + propertyName : propertyName;
						var subOperation = _ChildrenOperators2['default'][operation];
						var subQuery = _this2.queryLanguage(operationValue, currentPath);
						if (!subQuery) {
							return;
						}

						query = '' + propertyName + ' ' + subOperation + ' (' + subQuery + ')';
					} else if (_ComparisonOperators2['default'][operation]) {
						query = _this2.createComparisonQuery(propertyName, _ComparisonOperators2['default'][operation], operationValue);
					}

					if (!query) {
						return;
					}

					items.push(query);
				});
			});

			if (!items.length) {
				return null;
			}

			return items.join(' AND ');
		}
	}, {
		key: 'operator',
		value: (function (_operator) {
			function operator(_x, _x2, _x3) {
				return _operator.apply(this, arguments);
			}

			operator.toString = function () {
				return _operator.toString();
			};

			return operator;
		})(function (operator, conditions, callback) {
			var query = this.queryLanguage(conditions);

			if (!query) {
				return this;
			}

			this._operators.push({
				type: operator,
				query: query
			});

			return this;
		})
	}, {
		key: 'condExec',
		value: function condExec(conditions, callback) {
			if (typeof conditions === 'function') {
				callback = conditions;
				conditions = void 0;
			}

			if (typeof conditions === 'string') {
				this._target = conditions;
				conditions = void 0;
			}

			if (_import2['default'].isObject(conditions)) {
				if (conditions instanceof _Document2['default']) {
					this._target = conditions;
					conditions = void 0;
				} else if (conditions && !_import2['default'].isPlainObject(conditions)) {
					this._target = conditions;
					conditions = void 0;
				} else {
					this.where(conditions);
				}
			}

			return callback ? this.exec(callback) : this;
		}
	}, {
		key: 'or',
		value: function or(conditions) {
			var self = this;
			conditions.forEach(function (condition) {
				self = self.operator(Operator.OR, condition);
			});
			return self;
		}
	}, {
		key: 'and',
		value: function and(conditions) {
			var self = this;
			conditions.forEach(function (condition) {
				self = self.operator(Operator.AND, condition);
			});
			return self;
		}
	}, {
		key: 'where',
		value: function where(conditions, callback) {
			conditions = conditions || {};
			this.operator(Operator.WHERE, conditions);

			return this.condExec(callback);
		}
	}, {
		key: 'operation',
		value: (function (_operation) {
			function operation(_x4) {
				return _operation.apply(this, arguments);
			}

			operation.toString = function () {
				return _operation.toString();
			};

			return operation;
		})(function (operation) {
			if (this._operation && this._operation !== operation) {
				throw new Error('Operation is already set');
			}
			this._operation = operation;
			return this;
		})
	}, {
		key: 'set',
		value: function set(doc) {
			this._set = doc;
			return this;
		}
	}, {
		key: 'first',
		value: function first(useFirst) {
			this._first = !!useFirst;
			return this;
		}
	}, {
		key: 'scalar',
		value: function scalar(useScalar) {
			this._scalar = !!useScalar;
			return this;
		}
	}, {
		key: 'limit',
		value: (function (_limit) {
			function limit(_x5) {
				return _limit.apply(this, arguments);
			}

			limit.toString = function () {
				return _limit.toString();
			};

			return limit;
		})(function (limit) {
			this._limit = limit;
			return this;
		})
	}, {
		key: 'skip',
		value: (function (_skip) {
			function skip(_x6) {
				return _skip.apply(this, arguments);
			}

			skip.toString = function () {
				return _skip.toString();
			};

			return skip;
		})(function (skip) {
			this._skip = skip;
			return this;
		})
	}, {
		key: 'from',
		value: function from(value) {
			this._from = value;
			return this;
		}
	}, {
		key: 'to',
		value: function to(value) {
			this._to = value;
			return this;
		}
	}, {
		key: 'fetchPlan',
		value: function fetchPlan(value) {
			this._fetchPlan = value;
			return this;
		}
	}, {
		key: 'return',
		value: function _return(value) {
			this._return = value;
			return this;
		}
	}, {
		key: 'sort',
		value: (function (_sort) {
			function sort(_x7) {
				return _sort.apply(this, arguments);
			}

			sort.toString = function () {
				return _sort.toString();
			};

			return sort;
		})(function (sort) {
			if (typeof sort === 'string') {
				var order = {};

				var parts = sort.split(' ');
				parts.forEach(function (part) {
					var direction = 1;
					if (part[0] === '-') {
						part = part.substr(1);
						direction = -1;
					}

					order[part] = direction;
				});

				sort = order;
			}

			this._sort = sort;
			return this;
		})
	}, {
		key: 'create',

		/**
  update(doc, [callback])
  */
		value: function create(doc, callback) {
			if (typeof doc === 'function') {
				callback = doc;
				doc = {};
			}

			return this.operation(Operation.INSERT).set(doc).first(true).condExec(callback);
		}
	}, {
		key: 'options',
		value: (function (_options) {
			function options(_x8) {
				return _options.apply(this, arguments);
			}

			options.toString = function () {
				return _options.toString();
			};

			return options;
		})(function (options) {
			options = options || {};

			if (options.multi) {
				options.limit = null;
			}

			if (options['new']) {
				options['return'] = 'AFTER @this';
			}

			if (typeof options.fetchPlan !== 'undefined') {
				this.fetchPlan(options.fetchPlan);
			}

			if (typeof options['return'] !== 'undefined') {
				this['return'](options['return']);
			}

			if (typeof options.limit !== 'undefined') {
				this.limit(options.limit);
			}

			if (typeof options.scalar !== 'undefined') {
				this.scalar(options.scalar);
			}

			return this;
		})
	}, {
		key: 'update',

		/**
  update(conditions, update, [options], [callback])
  */
		value: function update(conditions, doc, options, callback) {
			if (typeof options === 'function') {
				callback = options;
				options = {};
			}

			if (typeof conditions === 'undefined' || typeof doc === 'undefined') {
				throw new Error('One of parameters is missing');
			}

			var defaultOptions = {
				scalar: true,
				limit: 1
			};

			options = _extend2['default']({}, defaultOptions, options || {});

			return this.operation(Operation.UPDATE).options(options).set(doc).condExec(conditions, callback);
		}
	}, {
		key: 'find',

		//find([conditions], [callback])
		value: function find(conditions, callback) {
			return this.operation(Operation.SELECT).condExec(conditions, callback);
		}
	}, {
		key: 'findOne',

		//findOne([criteria], [callback])
		value: function findOne(conditions, callback) {
			return this.operation(Operation.SELECT).limit(1).first(true).condExec(conditions, callback);
		}
	}, {
		key: 'remove',

		//remove([conditions], [callback])
		value: function remove(conditions, callback) {
			return this.operation(Operation.DELETE).scalar(true).condExec(conditions, callback);
		}
	}, {
		key: 'exec',
		value: function exec(callback) {
			throw new Error('Override exec method for query');
		}
	}]);

	return Query;
})();

exports['default'] = Query;
;

Query.Operation = Operation;
module.exports = exports['default'];