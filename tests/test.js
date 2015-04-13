import should from "should";
import Orientose, {Schema} from '../src/orientose';
import {waterfall} from "async";

var connection = null;

describe('Schema', function() {
	var schema = null;

	it('should be able to create simple schema', function() {
		schema = new Schema({
			name: { type: String }
		});
	});

	it('should be able to create data class', function() {
		var data = new schema.DataClass({});
		data.name = 'Zlatko Fedor';

		data.name.should.equal('Zlatko Fedor');
	});
});	

describe('Connection', function() {
	var schema = null;
	var User = null;

	it('should be able to create a simple schema', function() {
		schema = new Schema({
			name    : { type: String, required: true, index: true },
			isAdmin : { type: Boolean, default: false, readonly: true },
			points  : { type: Number, default: 30, notNull: true, min: 0, max: 99999 },
			hooked  : { type: String },
			address : {
				city   : { type: String, default: 'Kosice' },
				street : { type: String }
			},
			tags    : [String]
		});

		schema.pre('save', function(done) {
			this.hooked = 'Hooked text';
			this.tags.push('Test');
			done();
		});

		schema.virtual('niceName').get(function() {
			return 'Mr. ' + this.name;
		});

		schema.methods.getFormatedPoints = function() {
			return 'Points: ' + this.points;
		};

		schema.statics.getStaticValue = function() {
			return 'Static value';
		};

		var nameOptions = schema.getPath('name');
		nameOptions.type.should.equal(String);
		nameOptions.options.required.should.equal(true);
		nameOptions.options.index.should.equal(true);

		var cityOptions = schema.getPath('address.city');
		cityOptions.type.should.equal(String);
		cityOptions.options.default.should.equal('Kosice');

		var tagsOptions = schema.getPath('tags');
		Array.isArray(tagsOptions.type).should.equal(true);

		schema.setPath('address.zip', {
			type: Number,
			default: null
		});

		var zipOptions = schema.getPath('address.zip');
		zipOptions.type.should.equal(Number);
		should(zipOptions.options.default).equal(null);
	});

	it('should be able to create a connection', function() {
		connection = new Orientose({
			host: 'localhost',
    		port: 2424,
    		username: 'root',
    		password: 'hello'
		}, 'GratefulDeadConcerts');
	});	

	it('should be able to create a model', function(done) {
		connection.model('User', schema, function(err, UserModel) {
			if(err) {
				throw err;
			}

			User = UserModel;
			User.getStaticValue().should.equal('Static value');

			done();
		});
	});

	var rid = null;

	it('should be able to create a document', function(done) {
		var user1 = new User({
			name: 'Zlatko Fedor',
			address: {
				street: 'Huskova 19'
			}
		});

		user1.name.should.equal('Zlatko Fedor');
		user1.isAdmin.should.equal(false);
		user1.points.should.equal(30);
		user1.niceName.should.equal('Mr. Zlatko Fedor');

		user1.getFormatedPoints().should.equal('Points: 30');

		user1.isNew.should.equal(true);


		user1.save(function(err, userSaved) {
			if(err) {
				throw err;
			}

			userSaved.hooked.should.equal('Hooked text');

			rid = userSaved.rid;
			done();
		});
	});	


	it('should be able to find a document', function(done) {
		User.findOne(rid, function(err, user) {
			if(err) {
				throw err;
			}

			user.name.should.equal('Zlatko Fedor');
			user.isAdmin.should.equal(false);
			user.points.should.equal(30);
			user.niceName.should.equal('Mr. Zlatko Fedor');
			user.hooked.should.equal('Hooked text');
			user.rid.toString().should.equal(rid.toString());

			user.address.street.should.equal('Huskova 19');
			user.address.city.should.equal('Kosice');

			done();
		});
	});	

	it('should be able to use toJSON', function(done) {
		User.findOne(rid, function(err, user) {
			if(err) {
				throw err;
			}

			var json = user.toJSON({
				virtuals: true
			});

			json.name.should.equal('Zlatko Fedor');
			json.isAdmin.should.equal(false);
			json.points.should.equal(30);
			json.niceName.should.equal('Mr. Zlatko Fedor');
			json.hooked.should.equal('Hooked text');
			json.tags.length.should.equal(1);

			json.address.street.should.equal('Huskova 19');
			json.address.city.should.equal('Kosice');

			done();
		});
	});	

	it('should be able to set properties by path', function(done) {
		User.findOne(rid, function(err, user) {
			if(err) {
				throw err;
			}

			user.set({
				'address.street': 'Svabska',
				points: 45,
				address: {
					city: 'Presov'
				}
			});

			user.points.should.equal(45);
			user.address.street.should.equal('Svabska');
			user.address.city.should.equal('Presov');

			user.get('points').should.equal(45);
			user.get('address.street').should.equal('Svabska');

			done();
		});
	});		

	it('should be able to remove a document', function(done) {
		User.remove(rid, function(err, total) {
			if(err) {
				throw err;
			}
			
			total.should.equal(1);

			done();
		});
	});	

	it('should be able to get User model', function(done) {
		var UserModel = connection.model('User');
		UserModel.should.equal(User);
		done();
	});	
});	

describe('V', function() {	
	it('should be able to create model Person extended from V', function(done) {
		var personSchema = new Schema.V({
			name: { type: String }
		});

		var Person = connection.model('Person', personSchema, function(err) {
			if(err) {
				throw err;
			}

			done();
		});
	});	

	it('should be able to create document1', function(done) {
		var Person = connection.model('Person');

		new Person({
			name: 'Zlatko Fedor'
		}).save(function(err, person) {
			if(err) {
				throw err;
			}	

			done();
		});
	});	

	it('should be able to create document2', function(done) {
		var Person = connection.model('Person');

		new Person({
			name: 'Luca'
		}).save(function(err, person) {
			if(err) {
				throw err;
			}	

			done();
		});
	});	
});	

describe('E', function() {	
	it('should be able to create edge model extended from E', function(done) {
		var followSchema = new Schema.E({
			when: { type: Date, default: Date.now, required: true }
		}, {
			unique: true
		});

		var Follow = connection.model('Follow', followSchema, function(err) {
			if(err) {
				throw err;
			}
			done();
		});
	});	

	var edge = null;
	var p1 = null;
	var p2 = null;

	it('should be able to create edge beetwean two person', function(done) {
		var Follow = connection.model('Follow');
		var Person = connection.model('Person');


		waterfall([
			function(callback) {
				Person.findOne({
					name: 'Zlatko Fedor'
				}, callback);
			},
			function(person1, callback) {
				p1 = person1;

				Person.findOne({
					name: 'Luca'
				}, function(err, person2) {
					if(err) {
						return callback(err);
					}

					p2 = person2;

					callback(null, person1, person2);
				});
			},
			function(p1, p2, callback) {
			
				new Follow({
				}).from(p1).to(p2).save(function(err, follow) {
					if(err) {
						return callback(err);
					}

					edge = follow;


					callback(null);
				});
			}
		], function(err) {
			if(err) {
				throw err;
			}

			done();
		});
	});	

	it('should be able to remove edge', function(done) {
		edge.remove(function(err, total) {
			if(err) {
				throw err;
			}

			total.should.equal(1);

			done();
		});
	});	

	it('should be able to remove vertex p1', function(done) {
		p1.remove(function(err, total) {
			if(err) {
				throw err;
			}

			total.should.equal(1);

			done();
		});
	});	

	it('should be able to remove vertex p2', function(done) {
		p2.remove(function(err, total) {
			if(err) {
				throw err;
			}

			total.should.equal(1);

			done();
		});
	});			
});
