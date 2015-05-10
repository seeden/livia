import Type from './Type';

export default class MixedType extends Type {
	_serialize(value) {
		return value;
	}

	_deserialize(value) {
		return value;
	}

	static toString() {
		return 'Mixed';
	}	

	static getDbType() {
		return void 0;
	}
}