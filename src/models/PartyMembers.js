const mongoose = require('mongoose');

const PartyMembersSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  partyID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Party',
    required: true,
  },
});

const PartyMembers = mongoose.model(
  'PartyMembers',
  PartyMembersSchema,
  'PartyMembers'
);

module.exports = PartyMembers;
