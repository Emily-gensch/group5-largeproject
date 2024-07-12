const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  partyID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Party',
    required: true,
  },
  movies: [
    {
      movieID: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
      votes: { type: Number, default: 0 },
      watchedStatus: { type: Boolean, default: false },
    },
  ],
});

module.exports = mongoose.model('Poll', pollSchema, 'poll');
