const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const pollSchema = new mongoose.Schema({
  pollID: { type: String, default: uuidv4, unique: true },
  partyID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Party',
    required: true,
  },
  movieID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  votes: { type: Number, default: 0 },
  watchedStatus: { type: Boolean, default: false },
});

const Poll = mongoose.model('Poll', pollSchema, 'polls');

module.exports = Poll;
