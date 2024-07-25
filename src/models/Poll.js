const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  pollID: { type: Number, required: true, unique: true },
  partyID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Party',
    required: true,
  },
  movieID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: false,
  },
  votes: { type: Number, default: 0 },
  watchedStatus: { type: Boolean, default: false },
});

const Poll = mongoose.model('Poll', pollSchema, 'poll');

module.exports = Poll;
