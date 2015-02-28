var async = require('async');
var mongoose = require('mongoose');
var parry = require('parry');
var assert = require('power-assert');

var parryMongoose = require('../index');


describe('parry-mongoose', function() {

  it('should return formatted array for "validate"', function() {
    var UsernameField = parry.Field.extend()
      .type('isAlpha', 'Not alpha')
      .type('isLength', [4, 8])
    ;
    var validateList = parryMongoose(UsernameField);
    assert(validateList.length === 2);
    assert(typeof validateList[0].validator === 'function');
    assert(validateList[0].msg === 'Not alpha');
    assert(typeof validateList[1].validator === 'function');
    assert(validateList[1].msg === parry.DEFAULT_ERROR_MESSAGES.isLength);
  });


  it('with mongoose', function(done) {
    var UsernameField = parry.Field.extend()
      .type('isAlpha', 'Not alpha')
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

    async.series([
      function(next) {
        var user = new User();
        user.username = 'un1';
        user.validate(function(err) {
          assert(err);
          assert(err.name === 'ValidationError');
          // Note: mongoose schemaType.validators is evaluated in reverse order
          assert(err.errors.username.message === parry.DEFAULT_ERROR_MESSAGES.isLength);
          next();
        });
      },
      function(next) {
        var user = new User();
        user.username = 'unk1';
        user.validate(function(err) {
          assert(err);
          assert(err.name === 'ValidationError');
          assert(err.errors.username.message === 'Not alpha');
          next();
        });
      }
    ], done);
  });
});
