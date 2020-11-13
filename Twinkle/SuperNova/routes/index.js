const express = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/express');
const axios = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/axios');

const router = express.Router();

router.get('/test', async (req, res, next) => {
  // * Router for Testing Tokens
  try {
    if (!req.session.jwt) {
      const tokenResult = await axios.post('http://localhost:3125/v1/token', {
        clientSecret: process.env.CLIENT_SECRET,
      });
      if (tokenResult.data && tokenResult.data.code === 200) {
        req.session.jwt = tokenResult.data.token;
      } else {
        return res.json(tokenResult.data);
      }
    }
    const result = await axios.get('http://localhost:3125/v1/test', {
      headers: { authorization: req.session.jwt },
    });
    return res.json(result.data);
  } catch (e) {
    console.error(e);
    if (e.response.status === 419) {
      return res.json(e.response.data);
    }
    return next(e);
  }
});

module.exports = router;
