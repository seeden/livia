import Type from './type';

export default class BooleanType extends Type {
	_serialize(value) {
		if(typeof value === 'string') {
			value = value.toLowerCase();
			if(value==='true' || value==='yes' || value==='1') {
				return true;
			} 
			
			return false;
		}

		return Boolean(value);
	}

	_deserialize(value) {
		return value;
	}

	static toString() {
		return 'Boolean';
	}	

	static getDbType(options) {
		return 'BOOLEAN';
	}
}