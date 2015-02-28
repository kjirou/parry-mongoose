# parry-mongoose

[![npm version](https://badge.fury.io/js/parry-mongoose.svg)](http://badge.fury.io/js/parry-mongoose)
[![Build Status](https://travis-ci.org/kjirou/parry-mongoose.svg?branch=master)](https://travis-ci.org/kjirou/parry-mongoose)

mongoose binding for [parry](https://github.com/kjirou/parry).


## Installation
```
npm install parry-mongoose
```


## Usage
```
var mongoose = require('mongoose');
var parry = require('parry');
var parryMongoose = require('parry-mongoose');

var UsernameField = parry.Field.extend()
  .type('isAlpha')
  .type('isLength', [4, 8])
;

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    validate: parryMongoose(UsernameField)
  }
});
var User = mongoose.model('User', userSchema);

var user = new User();
user.username = 'ab1';
user.validate(function(err) {
  console.log(err);
  // ->
  //
  //  { [ValidationError: Validation failed]
  //    message: 'Validation failed',
  //    name: 'ValidationError',
  //    errors:
  //     { username:
  //        { [ValidatorError: String is not in range]
  //          message: 'String is not in range',  // isLength error
  //          name: 'ValidatorError',
  //          path: 'username',
  //          type: 'user defined',
  //          value: 'ab1' } } }
  //
});
```

**Note**:
- mongoose's `doc.validate` evaluates `schemaType.validate` in reverse order
  - In the previous example, `isLength` has been evaluated first
- Can not validate a field if value is empty and `schemaType.required` is `false`
  - It is also a specification of mongoose


## Caution
