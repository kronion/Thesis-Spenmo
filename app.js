'use strict';
require('rootpath')();

/*
 * Express Dependencies
 */
var express = require('express');
var app = express();
var port = 3000;

/*
 * Handlebars templating and application local variables
 */
var exphbs = require('express3-handlebars');
app.locals = {
  title: 'Spenmo'
};

/*
 * Middleware
 */
app.use(express.compress());
app.use(express.cookieParser());
app.use(express.urlencoded());
app.use(express.json());

/*
 * Config for Production and Development
 */
if (process.env.NODE_ENV === 'production') {
    // Set the default layout and locate layouts and partials
    app.engine('handlebars', exphbs({
        defaultLayout: 'main',
        layoutsDir: 'dist/views/layouts/',
        partialsDir: 'dist/views/partials/'
    }));

    // Locate the views
    app.set('views', __dirname + '/dist/views');

    // Locate the assets
    app.use(express.static(__dirname + '/dist/assets'));

} else {
    app.engine('handlebars', exphbs({
        // Default Layout and locate layouts and partials
        defaultLayout: 'main',
        layoutsDir: 'views/layouts/',
        partialsDir: 'views/partials/'
    }));

    // Locate the views
    app.set('views', __dirname + '/views');

    // Locate the assets
    app.use(express.static(__dirname + '/assets'));
}

// Set Handlebars
app.set('view engine', 'handlebars');

/*
 * MongoDB
 */
var db = require('models/db.js')(app, express);
var schemas = db.schemas;
db.connection.on('error', console.error.bind(console, 'Connection error: '));
db.connection.once('open', function() {

  /* Authentication handlers */
  var auth = require('auth/auth.js')(app, db.schemas);

  /*
   * Routes
   */

  /* Gets */

  // Index Page
  app.get('/', function(req, res) {
    res.render('index',
      {
        user: req.user,
        flash: req.flash('info')
      }
    );
  });

  app.get('/factor', auth.factor);

  // Logout
  app.get('/logout', auth.logout);

  // Signup Page
  app.get('/signup', function(req, res) {
    res.render('signup', { flash: req.flash('info') });
  });

  /* Posts */

  // Login Form
  app.post('/login', auth.login);

  // Signup Form
  app.post('/signup', auth.signup);

  // Two Factor Authentication
  app.post('/sms', auth.sms);

  /*
   * Start it up
   */
  app.listen(process.env.PORT || port);
  console.log('Express started on port ' + port);
});
