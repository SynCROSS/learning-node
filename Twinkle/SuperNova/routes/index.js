const express = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/express');
const axios = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/axios');

const router = express.Router();
const URL = 'http://localhost:3125/v2';
axios.defaults.headers.origin = 'http://localhost:4000';

const request = async (req, api) => {
  try {
    if (!req.session.jwt) {
      const tokenResult = await axios.post(`${URL}/token`, {
        clientSecret: process.env.CLIENT_SECRET,
      });
      req.session.jwt = tokenResult.data.token;
    }
    return await axios.get(`${URL}${api}`, {
      headers: { authorization: req.session.jwt },
    });
  } catch (e) {
    if (e.response.status === 419) {
      delete req.session.jwt;
      return request(req, api);
    }
    return e.response;
  }
};

router.get('/mypost', async (req, res, next) => {
  try {
    const result = await request(req, '/posts/my');
    res.json(result.data);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.get('/search/:hashtag', async (req, res, next) => {
  try {
    const result = await request(
      req,
      `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`,
    );
    res.json(result.data);
  } catch (e) {
    if (e.code) {
      console.error(e);
      next(e);
    }
  }
});

router.get('/', (req, res) => {
  res.render('main', { key: process.env.CLIENT_SECRET });
});

module.exports = router;
