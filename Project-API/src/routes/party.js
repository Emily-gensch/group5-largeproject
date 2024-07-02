const express = require('express');
const router = express.Router();
const Party = require('../models/Party');
const PartyGuest = require('../models/PartyGuest');
const Poll = require('../models/Poll');
const mongoose = require('mongoose');
const authenticate = require('../middleware/authenticate');

// Create party
router.post('/create', authenticate, async (req, res) => {
  const { partyName, partyInviteCode } = req.body;

  try {
    const newParty = new Party({
      partyName,
      hostID: new mongoose.Types.ObjectId(req.userId),
      partyInviteCode,
    });
    await newParty.save();
    res
      .status(201)
      .json({ message: 'Party created successfully', party: newParty });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Homepage of party
router.get('/home', authenticate, async (req, res) => {
  const { partyID } = req.query;

  try {
    const party = await Party.findById(partyID).populate('hostID');
    const guests = await PartyGuest.find({ partyID }).populate('userID');
    const guestDetails = guests.map((guest) => ({
      userName: guest.userID.name,
      userEmail: guest.userID.email,
    }));

    const polls = await Poll.find({ partyID }).populate('movieID');
    const topVotedMovie = polls.sort((a, b) => b.votes - a.votes)[0];

    res.status(200).json({
      partyName: party.partyName,
      partyInviteCode: party.partyInviteCode,
      hostName: party.hostID.name,
      guests: guestDetails,
      topVotedMovie: topVotedMovie
        ? topVotedMovie.movieID.title
        : 'No votes yet',
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
