const express = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/express');
const jwt = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/jsonwebtoken');

const { verifyToken } = require('./middlewares');
const { Domain, User } = require('../models');

const router = express.Router();

router.post('/token', async (req, res) => {
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
        expiresIn: '1m', // * 60 * 1000
        issuer: 'Twinkle',
      },
    );
    return res.json({ code: 200, message: 'OK, Token has issued.', token });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ code: 500, message: 'Server Error' });
  }
});

router.get('/test', verifyToken, (req, res) => {
  res.json(req.decoded);
});

module.exports = router;
