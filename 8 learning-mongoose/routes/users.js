const express = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/express');
const User = require('../schemas/user');
const Comment = require('../schemas/comment');

const router = express.Router();

router
  .route('/')
  .get(async (req, res, next) => {
    try {
      const users = await User.find({});
      res.json(users);
    } catch (e) {
      console.error(e);
      next(e);
    }
  })
  .post(async (req, res, next) => {
    try {
      const user = await User.create({
        name: req.body.name,
        age: req.body.age,
        married: req.body.married,
      });
      console.log(user);
      res.status(201).json(user);
    } catch (e) {
      console.error(e);
      next(e);
    }
  });

router.get('/:id/comments', async (req, res, next) => {
  try {
    const comments = await Comment.find({
      commenter: req.params.id,
    }).populate('commenter');
    console.log(comments);
    res.json(comments);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
