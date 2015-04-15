import {EventEmitter} from 'events';
import _ from 'lodash';

import Type from '../types/index';
import Document from '../Document';

export default class SchemaBase extends EventEmitter {
	constructor(options) {
		super();

		this._props    = {};
		this._options  = options || {};
	}

	get options() {
		return this._options;
	}

	convertType(type) {
		if(!type) {
			throw new Error('Type is not defined');
		} else if(type.isSchemaType) {
			return type;
		} else if(type instanceof SchemaBase) {
			return Type.Object;
		} else if(type.isDocumentClass) {
			return Type.Linked;
		} else if(_.isArray(type)) {
			return Type.Array;
		} else if(type === String) {
			return Type.String;
		} else if(type === Number) {
			return Type.Number;
		} else if(type === Boolean) {
			return Type.Boolean;
		} else if(type === Date) {
			return Type.Date;
		}

		throw new Error('Unrecognized type');
	}	
}