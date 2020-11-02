const passport = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findOne({ where: { id } })
      .then(user => done(null, user))
      .catch(error => done(error));
  });
  local();
  kakao();
};
