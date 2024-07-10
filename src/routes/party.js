const express = require('express');
const router = express.Router();
const Party = require('../models/Party');
const PartyGuest = require('../models/PartyGuest');
const Poll = require('../models/Poll');
const mongoose = require('mongoose');
const authenticate = require('../middleware/authenticate');

// Create party
router.post('/api/party/create', authenticate, async (req, res) => {
  const { partyName, partyInviteCode } = req.body;

  try {
    const newParty = new Party({
      partyName,
      hostID: new mongoose.Types.ObjectId(req.userId),
      partyInviteCode,
    });

    await newParty.save();

    const newPoll = new Poll({
      partyID: newParty._id,
      movies: [],
    });

    await newPoll.save();

    // Logging for debugging
    console.log('New Party:', newParty);
    console.log('New Poll:', newPoll);

    res.status(201).json({
      message: 'Party and Poll created successfully',
      party: newParty,
      poll: newPoll,
    });
  } catch (err) {
    console.error('Error creating party and poll:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Homepage of party
router.get('/api/party/home', authenticate, async (req, res) => {
  const { partyID } = req.query;

  try {
    const party = await Party.findById(partyID).populate('hostID');
    const guests = await PartyGuest.find({ partyID }).populate('userID');
    const guestDetails = guests.map((guest) => ({
      userName: guest.userID.name,
      userEmail: guest.userID.email,
    }));

    // Use correct path for population
    const polls = await Poll.find({ partyID }).populate('movies.movieID');
    const topVotedMovie = polls.reduce((top, poll) => {
      const topMovieInPoll = poll.movies.sort((a, b) => b.votes - a.votes)[0];
      return topMovieInPoll && (!top || topMovieInPoll.votes > top.votes)
        ? topMovieInPoll
        : top;
    }, null);

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

// Join party
router.post('/api/joinParty', authenticate, async (req, res) => {
  const { partyInviteCode, userID } = req.body;
  const db = client.db('party-database');
  let error = 'none';

  const party = await db.collection('party').findOne({ partyInviteCode });
  if (!party) {
    return res.status(400).json({ error: 'Invalid code' });
  }

  const newMember = { userID, partyID: party.partyID };
  try {
    await db.collection('party-members').insertOne(newMember);
    await db.collection('users').updateOne({ userID }, { $set: { status: 1 } });
    res.status(200).json({
      userID,
      partyID: party.partyID,
      message: 'Joined party successfully',
    });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// Leave party
router.post('/api/leaveParty', authenticate, async (req, res) => {
  const { userID, partyID } = req.body;
  const db = client.db('party-database');
  try {
    await db.collection('party-members').deleteOne({ userID, partyID });
    await db.collection('users').updateOne({ userID }, { $set: { status: 0 } });
    res.status(200).json({ message: 'Left party successfully' });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

module.exports = router;
