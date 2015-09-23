import should from "should";
import Query from '../src/Query';
import { Schema, Model } from '../src';
import mongoose, { Schema as SchemaMongoose } from 'mongoose';
import { waterfall } from "async";
import extend from "node.extend";
import keymirror from 'keymirror';

const DBType = keymirror({
  LIVIA: null,
  MONGOOSE: null
});

const basicSchema = {
  name: { type: String, default: 'Zlatko' },
  images: [{
    _id: false,
    title: { type: String, default: 'MyImage' }
  }],
  tags: [String],
  address: {
    city: { type: String, default: 'Kosice' },
    street1: { type: String }
  },
  empty: {
    prop: { type: String }
  },
  emptyMixed: {
    type: {}
  },
  imagesEmpty: [{}],
  defaultArray: {
    type: [String],
    default: ['Orange', 'Red']
  }
};

let UserLivia = null;
let UserMongoose = null;

describe('Model Livia', function() {
  const schemaData = { ...basicSchema };

  it('should be able to create a model', function() {
    const UserModel = new Model('User', schemaData, {}, { ensure: false });
    UserLivia = UserModel.DocumentClass;
  });

  after(function() {
    objectCompatibility(UserLivia, DBType.LIVIA);
  });

  after(function() {
    arrayCompatibility(UserLivia, DBType.LIVIA);
  });

  after(function() {
    isModifiedCompatibility(UserLivia, DBType.LIVIA);
  });
});

describe('Model Mongoose', function() {
  const schemaData = { ...basicSchema };

  it('should be able to create a model', function() {
    UserMongoose = mongoose.model('User', basicSchema, { strict: false });
  });

  after(function() {
    objectCompatibility(UserMongoose, DBType.MONGOOSE);
  });

  after(function() {
    arrayCompatibility(UserMongoose, DBType.MONGOOSE);
  });

  after(function() {
    isModifiedCompatibility(UserMongoose, DBType.MONGOOSE);
  });
});

/*
const basicSchema = {
  name: { type: String, default: 'Zlatko' },
  images: [{
    _id: false,
    title: { type: String, default: 'MyImage' }
  }],
  tags: [String],
  address: {
    city: { type: String, default: 'Kosice' },
    street1: { type: String }
  },
  empty: {
    prop: { type: String }
  },
  emptyMixed: {
    type: {}
  },
  imagesEmpty: [{}],
  defaultArray: {
    type: [String],
    default: ['Orange', 'Red']
  }
};*/

function isModifiedCompatibility(User, name) {
  describe(`Object compatibility ${name}`, function() {
    let doc = null;

    it('should be able to use isModified for unmodified doc', function() {
      const doc = new User({});

      should(doc.isModified('name')).equal(false);
      should(doc.isModified('images')).equal(false);
      should(doc.isModified('tags')).equal(false);
      should(doc.isModified('address')).equal(false);
      should(doc.isModified('empty')).equal(false);
      should(doc.isModified('emptyMixed')).equal(false);
      should(doc.isModified('imagesEmpty')).equal(false);
      should(doc.isModified('defaultArray')).equal(false);

      should(doc.isModified()).equal(false);
    });

    it('should be able to use isModified for modified doc', function() {
      const doc = new User({
        name: 'Zlatko non default',
        images: [{
          title: 123
        }],
        tags: ['c', 'javascript'],
        address: {
          city: 'Kosice',
          street: 'Huskova'
        },
        empty: {
          prop: ''
        },
        emptyMixed: '8888',
        imagesEmpty: [123],
        defaultArray: ['Orange']
      });

      should(doc.isModified('name')).equal(true);
      should(doc.isModified('images')).equal(true);
      should(doc.isModified('tags')).equal(true);
      should(doc.isModified('address')).equal(true);
      should(doc.isModified('empty')).equal(true);
      should(doc.isModified('emptyMixed')).equal(true);
      should(doc.isModified('imagesEmpty')).equal(true);
      should(doc.isModified('defaultArray')).equal(true);

      should(doc.isModified()).equal(true);
    });

    if (DBType.LIVIA === name) {
      it('should be able to get just changed doc', function() {
        const doc = new User({
          name: 'Zlatko',
          address: {
            city: 'Kosice'
          },
          defaultArray: ['Orange', 'Red']
        });

        const justModified = doc.toObject({
          modified: true
        });

        (justModified).should.be.empty();
      });
    }
  });
}

function objectCompatibility(User, name) {
  describe(`Object compatibility ${name}`, function() {
    let doc = null;

    it('should be able to create a instance of the document', function() {
      doc = new User({
        name: 'Zlatko'
      });
    });

    if (DBType.LIVIA === name) {
      it('should be able to get props for upsert without default', function() {
        const json = doc.toObject({
          metadata: true,
          create: true,
          disableDefault: true
        });

        json.should.eql({
          name: 'Zlatko'
        });
      });
    }

    it('should be able to get empty object as undefined', function() {
      const json = doc.toJSON();
      should(json.empty).equal(void 0);

      const obj = doc.toObject();
      should(obj.empty).equal(void 0);

      doc.empty.toJSON().should.eql({});
      doc.empty.toObject().should.eql({});
    });

    it('should be able to get default object', function() {
      const json = doc.toJSON();
      json.address.should.eql({ city: 'Kosice'});

      const obj = doc.toObject();
      obj.address.should.eql({ city: 'Kosice'});

      doc.address.toJSON().should.eql({ city: 'Kosice'});
      doc.address.toObject().should.eql({ city: 'Kosice'});
    });

    it('should be able to get empty mixed', function() {
      const json = doc.toJSON();
      should(json.emptyMixed).equal(void 0);

      const obj = doc.toObject();
      should(obj.emptyMixed).equal(void 0);
    });

    it('should be able to set whole subdocument by direct', function() {
      const address = doc.address;
      doc.address.city = 'Nitra';
      doc.address.city.should.equal('Nitra');

      doc.address.street1 = 'Presovska';

      should(doc.address.toJSON()).eql({
        city: 'Nitra',
        street1: 'Presovska'
      });

      should(doc.address.toObject()).eql({
        city: 'Nitra',
        street1: 'Presovska'
      });
    });

    it('should be able to set whole subdocument by set', function() {
      doc.set('address', {
        city: 'Bardejov',
        street1: 'Hviezdoslavova'
      });

      should(doc.address.toJSON()).eql({
        city: 'Bardejov',
        street1: 'Hviezdoslavova'
      });

      should(doc.address.toObject()).eql({
        city: 'Bardejov',
        street1: 'Hviezdoslavova'
      });
    });

    it('should be able to set whole subdocument by set', function() {
      doc.set('address', {
        city: 'Bardejov',
        street1: 'Hviezdoslavova'
      });

      should(doc.address.toJSON()).eql({
        city: 'Bardejov',
        street1: 'Hviezdoslavova'
      });

      should(doc.address.toObject()).eql({
        city: 'Bardejov',
        street1: 'Hviezdoslavova'
      });
    });

    it('should be able to set whole subdocument', function() {
      doc.address = {
        city: 'Presov',
        street1: 'Svabska'
      };

      should(doc.address.toJSON()).eql({
        city: 'Presov',
        street1: 'Svabska'
      });

      should(doc.address.toObject()).eql({
        city: 'Presov',
        street1: 'Svabska'
      });
    });

    it('should be able to set whole subdocument with one property', function() {
      doc.address = {
        city: 'Presov1'
      };

      should(doc.address.toJSON()).eql({
        city: 'Presov1'
      });

      should(doc.address.toObject()).eql({
        city: 'Presov1'
      });

      doc.set('address.street1', 'Hlavna');

      should(doc.address.toJSON()).eql({
        city: 'Presov1',
        street1: 'Hlavna'
      });
    });
  });
}

function arrayCompatibility(User, name) {
  describe(`Array compatibility ${name}`, function() {
    let doc = null;

    it('should be able to create a instance of the document', function() {
      doc = new User({
        name: 'Zlatko'
      });
    });

    it('should be able to get empty array', function() {
      const json = doc.toJSON();
      json.tags.should.be.eql([]);
    });

    it('should be able to get default array', function() {
      const json = doc.toJSON();
      json.defaultArray.should.be.eql(['Orange', 'Red']);
    });
/*
    it('should be able to use isModified', function() {
      doc.isModified('defaultArray').should.equal(true);
      // doc.defaultArray.tags.should.equal(false); TODO check mongoose status
    });*/

    it('should be able to use length', function() {
      doc.defaultArray.length.should.equal(2);
    });

    it('should be able to push array', function() {
      doc.defaultArray.push('Blue');
      const json = doc.toJSON();
      json.defaultArray.should.be.eql(['Orange', 'Red', 'Blue']);
    });

    it('should be able to pop array', function() {
      const value = doc.defaultArray.pop();
      value.should.equal('Blue');

      const json = doc.toJSON();
      json.defaultArray.should.be.eql(['Orange', 'Red']);
    });

    it('should be able to get item from array by position', function() {
      const value = doc.defaultArray[1];
      should(value).equal('Red');
    });

    it('should be able to get item from array by position out of the range', function() {
      const value = doc.defaultArray[10];
      should(value).equal(void 0);
    });

    it('should be able to set array', function() {
      doc.defaultArray.set(1, 'Black');

      const json = doc.toJSON();
      json.defaultArray.should.be.eql(['Orange', 'Black']);
    });


    it('should be able to use forEach', function() {
      let items = 0;

      doc.defaultArray.forEach(function(value, index) {
        const orgValue = doc.defaultArray[index];
        value.should.equal(orgValue);
        items++;
      });

      items.should.equal(2);
    });

    it('should be able to use map', function() {
      const updated = doc.defaultArray.map(function(value, index) {
        return `${value}${index}`;
      });

      updated.length.should.equal(2);

      updated.forEach(function(value, index) {
        value.should.equal(doc.defaultArray[index] + index);
      });
    });

    it('should be able to use filter', function() {
      const updated = doc.defaultArray.filter(function(value, index) {
        return value === 'Black';
      });

      updated.length.should.equal(1);
      updated[0].should.equal('Black');
    });

    it('should be able to use join', function() {
      const updated = doc.defaultArray.join(',');

      updated.should.equal('Orange,Black');
    });

    it('should be able to use splice', function() {
      doc.defaultArray.splice(0, 1);
      doc.defaultArray.length.should.equal(1);
      doc.defaultArray[0].should.equal('Black');
    });

    it('should be able to shift array', function() {
      const value = doc.defaultArray.shift();
      value.should.equal('Black');

      doc.defaultArray.length.should.equal(0);
    });

    it('should be able to unshift array', function() {
      const length = doc.defaultArray.unshift('Green');
      length.should.equal(1);

      doc.defaultArray[0].should.equal('Green');

      doc.defaultArray.length.should.equal(1);
    });

    if (DBType.LIVIA === name) {
      it('should be able to use setAsOriginal', function() {
        doc.defaultArray.setAsOriginal();
        doc.isModified('defaultArray').should.equal(false);
      });

      it('should be able to use isModified', function() {
        doc.defaultArray.push('White');
        doc.isModified('defaultArray').should.equal(true);

        doc.defaultArray.setAsOriginal();
        doc.isModified('defaultArray').should.equal(false);
      });
    }

    it('should be able to add object into the array', function() {
      doc.images.push({
        title: 'Nice Image'
      });

      doc.images.length.should.equal(1);

      const images = doc.images;
      const json = images[0].toJSON();

      json.should.eql({
        title: 'Nice Image'
      });
    });

    it('should be able to add empty object into the array', function() {
      doc.images.push({});

      doc.images.length.should.equal(2);

      const images = doc.images;
      const json = images[1].toJSON();

      json.should.eql({
        title: 'MyImage'
      });
    });

    if (DBType.LIVIA === name) {
      it('should be able to add a new property to the object', function() {
        const images = doc.images;

        doc.set('images.1.addTest', 1234);
        const json = images[1].toJSON();

        json.should.eql({
          title: 'MyImage',
          addTest: 1234
        });
      });
    }
  });
}

describe('Mongoose compatibility', function() {
  var schema = null;
  var schemaMongoose = null;

  const changedSchema = {
    imagesEmpty: [{
      size: { type : String }
    }]
  };

  const subSchema = {
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

    var empty = schema.path('emptyMixed');
    should.deepEqual(empty.options, basicSchema.emptyMixed);

    var imagesEmpty = schema.path('imagesEmpty');
    should.deepEqual(imagesEmpty.options.type, basicSchema.imagesEmpty);


    var city = schema.path('address.city');
    city.should.not.have.property('schema');
    city.should.have.property('path');
    city.path.should.equal('address.city');
    should.deepEqual(city.options, basicSchema.address.city);
  }

  function validateChangedSchema(schema, checkVirtualArray) {
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

    var empty = schema.path('emptyMixed');
    should.deepEqual(empty.options, basicSchema.emptyMixed);

    var imagesEmpty = schema.path('imagesEmpty');
    should.deepEqual(imagesEmpty.options.type, changedSchema.imagesEmpty);


    var city = schema.path('address.city');
    city.should.not.have.property('schema');
    city.should.have.property('path');
    city.path.should.equal('address.city');
    should.deepEqual(city.options, basicSchema.address.city);
  }


  it('should be able to create simple array schema vith virtual field', function() {
    const schema = new Schema({
      images: [{
         size: { type: Number }
      }]
    });

    schema.virtual('images.url').get(function() {
      return 123;
    });
  });

  it('should be able to create simple livia schema', function() {
    schema = new Schema(extend(true, {}, basicSchema, {
      sub: [new Schema(subSchema)]
    }));
    applyVirtual(schema);
    validateBasicSchema(schema, true);
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

describe('Query', function() {
  const model = {
    name: 'FictiveModel'
  };

  it('should be able to use contains correctly', function() {
    const q = new Query(model);
    q.findOne({
      providers: {
        $contains: {
          nameUID: 'facebook_123456'
        }
      }
    });

    q._operators[0].query.should.equal('providers CONTAINS (nameUID = :nameUID_op_1)');
  });
});

describe('Linked model', function() {
  let Profile = null

  it('should be able to create a model', function() {
    const schemaData = {
      user: { type: UserLivia, required: true, default: {} },
      image: { type: String }
    };

    const ProfileModel = new Model('Profile', schemaData, {}, { ensure: false });
    Profile = ProfileModel.DocumentClass;
  });

  it('should be able to create a simple linked doc', function() {
    const profile = new Profile({
      user: '1234',
      image: 'path'
    });

    profile.user.should.equal('1234');
  });

  it('should be able to create a linked doc', function() {
    const user = new UserLivia({});

    const profile = new Profile({
      image: 'path'
    });

    const obj = profile.toObject();
  });

  it('should be able to create a linked doc', function() {
    const user = new UserLivia({});

    const profile = new Profile({
      user: user,
      image: 'path'
    });

    should(profile.user instanceof UserLivia).equal(true);

    const json = profile.toJSON();

    json.user.name.should.equal('Zlatko');
  });

  it('should be able to create a linked doc from plain object', function() {
    const user = new UserLivia({});

    const profile = new Profile({
      user: {
        name: 'Adam'
      },
      image: 'path'
    });

    should(profile.user instanceof UserLivia).equal(true);

    const json = profile.toJSON();
    json.user.name.should.equal('Adam');

    profile.set('user.name', 'Peter');
    profile.get('user.name').should.equal('Peter');
  });
});

describe('Linked Schema.Types.ObjectId with ref', function() {
  const schemaData = {
    user: { type: Schema.Types.ObjectId, ref: 'User' }
  };

  let CommentLivia = null;

  it('should be able to create a model', function() {
    const CommentModel = new Model('Comment', schemaData, {}, { ensure: false });
    CommentLivia = CommentModel.DocumentClass;
  });


  it('should be able to create a instance of the document', function() {
    const doc = new UserLivia({
      name: 'Zlatko'
    });

    const comm = new CommentLivia({
      user: doc
    });

    comm.toJSON().user.should.containEql({
      name: 'Zlatko'
    });
  });
});
