import {EventEmitter} from 'events';

export default class SchemaBase extends EventEmitter {
	constructor(options) {
		super();

		this._props    = {};
		this._options  = options || {};
	}

	get options() {
		return this._options;
	}
}