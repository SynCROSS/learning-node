const express = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/express');
const jwt = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/jsonwebtoken');
const cors = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/cors');
const url = require('url');

const { verifyToken, apiLimiter } = require('./middlewares');
const { Domain, User, Post, Hashtag } = require('../models');

const router = express.Router();

router.use(async (req, res, next) => {
  const domain = await Domain.findOne({
    where: { host: url.parse(req.get('origin')).host },
  });
  if (domain) {
    cors({ origin: req.get('origin') });
  }
});

router.post('/token', apiLimiter, async (req, res) => {
  const { clientSecret } = req.body;
  try {
    const domain = await Domain.findOne({
      where: { clientSecret },
      include: { model: User, attributes: ['nick', 'id'] },
    });
    if (!domain) {
      return res.status(401).json({
        code: 401,
        message: "Unauthorized Because It's Unregistered Domain.",
      });
    }
    const token = jwt.sign(
      { id: domain.User.id, nick: domain.User.nick },
      process.env.JWT_SECRET,
      {
        expiresIn: '30m', // * 30 * 60 * 1000
        issuer: 'Twinkle',
      },
    );
    return res.json({ code: 200, message: 'OK, Token has issued.', token });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ code: 500, message: 'Server Error' });
  }
});

router.get('/test', verifyToken, apiLimiter, (req, res) => {
  res.json(req.decoded);
});

router.get('/posts/my', apiLimiter, verifyToken, (req, res) => {
  Post.findAll({ where: { userId: req.decoded.id } })
    .then(posts => {
      console.log(posts);
      res.json({ code: 200, payload: posts });
    })
    .catch(error => {
      console.error(error);
      return status(500).json({ code: 500, message: 'Server Error' });
    });
});

router.get(
  '/posts/hashtag/:title',
  verifyToken,
  apiLimiter,
  async (req, res) => {
    try {
      const hashtag = await Hashtag.findOne({
        where: { title: req.params.title },
      });
      if (!hashtag) {
        return res.status(404).json({ code: 404, message: 'NOT Found' });
      }
      const posts = await hashtag.getPosts();
      return res.json({ code: 200, payload: posts });
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        code: 500,
        message: 'Server Error',
      });
    }
  },
);

module.exports = router;
