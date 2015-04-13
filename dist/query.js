"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var OrientoQuery = _interopRequire(require("oriento/lib/db/query"));

var debug = _interopRequire(require("debug"));

var _ = _interopRequire(require("lodash"));

var Document = _interopRequire(require("./document"));

var GraphSchema = _interopRequire(require("./schemas/graph"));

var EdgeSchema = _interopRequire(require("./schemas/edge"));

var LogicOperators = _interopRequire(require("./constants/logicoperators"));

var ComparisonOperators = _interopRequire(require("./constants/comparisonoperators"));

var extend = _interopRequire(require("node.extend"));

var log = debug("orientose:query");

var Operation = {
	DELETE: "DELETE",
	UPDATE: "UPDATE",
	SELECT: "SELECT",
	INSERT: "INSERT"
};

var Operator = {
	OR: "or",
	AND: "and",
	WHERE: "where"
};

var Query = (function () {
	function Query(model, options) {
		_classCallCheck(this, Query);

		options = options || {};

		if (!model) {
			throw new Error("Model is not defined");
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

	_createClass(Query, {
		model: {
			get: function () {
				return this._model;
			}
		},
		schema: {
			get: function () {
				return this.model.schema;
			}
		},
		paramify: {
			value: function paramify(key) {
				return key.replace(/([^A-Za-z0-9])/g, "");
			}
		},
		nextParamName: {
			value: function nextParamName(propertyName) {
				return this.paramify(propertyName) + "_op_" + this._paramIndex++;
			}
		},
		addParam: {
			value: function addParam(paramName, value) {
				this._params[paramName] = value;
			}
		},
		addParams: {
			value: function addParams(params) {
				params = params || {};
				extend(this._params, params);
			}
		},
		createComparisonQuery: {
			value: function createComparisonQuery(propertyName, operator, value) {
				var paramName = this.nextParamName(propertyName);

				if (value === null) {
					if (operator === "=") {
						return propertyName + " IS NULL";
					} else if (operator === "!=" || operator === "<>" || operator === "NOT") {
						return propertyName + " IS NOT NULL";
					}
				}

				this.addParam(paramName, value);
				return propertyName + " " + operator + " :" + paramName;
			}
		},
		queryLanguage: {
			value: function queryLanguage(conditions) {
				var _this = this;

				var items = [];

				Object.keys(conditions).forEach(function (propertyName) {
					var value = conditions[propertyName];
					if (typeof value === "undefined") {
						return;
					}

					if (LogicOperators[propertyName]) {
						var subQueries = [];

						value.forEach(function (conditions) {
							var query = _this.queryLanguage(conditions);
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

						var query = "(" + subQueries.join(") " + LogicOperators[propertyName] + " (") + ")";
						return items.push(query);
					}

					if (value && value.toString) {
						value = value.toString();
					}

					if (!_.isObject(value)) {
						var query = _this.createComparisonQuery(propertyName, "=", value);
						return items.push(query);
					}

					Object.keys(value).forEach(function (operation) {
						var operationValue = value[operation];
						if (value && value.toString) {
							value = value.toString();
						}

						var query = null;
						if (ComparisonOperators[operation]) {
							query = _this.createComparisonQuery(propertyName, ComparisonOperators[operation], operationValue);
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

				return items.join(" AND ");
			}
		},
		operator: {
			value: (function (_operator) {
				var _operatorWrapper = function operator(_x, _x2, _x3) {
					return _operator.apply(this, arguments);
				};

				_operatorWrapper.toString = function () {
					return _operator.toString();
				};

				return _operatorWrapper;
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
		},
		condExec: {
			value: function condExec(conditions, callback) {
				if (typeof conditions === "function") {
					callback = conditions;
					conditions = void 0;
				}

				if (typeof conditions === "string") {
					this._target = conditions;
					conditions = void 0;
				}

				if (_.isObject(conditions)) {
					if (conditions instanceof Document) {
						this._target = conditions;
						conditions = void 0;
					} else if (conditions && conditions.toString) {
						this._target = conditions.toString();
						conditions = void 0;
					} else {
						this.where(conditions);
					}
				}

				return callback ? this.exec(callback) : this;
			}
		},
		or: {
			value: function or(conditions) {
				var self = this;
				conditions.forEach(function (condition) {
					self = self.operator(Operator.OR, condition);
				});
				return self;
			}
		},
		and: {
			value: function and(conditions) {
				var self = this;
				conditions.forEach(function (condition) {
					self = self.operator(Operator.AND, condition);
				});
				return self;
			}
		},
		where: {
			value: function where(conditions, callback) {
				conditions = conditions || {};
				this.operator(Operator.WHERE, conditions);

				return this.condExec(callback);
			}
		},
		operation: {
			value: (function (_operation) {
				var _operationWrapper = function operation(_x4) {
					return _operation.apply(this, arguments);
				};

				_operationWrapper.toString = function () {
					return _operation.toString();
				};

				return _operationWrapper;
			})(function (operation) {
				if (this._operation && this._operation !== operation) {
					throw new Error("Operation is already set");
				}
				this._operation = operation;
				return this;
			})
		},
		set: {
			value: function set(doc) {
				this._set = doc;
				return this;
			}
		},
		first: {
			value: function first(useFirst) {
				this._first = !!useFirst;
				return this;
			}
		},
		scalar: {
			value: function scalar(useScalar) {
				this._scalar = !!useScalar;
				return this;
			}
		},
		limit: {
			value: (function (_limit) {
				var _limitWrapper = function limit(_x5) {
					return _limit.apply(this, arguments);
				};

				_limitWrapper.toString = function () {
					return _limit.toString();
				};

				return _limitWrapper;
			})(function (limit) {
				this._limit = limit;
				return this;
			})
		},
		skip: {
			value: (function (_skip) {
				var _skipWrapper = function skip(_x6) {
					return _skip.apply(this, arguments);
				};

				_skipWrapper.toString = function () {
					return _skip.toString();
				};

				return _skipWrapper;
			})(function (skip) {
				this._skip = skip;
				return this;
			})
		},
		from: {
			value: function from(value) {
				this._from = value;
				return this;
			}
		},
		to: {
			value: function to(value) {
				this._to = value;
				return this;
			}
		},
		fetchPlan: {
			value: function fetchPlan(value) {
				this._fetchPlan = value;
				return this;
			}
		},
		"return": {
			value: function _return(value) {
				this._return = value;
				return this;
			}
		},
		sort: {
			value: (function (_sort) {
				var _sortWrapper = function sort(_x7) {
					return _sort.apply(this, arguments);
				};

				_sortWrapper.toString = function () {
					return _sort.toString();
				};

				return _sortWrapper;
			})(function (sort) {
				if (typeof sort === "string") {
					var order = {};

					var parts = sort.split(" ");
					parts.forEach(function (part) {
						var direction = 1;
						if (part[0] === "-") {
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
		},
		create: {
			/**
   update(doc, [callback])
   */

			value: function create(doc, callback) {
				if (typeof doc === "function") {
					callback = doc;
					doc = {};
				}

				return this.operation(Operation.INSERT).set(doc).first(true).condExec(callback);
			}
		},
		options: {
			value: (function (_options) {
				var _optionsWrapper = function options(_x8) {
					return _options.apply(this, arguments);
				};

				_optionsWrapper.toString = function () {
					return _options.toString();
				};

				return _optionsWrapper;
			})(function (options) {
				options = options || {};

				if (options.multi) {
					options.limit = null;
				}

				if (options["new"]) {
					options["return"] = "AFTER @this";
				}

				if (typeof options.fetchPlan !== "undefined") {
					this.fetchPlan(options.fetchPlan);
				}

				if (typeof options["return"] !== "undefined") {
					this["return"](options["return"]);
				}

				if (typeof options.limit !== "undefined") {
					this.limit(options.limit);
				}

				if (typeof options.scalar !== "undefined") {
					this.scalar(options.scalar);
				}

				return this;
			})
		},
		update: {

			/**
   update(conditions, update, [options], [callback])
   */

			value: function update(conditions, doc, options, callback) {
				if (typeof options === "function") {
					callback = options;
					options = {};
				}

				if (typeof conditions === "undefined" || typeof doc === "undefined") {
					throw new Error("One of parameters is missing");
				}

				var defaultOptions = {
					scalar: true,
					limit: 1
				};

				options = extend({}, defaultOptions, options || {});

				return this.operation(Operation.UPDATE).options(options).set(doc).condExec(conditions, callback);
			}
		},
		find: {

			//find([conditions], [callback])

			value: function find(conditions, callback) {
				return this.operation(Operation.SELECT).condExec(conditions, callback);
			}
		},
		findOne: {

			//findOne([criteria], [callback])

			value: function findOne(conditions, callback) {
				return this.operation(Operation.SELECT).limit(1).first(true).condExec(conditions, callback);
			}
		},
		remove: {

			//remove([conditions], [callback])

			value: function remove(conditions, callback) {
				return this.operation(Operation.DELETE).scalar(true).condExec(conditions, callback);
			}
		},
		exec: {
			value: function exec(callback) {
				throw new Error("Override exec method for query");
			}
		}
	});

	return Query;
})();

module.exports = Query;