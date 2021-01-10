const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const schedule = require('node-schedule');

const { User, Good, Auction, sequelize } = require('../models');
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
  res.render('join', {
    title: 'Join - RealTimeAuction',
  });
});

router.get('/good', isLoggedIn, (req, res) => {
  res.render('good', {
    title: 'Register Good - RealTimeAuction',
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

      const good = await Good.create({
        OwnerId: req.user.id,
        name,
        img: req.file.filename,
        price,
      });
      const endTime = new Date();
      endTime.setDate(endTime.getDate() + 1); // * a day later
      schedule.scheduleJob(endTime, async () => {
        const success = await Auction.findOne({
          where: {
            GoodId: good.id,
          },
          order: [['bid', 'DESC']],
        });
        await Good.update(
          {
            SoldId: success.UserId,
          },
          {
            where: {
              id: good.id,
            },
          },
        );
        await User.update(
          {
            money: sequelize.literal(`money - ${success.bid}`),
          },
          {
            where: {
              id: success.UserId,
            },
          },
        );
      });
      res.redirect('/');
    } catch (e) {
      console.error(e);
      next(e);
    }
  },
);

router.get('/good/:id', isLoggedIn, async (req, res, next) => {
  try {
    const [good, auction] = await Promise.all([
      Good.findOne({
        where: {
          id: req.params.id,
        },
        include: {
          model: User,
          as: 'Owner',
        },
      }),
      Auction.findAll({
        where: {
          GoodId: req.params.id,
        },
        include: {
          model: User,
        },
        order: [['bid', 'ASC']],
      }),
    ]);
    res.render('auction', {
      title: `${good.name} - RealTimeAuction`,
      good,
      auction,
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post('/good/:id/bid', async (req, res, next) => {
  try {
    const { bid, msg } = req.body;
    const good = await Good.findOne({
      where: { id: req.params.id },
      include: {
        model: Auction,
      },
      order: [
        [
          {
            model: Auction,
          },
          'bid',
          'DESC',
        ],
      ],
    });

    if (good.price >= bid) {
      return res.status(403).send('Must be higher than the starting price.');
    }
    if (new Date(good.createdAt).valueOf() + 1000 * 60 * 60 * 24 < new Date()) {
      return res.status(403).send('Auction has already ended.');
    }
    if (good.Auctions[0] && good.Auctions[0].bid >= bid) {
      return res.status(403).send('Must be higher than the previous price.');
    }

    const result = await Auction.create({
      bid,
      msg,
      UserId: req.user.id,
      GoodId: req.params.id,
    });

    req.app.get('io').to(req.params.id).emit('bid', {
      bid: result.bid,
      msg: result.msg,
      nick: req.user.nick,
    });
    return res.send('ok');
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

router.get('/list', isLoggedIn, async (req, res, next) => {
  try {
    const goods = await Good.findAll({
      where: {
        SoldId: req.user.id,
      },
      include: {
        model: Auction,
      },
      order: [
        [
          {
            model: Auction,
          },
          'bid',
          'DESC',
        ],
      ],
    });
    res.render('list', {
      title: 'List of successful bids - RealTimeAuction',
      goods,
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
