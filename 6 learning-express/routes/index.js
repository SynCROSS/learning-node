const express = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/express');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello, Express');
});

module.exports = router;
