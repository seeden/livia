import OrientoQuery from 'oriento/lib/db/query';
import debug from 'debug';
import _ from 'lodash';
import extend from 'node.extend';
import Document from './Document';
import GraphSchema from './schemas/Graph';
import EdgeSchema from './schemas/Edge';
import LogicOperators from './constants/LogicOperators';
import ComparisonOperators from './constants/ComparisonOperators';

const log = debug('orientose:query');

const Operation = {
	DELETE : 'DELETE',
	UPDATE : 'UPDATE',
	SELECT : 'SELECT',
	INSERT : 'INSERT'
};

const Operator = {
	OR: 'or',
	AND: 'and',
	WHERE : 'where'
};

export default class Query {
	constructor(model, options) {
		options = options || {};

		if(!model) {
			throw new Error('Model is not defined');
		}

		this._paramIndex = 1;

		this._model     = model;
		this._target    = model.name;

		this._first     = false;
		this._scalar    = false;

		this._limit     = null;
		this._skip      = null;
		this._sort      = null;
		this._fetchPlan = null;
		this._return    = null;

		this._from      = null;
		this._to        = null;

		this._operation = null;

		this._params    = {};

		this._operators = [];
		this._set    = null;
	}

	get model() {
		return this._model;
	}

	get schema() {
		return this.model.schema;
	}

	paramify (key) {
  		return key.replace(/([^A-Za-z0-9])/g, '');
	}

	nextParamName(propertyName) {
		return this.paramify(propertyName)+'_op_'+this._paramIndex++;
	}

	addParam(paramName, value) {
		this._params[paramName] = value;
	}

	addParams(params) {
		params = params || {};
		extend(this._params, params);
	}

	createComparisonQuery(propertyName, operator, value) {
		var paramName = this.nextParamName(propertyName);

		if(value === null) {
			if(operator === '=') {
				return propertyName + ' IS NULL';
			} else if(operator === '!=' || operator === '<>' || operator === 'NOT') {
				return propertyName + ' IS NOT NULL';
			}
		}

		this.addParam(paramName, value);
		return propertyName + ' ' + operator + ' :' + paramName;		
	}

	queryLanguage(conditions) {
		var items = [];

		Object.keys(conditions).forEach(propertyName => {
			var value = conditions[propertyName];
			if(typeof value === 'undefined') {
				return;
			}

			if(LogicOperators[propertyName]) {
				var subQueries = [];
				
				value.forEach(conditions => {
					var query = this.queryLanguage(conditions);
					if(!query) {
						return;
					}

					subQueries.push(query);
				});

				if(!subQueries.length) {
					return;
				} else if(subQueries.length === 1) {
					return items.push(subQueries[0]);
				}

				var query = '(' + subQueries.join(') ' + LogicOperators[propertyName] + ' (') + ')';
				return items.push(query);
			}

			if(value && value.toString && !_.isPlainObject(value)) {
				value = value.toString();
			}

			if(!_.isObject(value)) {
				var query = this.createComparisonQuery(propertyName, '=', value);
				return items.push(query);
			}

			Object.keys(value).forEach(operation => {
				var operationValue = value[operation];
				if(operationValue && operationValue.toString && !_.isPlainObject(operationValue)) {
					operationValue = operationValue.toString();
				}

				var query = null;
				if(ComparisonOperators[operation]) {
					query = this.createComparisonQuery(propertyName, 
						ComparisonOperators[operation], operationValue);
				}

				if(!query) {
					return;
				}

				items.push(query);
				
			});
		});

		if(!items.length) {
			return null;
		}

		return items.join(' AND ');
	}

	operator(operator, conditions, callback) {
		var query = this.queryLanguage(conditions);

		if(!query) {
			return this;
		}

		this._operators.push({
			type: operator,
			query: query
		});

		return this;
	}

	condExec(conditions, callback) {
		if(typeof conditions === 'function') {
			callback = conditions;
			conditions = void 0;
		}	

		if(typeof conditions === 'string') {
			this._target = conditions;
			conditions = void 0;
		}

		if(_.isObject(conditions)) {
			if(conditions instanceof Document) {
				this._target = conditions;
				conditions = void 0;
			} else if(conditions && !_.isPlainObject(conditions)) {
				this._target = conditions;
				conditions = void 0;
			} else {
				this.where(conditions);
			}
		}
		
		return callback ? this.exec(callback) : this;
	}

	or(conditions) {
		var self = this;
		conditions.forEach(function(condition) {
			self = self.operator(Operator.OR, condition);
		});
		return self;
	}

	and(conditions) {
		var self = this;
		conditions.forEach(function(condition) {
			self = self.operator(Operator.AND, condition);
		});
		return self;
	}	

	where(conditions, callback) {
		conditions = conditions || {};
		this.operator(Operator.WHERE, conditions);

		return this.condExec(callback);
	}

	operation(operation) {
		if(this._operation && this._operation !== operation) {
			throw new Error('Operation is already set');
		}
		this._operation = operation;
		return this;
	}

	set(doc) {
		this._set = doc;
		return this;	
	}

	first(useFirst) {
		this._first = !!useFirst;
		return this;
	}

	scalar(useScalar) {
		this._scalar = !!useScalar;
		return this;
	}

	limit(limit) {
		this._limit = limit;
		return this;
	}	

	skip(skip) {
		this._skip = skip;
		return this;
	}

	from(value) {
		this._from = value;
		return this;
	}

	to(value) {
		this._to = value;
		return this;
	}	

	fetchPlan(value) {
		this._fetchPlan = value;
		return this;
	}

	return(value) {
		this._return = value;
		return this;
	}	

	sort(sort) {
		if(typeof sort === 'string') {
			var order = {};

			var parts = sort.split(' ');
			parts.forEach(function(part) {
				var direction = 1;
				if(part[0] === '-') {
					part = part.substr(1);
					direction = -1;
				}

				order[part] = direction;
			});

			sort = order;
		}

		this._sort = sort;
		return this;
	}
	/**
	update(doc, [callback])
	*/
	create(doc, callback) {
		if(typeof doc === 'function') {
			callback = doc;
			doc = {};
		}

		return this
			.operation(Operation.INSERT)
			.set(doc)
			.first(true)
			.condExec(callback);
	}

	options(options) {
		options = options || {};

		if(options.multi) {
			options.limit = null;
		}

		if(options.new) {
			options.return = 'AFTER @this';
		}		

		if(typeof options.fetchPlan !== 'undefined') {
			this.fetchPlan(options.fetchPlan);
		}

		if(typeof options.return !== 'undefined') {
			this.return(options.return);
		}		

		if(typeof options.limit !== 'undefined') {
			this.limit(options.limit);
		}

		if(typeof options.scalar !== 'undefined') {
			this.scalar(options.scalar);
		}		

		return this;
	}

	/**
	update(conditions, update, [options], [callback])
	*/
	update(conditions, doc, options, callback) {
		if(typeof options === 'function') {
			callback = options;
			options = {};
		}

		if(typeof conditions === 'undefined' || typeof doc === 'undefined') {
			throw new Error('One of parameters is missing');
		}

		const defaultOptions = {
			scalar: true,
			limit: 1
		};

		options = extend({}, defaultOptions, options || {});

		return this
			.operation(Operation.UPDATE)
			.options(options)
			.set(doc)
			.condExec(conditions, callback);
	}	

	//find([conditions], [callback])
	find(conditions, callback) {
		return this
			.operation(Operation.SELECT)
			.condExec(conditions, callback);
	}

	//findOne([criteria], [callback])
	findOne(conditions, callback) {
		return this
			.operation(Operation.SELECT)
			.limit(1)
			.first(true)
			.condExec(conditions, callback);	
	}	

	//remove([conditions], [callback])
	remove(conditions, callback) {
		return this
			.operation(Operation.DELETE)
			.scalar(true)
			.condExec(conditions, callback);
	}

	exec(callback) {
		throw new Error('Override exec method for query');
	}		
};

Query.Operation = Operation;