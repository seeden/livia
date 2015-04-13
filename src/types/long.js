import Type from './type';
import _ from 'lodash';

/*
	Javascript long has support for 53bits only
*/

export default class LongType extends Type {
	_serialize(value) {
		return String(value);
	}

	_deserialize(value) {
		return value;
	}

	static toString() {
		return 'Long';
	}

	static getDbType(options) {
		return 'LONG';
	}
}