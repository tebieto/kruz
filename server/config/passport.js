var JwtStrategy = require('passport-jwt').Strategy;
var config = require('../config');
const mongoose = require('mongoose');

// load up the user model
const User = mongoose.model('User');
module.exports = function(passport) {
  var opts = {};
  opts.secretOrKey = config.APP_SECRET;
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.id}, function(err, user) {
          if (err) {
              return done(err, false);
          }
          if (user) {
              done(null, user);
          } else {
              done(null, false);
          }
      });
  }));
};