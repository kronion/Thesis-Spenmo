require('rootpath')();

module.exports = function(app, express) {

  var mongoose = require('mongoose'),
      MongoStore = require('connect-mongo')(express);
  mongoose.connect('mongodb://localhost/' + app.locals.title);

  /* Put all schemas in this dedicated file */
  var schemas = require('models/schemas.js')(mongoose);

  /* DB Settings */
  var settings = require('models/settings.js');

  app.use(express.session({
    secret: settings.secret,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    })
  }));
  return {
    schemas: schemas,
    connection: mongoose.connection
  }
}
