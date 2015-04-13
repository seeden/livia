import { EventEmitter } from 'events';
import Model from './model';
import ReadyState from './constants/readystate';
import Query from './query';

export default class Connection extends EventEmitter {
	constructor (options) {
		super();

		options = options || {};

		this._options    = options;
		this._models     = new Map();
		this._readyState = ReadyState.DISCONNECTED;
	}

	get db () {
		throw new Error('Please override db getter');
	}

	ensureClass(model, callback) {
		throw new Error('Please override ensureClass method');
	}	

	query (model, options) {
		throw new Error('Please override query method');
		return new Query(model, options);
	}

	model (name, schema, options, callback) {
		if(typeof options === 'function') {
			callback = options;
			options = {};
		}

		options = options || {};
		callback = callback || function(){};

		if(typeof schema === 'undefined') {
			if(!this._models.has(name)) {
				throw new Error(`Model ${name} does not exists`);
			}

			return this._models.get(name).DocumentClass;
		}

		if(this._models.has(name)) {
			throw new Error('Model already exists');
		}

		this._models.set(name, new Model(name, schema, this, options, function(err, model) {
			if(err) {
				return callback(err);
			}

			callback(null, model.DocumentClass);
		}));

		return this._models.get(name).DocumentClass;
	}

	/*
	Returns an array of model names created on this connection.
	*/
	modelNames() {
		return this._models.keys();
	}

	get readyState() {
		return this._readyState;
	}
}