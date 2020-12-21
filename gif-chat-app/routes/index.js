const express = require('express');

const Room = require('../schemas/room.js');
const Chat = require('../schemas/chat.js');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const rooms = await Room.find({});
    res.render('main', { rooms, title: 'GIF Chat App' });
  } catch (e) {
    console.error(e);
    next();
  }
});

router.get('/room', (req, res) => {
  res.render({ title: 'Create a GIF Chat Room' });
});

router.post(
  ('/room',
  async (req, res, next) => {
    try {
      const newRoom = await Room.create({
        room_name: req.body.title,
        maximum_capacity: req.body.maximum_capacity,
        room_master: req.session.color,
        password: req.body.password,
      });
      const io = req.app.get('io');
      io.of('/room').emit('newRoom', newRoom);
      res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);
    } catch (e) {
      console.error(e);
      next();
    }
  }),
);

router.get('/room/:id', async (req, res, next) => {
  try {
    const room = await Room.findOne({ _id: req.params.id });
    const io = req.app.get('io');

    if (!room) {
      return res.redirect("/?error=This Room ain' Exist.");
    }
    if (room.password && room.password !== req.query.password) {
      return res.redirect('/?error=Wrong Password');
    }
  } catch (e) {}
});

module.exports = router;
