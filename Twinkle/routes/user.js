const express = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/express');
const { isLoggedIn } = require('./middlewares.js');
const User = require('../models/user.js');

const router = express.Router();

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      await user.addFollowing(parseInt(req.params.id, 10));
      res.send('success');
    } else {
      res.status(404).send('No User');
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
