module.exports = function(mongoose) {
  var Schema = mongoose.Schema; // Shortens the code
  var schemas = {};

  /* User schema */
  var userSchema = Schema({
    username:  {
      type: String,
      required: true,
      unique: true
    },
    password:  {
      type: String,
      required: true,
      bcrypt: true
    },
    firstname: {
      type: String,
      required: true
    },
    lastname:  {
      type: String,
      required: true
    }

    // Extend here
  });
  userSchema.plugin(require('mongoose-bcrypt'));
  schemas.User = mongoose.model('User', userSchema);

  return schemas;
}
