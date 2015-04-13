export default class Adapter {
	ensureClass(model, callback) {
		throw new Error('Please override ensureClass method');
	}

	query (model, options) {
		throw new Error('Please override query method');
		return new Query(model, options);
	}	
}