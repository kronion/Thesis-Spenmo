var passport =      require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    flash =         require('connect-flash'),
    keys =          require('./keys.js'),
    nexmo =         require('nexmo')({ key: keys.nexmo_key,
                                       secret: keys.nexmo_secret });

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

    factor: function(req, res) {
      var key = Math.round(Math.random() * (10000 - 1000) + 1000);
      var message = nexmo.sms({ to: keys.nexmo_to, from: keys.nexmo_from,
        text: 'Key is ' + key });
      message.send(function(err, results) {
        if (err) {
          req.flash('info', 'Nexmo SMS error: ' + err);
          req.logout();
          res.redirect('/');
        }
        else {
          req.session.key = '' + key;
          res.render('factor', { flash: req.flash('info') });
        }
      });
    },

    /* Login route */
    login: function(req, res) {
      (passport.authenticate('local',
        { successRedirect: '/factor',
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
    },

    /* SMS two-factor auth */
    sms: function(req, res) {
      if (req.session.key === req.body.key) {
        res.redirect('/');
      }
      else {
        req.flash('info', 'Two factor authentication failed. Please try again.');
        delete req.session.key;
        req.logout();
        res.redirect('/');
      }
    }
  }

  return routes;
};
