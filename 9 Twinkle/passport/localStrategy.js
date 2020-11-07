const passport = require('passport');
const LocalStrategy = require('passport-local/lib/strategy');
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () => {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' },
      async (email, password, done) => {
        try {
          const exUser = await User.findOne({ where: { email } });
          if (exUser) {
            const result = await bcrypt.compare(password, exUser.password);
            if (result) {
              done(null, exUser);
            } else {
              done(null, false, { message: "Password doesn't Match." });
            }
          } else {
            done(null, false, { message: "You're An Unregistered." });
          }
        } catch (e) {
          console.error(e);
          done(e);
        }
      },
    ),
  );
};
