const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PartySchema = new Schema({
  partyName: {
    type: String,
    required: true,
  },
  hostID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  partyInviteCode: {
    type: String,
    required: true,
    unique: true,
  },
  // Add other fields as necessary
});

const Party = mongoose.model('Party', PartySchema);
module.exports = Party;
