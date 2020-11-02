const express = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  // res.locals.user = null;
  res.locals.followerCount = 0;
  res.locals.followingCount = 0;
  res.locals.followerIdList = [];
  next();
});

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', { title: 'My Profile - Twinkle' });
});

router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', { title: 'Twinkle' });
});

router.get('/', (req, res, next) => {
  const stars = [];
  res.render('main', { title: 'Twinkle', stars });
});

module.exports = router;
