const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
    partyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Party'
    },
    senderObjectId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    invitedId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending'
    }
  });

const Invite = mongoose.model('Invite', invitationSchema);
module.exports = Invite;
