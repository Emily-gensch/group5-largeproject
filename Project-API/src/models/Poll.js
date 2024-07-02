const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
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
  votes: {
    type: Number,
    default: 0,
  },
  watchedStatus: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Poll', pollSchema);
