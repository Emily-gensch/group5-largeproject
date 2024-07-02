const mongoose = require('mongoose');

const partyGuestSchema = new mongoose.Schema({
  partyID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Party',
    required: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('PartyGuest', partyGuestSchema);
