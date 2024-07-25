const mongoose = require('mongoose');

const PartyMembersSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
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
