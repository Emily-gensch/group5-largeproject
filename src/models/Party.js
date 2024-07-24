const mongoose = require('mongoose');

const PartySchema = new mongoose.Schema({
  partyName: { type: String, required: true },
  hostID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  partyInviteCode: { type: String, required: true, unique: true },
});

const Party = mongoose.model('Party', PartySchema, 'party');

module.exports = Party;
