import Type from './Type';

export default class NumberType extends Type {
	_serialize(value) {
		return Number(value);
	}

	_deserialize(value) {
		return value;
	}

	static toString() {
		return 'Number';
	}	

	static getDbType() {
		return 'DOUBLE';
	}
}