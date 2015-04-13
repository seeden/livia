import Type from './type';
import _ from 'lodash';

export default class IntegerType extends Type {
	_serialize(value) {
		var val = parseInt(value);
		if(_.isNaN(value)) {
			throw new Error('Value is NaN');
		}

		return val;
	}

	_deserialize(value) {
		return value;
	}

	static toString() {
		return 'Integer';
	}	

	static getDbType(options) {
		return 'INTEGER';
	}
}