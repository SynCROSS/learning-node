const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Room = require('../schemas/room.js');
const Chat = require('../schemas/chat.js');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const rooms = await Room.find({});
    res.render('main', { rooms, title: 'GIF Chat App' });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.get('/room', (req, res) => {
  res.render('room', { title: 'Create a GIF Chat Room' });
});

router.post('/room', async (req, res, next) => {
  try {
    const newRoom = await Room.create({
      room_name: req.body.room_name,
      maximum_capacity: req.body.maximum_capacity,
      room_master: req.session.color,
      password: req.body.password,
    });
    const io = req.app.get('io');
    io.of('/room').emit('newRoom', newRoom);
    res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.get('/room/:id', async (req, res, next) => {
  try {
    const room = await Room.findOne({ _id: req.params.id });
    const io = req.app.get('io');
    // console.log('room:', io.of('/chat').adapter, 'id', req.params.id);
    if (!room) {
      return res.redirect('/?error=NotFound');
    }
    if (room.password && room.password !== req.query.password) {
      return res.redirect('/?error=WrongPassword');
    }

    const { rooms } = io.of('/chat').adapter;

    if (
      rooms &&
      rooms[req.params.id] &&
      room.maximum_capacity <= rooms[req.params.id].length
    ) {
      return res.redirect('/?error=ExceededMaxCapacity');
    }

    const chats = await Chat.find({ room: room._id }).sort('createdAt');

    return res.render('chat', {
      room,
      title: room.room_name,
      chats,
      user: req.session.color,
    });
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

router.delete('/room/:id', async (req, res, next) => {
  try {
    await Room.remove({ _id: req.params.id });
    await Chat.remove({ room: req.params.id });

    res.send('ok');

    setTimeout(() => {
      req.app.get('io').of('/room').emit('removeRoom', req.params.id);
    }, 2000);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post('/room/:id/chat', async (req, res, next) => {
  try {
    const chat = await Chat.create({
      room: req.params.id,
      user: req.session.color,
      chat: req.body.chat,
    });

    req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
    res.send('ok');
  } catch (e) {
    console.error(e);
    next(e);
  }
});

try {
  fs.readdirSync('uploads');
} catch (e) {
  console.error('uploads folder is NOT EXIST. Creating uploads folder.');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads/');
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 1024 * 1024 * 5 },
});

router.post('/room/:id/gif', upload.single('gif'), async (req, res, next) => {
  try {
    const chat = await Chat.create({
      room: req.params.id,
      user: req.session.color,
      gif: req.file.filename,
    });

    req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
    res.send('ok');
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
