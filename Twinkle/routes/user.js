const express = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/express');

const { isLoggedIn } = require('./middlewares');
const { addFollowing } = require('../controllers/user');

const router = express.Router();

router.post('/:id/follow', isLoggedIn, addFollowing);

module.exports = router;
