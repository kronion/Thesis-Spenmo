var passport =      require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    flash =         require('connect-flash');

module.exports = function(app, schemas) {
  /* Build passport object */
  passport.use(new LocalStrategy(
    function(username, password, done) {
      schemas.User.findOne({ username: username }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        user.verifyPassword(password, function(err, valid) {
          if (err) {
            return done(err);
          }
          if (!valid) {
            return done(null, false, { message: 'Incorrect password.' });
          }
          return done(null, user);
        });
      });
    }
  ));

  /* Serialization handlers */
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
  passport.deserializeUser(function(id, done) {
    schemas.User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  app.use(passport.initialize())
     .use(passport.session())
     .use(flash());

  var routes = {

    /* Login route */
    login: function(req, res) {
      (passport.authenticate('local',
        { successRedirect: '/',
          failureRedirect: '/',
        }))(req, res);
    },

    /* Logout route */
    logout: function(req, res) {
      req.logout();
      res.redirect('/');
    },

    /* Signup route */
    signup: function(req, res) {
      var user = new schemas.User({
        username:  req.body.username,
        password:  req.body.password,
        firstname: req.body.firstname,
        lastname:  req.body.lastname
      });
      user.save(function(err) {
        if (err) {
          req.flash('info', 'Mongoose save error: ' + err);
          res.redirect('/signup');
        }
        else {
          (passport.authenticate('local',
            { successRedirect: '/user',
              failureRedirect: '/',
              failureFlash: true }))(req, res);
        }
      });
    }
  }

  return routes;
};
