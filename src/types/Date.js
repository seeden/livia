import Type from './Type';
import _ from 'lodash';

export default class DateType extends Type {
	_serialize(value) {
		if(value instanceof Number || 'number' === typeof value || String(value) == Number(value)) {
			value = Number(value);
		}
		
		return new Date(value);
	}

	_deserialize(value) {
		return value;
	}

	toJSON(options) {
		return this.toObject();
	}

	toObject(options) {
		var value = this.value;
		return (value && value.getTime) 
			? value.getTime()
			: value;
	}	

	static toString() {
		return 'Date';
	}		

	static getDbType() {
		return 'DATETIME';
	}
}