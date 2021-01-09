const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { User, Good, Auction } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('../routes/middlewares.js');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

router.get('/', async (req, res, next) => {
  try {
    const goods = await Good.findAll({ where: { SoldId: null } });
    res.render('main', {
      title: 'RealTimeAuction',
      goods,
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('/join', {
    title: 'Join - RealTimeAuction',
  });
});

router.get('/good', isLoggedIn, (req, res) => {
  res.render('good', {
    title: 'Register Goods - RealTimeAuction',
  });
});

try {
  fs.readdirSync('uploads');
} catch (e) {
  console.error(e);
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, callback) {
      callback(null, 'uploads');
    },
    filename(req, file, callback) {
      const ext = path.extname(file.originalname);

      callback(
        null,
        path.basename(file.originalname, ext) + new Date().valueOf() + ext,
      );
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

router.post(
  '/good',
  isLoggedIn,
  upload.single('img'),
  async (req, res, next) => {
    try {
      const { name, price } = req.body;

      await Good.create({
        OwnerId: req.user.id,
        name,
        img: req.file.filename,
        price,
      });
      res.redirect('/');
    } catch (e) {
      console.error(e);
      next(e);
    }
  },
);

module.exports = router;
