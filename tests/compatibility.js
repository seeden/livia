import should from "should";
import Orientose from '../src/orientose';
import Schema from '../src/schemas';
import mongoose, {Schema as SchemaMongoose} from 'mongoose';
import {waterfall} from "async";
import extend from "node.extend";


describe('Mongoose compatibility', function() {
	var schema = null;
	var schemaMongoose = null;

	var basicSchema = {
		name   : { type: String, default: 'Zlatko' },
		images : [{
			title: { type: String, default: 'MyImage' }
		}],
		tags   : [String],
		address: {
			city: { type: String, default: 'Kosice' }
		},
		empty: {
			type: {}
		},
		imagesEmpty: [{}]
	};

	var changedSchema = {
		imagesEmpty: [{
			size: { type : String }
		}]

	};

	var subSchema = {
		item: { type: String, default: '123456' }
	};

	function applyVirtual(schema) {
		schema.virtual('niceName').get(function() {
			return 'Mr. ' + this.name;
		});
	}

	function validateBasicSchema(schema) {
		var name = schema.path('name');
		name.should.not.have.property('schema');
		name.should.have.property('path');
		name.path.should.equal('name');
		should.deepEqual(name.options, basicSchema.name);

		var tags = schema.path('tags');
		should(tags).not.equal(undefined);

		var images = schema.path('images');
		images.should.have.property('schema');
		images.should.have.property('path');
		images.path.should.equal('images');
		images.should.have.property('options');
		images.options.should.have.property('type');
		images.options.type.should.be.a.Array;

		var title = schema.path('images.title');
		should(title).equal(undefined);

		var address = schema.path('address');
		should(address).equal(undefined);

		var empty = schema.path('empty');
		should.deepEqual(empty.options, basicSchema.empty);

		var imagesEmpty = schema.path('imagesEmpty');
		should.deepEqual(imagesEmpty.options.type, basicSchema.imagesEmpty);


		var city = schema.path('address.city');
		city.should.not.have.property('schema');
		city.should.have.property('path');
		city.path.should.equal('address.city');
		should.deepEqual(city.options, basicSchema.address.city);
	}

	function validateChangedSchema(schema) {
		var name = schema.path('name');
		name.should.not.have.property('schema');
		name.should.have.property('path');
		name.path.should.equal('name');
		should.deepEqual(name.options, basicSchema.name);

		var tags = schema.path('tags');
		should(tags).not.equal(undefined);

		var images = schema.path('images');
		images.should.have.property('schema');
		images.should.have.property('path');
		images.path.should.equal('images');
		images.should.have.property('options');
		images.options.should.have.property('type');
		images.options.type.should.be.a.Array;

		var title = schema.path('images.title');
		should(title).equal(undefined);

		var address = schema.path('address');
		should(address).equal(undefined);

		var empty = schema.path('empty');
		should.deepEqual(empty.options, basicSchema.empty);

		var imagesEmpty = schema.path('imagesEmpty');
		should.deepEqual(imagesEmpty.options.type, changedSchema.imagesEmpty);


		var city = schema.path('address.city');
		city.should.not.have.property('schema');
		city.should.have.property('path');
		city.path.should.equal('address.city');
		should.deepEqual(city.options, basicSchema.address.city);
	}	

	it('should be able to create simple orientose schema', function() {
		schema = new Schema(extend(true, {}, basicSchema, {
			sub: [new Schema(subSchema)]
		}));
		applyVirtual(schema);
		validateBasicSchema(schema);
	});

	it('should be able to create simple mongoose schema', function() {
		schemaMongoose = new SchemaMongoose(extend(true, {}, basicSchema, {
			sub: [new SchemaMongoose(subSchema)]
		}));
		applyVirtual(schemaMongoose);
		validateBasicSchema(schemaMongoose);
	});	

	it('should be able to traverse each path', function() {
		var pathsMongoose = [];
		var paths = [];

		schemaMongoose.eachPath(function(path, config) {
			pathsMongoose.push(path);
		});

		schema.eachPath(function(path, config) {
			paths.push(path);
		});


		pathsMongoose.should.containDeep(['name', 'images', 'address.city', 'tags', 'sub']);
		paths.should.containDeep(['name', 'images', 'address.city', 'tags', 'sub']);

		pathsMongoose.should.not.containDeep(['images.title']);
		paths.should.not.containDeep(['images.title']);
	});	

	it('should be able to set new options for path', function() {
		var pathsMongoose = [];
		var paths = [];

		schemaMongoose.path('imagesEmpty', changedSchema.imagesEmpty);

		schema.path('imagesEmpty', changedSchema.imagesEmpty);

		validateChangedSchema(schemaMongoose);
		validateChangedSchema(schema);
	});			
});	
