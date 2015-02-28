// Ref) mongoose custom validation
//      http://mongoosejs.com/docs/api.html#schematype_SchemaType-validate
module.exports = function(fieldClass, options) {
  options = options || {};
  var errorLogger = options.errorLogger || null;

  return fieldClass.validations.map(function(validation) {
    var actualValidation = fieldClass.createActualValidation(validation);
    var errorMessage = fieldClass.guessErrorMessage(validation);
    return {
      validator: function(value, next) {
        actualValidation(value, function(err, validationResult) {
          if (err) {
            if (errorLogger) { errorLogger(err); }
            return next(false);
          }
          if (!validationResult.isValid) {
            return next(false);
          }
          next(true);
        });
      },
      msg: errorMessage
    };
  });
};
