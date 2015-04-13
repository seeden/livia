import Type from './type';
import StringType from './string';
import NumberType from './number';
import BooleanType from './boolean';
import DateType from './date';
import ObjectType from './object';
import LinkedType from './linked';
import ArrayType from './array';
import ModelBase from '../modelbase';
import SchemaBase from '../schemas/schemabase';
import _ from 'lodash';
import Document from '../document';

export default function(type) {
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