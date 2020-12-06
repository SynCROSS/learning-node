const express = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User, Hashtag } = require('../models');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  // res.locals.user = null;
  res.locals.followerCount = req.user ? req.user.Followers.length : 0;
  res.locals.followingCount = req.user ? req.user.Followings.length : 0;
  res.locals.followerIdList = req.user
    ? req.user.Followings.map(following => following.id)
    : [];
  next();
});

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', { title: 'My Profile - Twinkle' });
});

router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', { title: 'Twinkle' });
});

router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      include: { model: User, attributes: ['id', 'nick'] },
      order: [['createdAt', 'DESC']],
    });
    res.render('main', { title: 'Twinkle', stars: posts });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.get('/hashtag', async (req, res, next) => {
  const query = req.query.hashtag;
  if (!query) {
    return res.redirect('/');
  }
  try {
    const hashtag = await Hashtag.findOne({ where: { title: query } });
    let posts = [];

    if (hashtag) {
      posts = await hashtag.getPosts({ include: [{ model: User }] });
    }

    return res.render('main', { title: `${query} | Twinkle`, stars: posts });
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

module.exports = router;
