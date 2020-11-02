const passport = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/passport');
const KakaoStrategy = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/passport-kakao')
  .Strategy;

const User = require('../models/user');

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      { clientID: process.env.KAKAO_ID, callbackURL: '/auth/kakao/callback' },
      async (accessToken, refreshToken, profile, done) => {
        console.log('kakao profile', profile);
        try {
          const exUser = await User.findOne({
            where: { starID: profile.id, provider: 'kakao' },
          });
          if (exUser) {
            done(null, exUser);
          } else {
            const newUser = await User.create({
              email: profile._json && profile._json.kakao_account_email,
              nick: profile.displayName,
              starID: profile.id,
              provider: 'kakao', // ?
            });
            done(null, newUser);
          }
        } catch (e) {
          console.error(e);
          done(e);
        }
      },
    ),
  );
};
