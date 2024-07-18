const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  partyID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Party',
    required: true,
  },
  movies: [
    {
      movieID: {
        type: Number,
        ref: 'Movie',
        required: true,
      },
      votes: { type: Number, default: 0 },
      watchedStatus: { type: Boolean, default: false },
    },
  ],
});

const Poll = mongoose.model('Poll', pollSchema, 'poll');

module.exports = Poll;
