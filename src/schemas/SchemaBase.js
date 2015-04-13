import {EventEmitter} from 'events';
import _ from 'lodash';

import Type from '../types/Type';
import StringType from '../types/String';
import NumberType from '../types/Number';
import BooleanType from '../types/Boolean';
import DateType from '../types/Date';
import ObjectType from '../types/Object';
import LinkedType from '../types/Linked';
import ArrayType from '../types/Array';

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
			return ObjectType;
		} else if(type.prototype && type.prototype.constructor && type.prototype.constructor.__proto__ === Document) {
			return LinkedType;
		} else if(_.isArray(type)) {
			return ArrayType;
		} else if(type === String) {
			return StringType;
		} else if(type === Number) {
			return NumberType;
		} else if(type === Boolean) {
			return BooleanType;
		} else if(type === Date) {
			return DateType;
		}

		throw new Error('Unrecognized type');
	}	
}