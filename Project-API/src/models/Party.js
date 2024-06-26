const mongoose = require('mongoose');

const PartySchema = new mongoose.Schema({
  partyID: {
    type: String,
    required: true,
  },
  partyName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  hostID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Party', PartySchema);
