const mongoose = require('mongoose');

const { Schema } = mongoose;

const roomSchema = new Schema({
  room_name: {
    type: String,
    required: true,
  },
  maximum_capacity: {
    type: Number,
    required: true,
    default: 10,
    min: 2,
  },
  room_master: {
    type: String,
    required: true,
  },
  password: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Room', roomSchema);
