const passport = require('passport');

const localStrategy = require('./localStrategy.js');
const User = require('../models/user.js');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findOne({ where: { id } })
      .then(user => done(null, user))
      .catch(e => done(e));
  });

  localStrategy();
};
