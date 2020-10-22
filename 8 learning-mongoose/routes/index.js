const express = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/express');
const User = require('../schemas/user');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const users = await User.find({});
    res.render('mongoose', { users });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
