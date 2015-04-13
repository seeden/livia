import Type from './type';

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

	static getDbType(options) {
		return void 0;
	}
}