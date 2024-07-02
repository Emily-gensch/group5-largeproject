const mongoose = require('mongoose');

const partySchema = new mongoose.Schema({
  partyName: {
    type: String,
    required: true,
  },
  hostID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  partyInviteCode: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('Party', partySchema);
