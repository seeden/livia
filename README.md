# Orientose

Orientose is a OrientDB object modeling with support of schemas inspired by mongoose. Some features of mongoose are used in simplified way. Orientose will create database structure for you automatically from your schema. 


## Features
 * Default values
 * Virtual computed properties
 * Define schemas
 * Extended validation (sync, async)
 * Pre/post hooks for save, update, remove
 * Create db structure and indexes from your schema automatically
 * Plugins like in mongoose

### TR|TD
Right know we have support only for schema-full. 

## Running Tests

```sh
npm test
```

## Usage

### Create Connection

```js
var Orientose = require('orientose');
var Schema = Orientose.Schema;

var connection = new Orientose({
	host: 'localhost',
	port: 2424,
	username: 'root',
	password: 'yourpassword'
}, 'mydb'); 
```


### Create Schema

```js
var Orientose = require('orientose');
var Schema = Orientose.Schema;
var geojson = require('orientose-geojson');

var schema = new Schema({
	name: { type: String, required: true, index: true, text: true },
	isAdmin : { type: Boolean, default: false, readonly: true },
	points  : { type: Number, default: 30, notNull: true, min: 0, max: 99999 },
	address : {
		city   : { type: String },
		street : { type: String } 
	},
	tags    : [String]
});

schema.virtual('niceName').get(function() {
	return 'Cool ' + this.name;
});

schema.pre('save', function(done) {
	this.address.city = 'Kosice';
	this.tags.push('admin', 'people');
	done();
});

schema.index({ tags: 1 }, { unique: true} );

schema.plugin(geojson);
```

### Create Model

```js
var User = connection.model('User', schema);
```

### Create Document from Model

```js
User.create({
	name: 'Peter Max'
}, function(err, user) {
	if(err) {
		return console.log(err.message);
	}

	user.name.should.equal('Peter Max');
	user.niceName.should.equal('Cool Peter Max');
	user.address.city.should.equal('Kosice'); //there is a pre save hook
	user.tags.length.should.equal(2); //there is a pre save hook
});
```

Alternative way with instance of document

```js
var user = new User({
	name: 'Peter Max'
});

user.points = 45;

user.save(function(err, user) {
	if(err) {
		return console.log(err.message);
	}

	user.name.should.equal('Peter Max');
	user.points.should.equal(45);
});
```

### Create Vertex model

```js
var Orientose = require('orientose');
var Schema = Orientose.Schema;

var personSchema = new Schema.V({
	name    : { type: String },
	address : {
		city   : { type: String },
		street : { type: String }
	}
});

var Person = connection.model('Person', personSchema);
```

### Create Edge model

```js
var Orientose = require('orientose');
var Schema = Orientose.Schema;

var followSchema = new Schema.E({
	when: { type: Date, default: Date.now, required: true }
}, {
	unique: true //unique index for properties in/out
});

var Follow = connection.model('Follow', followSchema);
```

### Create edge
	
```js
var Person = connection.model('Person');
var Follow = connection.model('Follow');
var Orientose = require('orientose');
var Schema = Orientose.Schema;

var followSchema = new Schema.E({
	when: { type: Date, default: Date.now, required: true }
}, {
	unique: true //unique index for properties in/out
});

var Follow = connection.model('Follow', followSchema);
Person.findOne({ name: 'Zlatko Fedor'}, function(err, person1) {
	Person.findOne({ name: 'Luca'}, function(err, person2) {
		Follow.create({
			from: person1,
			to: person2
		}, function(err, follow) {
			console.log(follow.when);
		});
	});
});
```

### Properties
	
#### Set properties
You can use dot notation

```js
var Person = connection.model('Person');

Person.findOne({ name: 'Zlatko Fedor'}, function(err, person) {
	person.set({
		name: 'Luca',
		'address.city': 'Presov',
		address: {
			street: 'Svabska'
		}
	});

	person.name.should.equal('Luca');
	person.address.city.should.equal('Presov');
	person.address.street.should.equal('Svabska');
});
```

#### Model.findOne
Finds a single document.

```js
User.findOne({
	name: 'Zlatko Fedor'
}, function(err, user) {
	user.name.should.equal('Zlatko Fedor');
});	
```

#### Model.find
Finds multiple documents.

```js
User.find({
	name: 'Zlatko Fedor'
}, function(err, users) {
});	
```

#### Schema.add
Adds key path / schema type pairs to this schema.

```js
schema.add({
	name: { type: String }
});	
```

#### Schema.set(key, value)
Sets a schema option.

```js
schema.set('name', { type: String });	
```

#### Schema.get(key)
Gets a schema option.

```js
var options = schema.get('name');	
options.type.should.equal(String);
```

#### Schema.eachPath(fn)
Iterates the schemas paths similar to Array#forEach.

```js
schema.eachPath(function(path, config) {
	path.should.equal('name');
});
```

#### Schema.pre(method, callback)
Defines a pre hook for the document.

```js
schema.pre('save', function (next) {
	if (!this.name) this.name = 'Zlatko Fedor';
	next();
});
```

#### Schema.virtual(name, [options])
Creates a virtual type with the given name.

```js
schema.virtual('niceName').get(function () {
	return 'Mr. ' + this.name;
});
```

#### Schema.plugin(plugin, opts)
Registers a plugin for this schema.

```js
var plugin = require('your-plugin-name');

schema.plugin(plugin, {
	timeout: 3000
});
```

#### Schema.method(method, fn)
Adds an instance method to documents constructed from Models compiled from this schema.

```js
schema.method('addSomePoints', function(value, callback) {
	this.points += value;
	this.save(callback);
});

var User = connection.model('User', schema);
var user = new User();

user.addSomePoints();
```

#### Schema.static(name, fn)
Adds static "class" methods to Models compiled from this schema.

```js
schema.static('findByName', function(name, callback) {
	return this.find({ name: name }, callback);
});

var User = connection.model('User', schema);
User.findByName('Zlatko Fedor', function (err, user) {

});
```

#### Schema types
If you need to use other types from orient you can use Orientose.Type

```js
var Orientose = require('orientose');
var Schema = Orientose.Schema;

var schema = new Schema({
	count  : { type: Orientose.Type.Integer },
	count2 : { type: Orientose.Type.Long }
});	
```

		
## Credits

[Zlatko Fedor](http://github.com/seeden)

## License

The MIT License (MIT)

Copyright (c) 2015 Zlatko Fedor zlatkofedor@cherrysro.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.