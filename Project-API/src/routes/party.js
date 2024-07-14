const express = require('express');
const router = express.Router();
const Party = require('../models/Party');
const PartyGuest = require('../models/PartyGuest');
const Poll = require('../models/Poll');
const mongoose = require('mongoose');
const authenticate = require('../middleware/authenticate');

const MongoClient = require('mongodb').MongoClient;
const url =
  'mongodb+srv://lyrenee02:tSGwv9viMBFajw3u@cluster.muwwbsd.mongodb.net/?retryWrites=true&w=majority&appName=cluster';
const client = new MongoClient(url);

// Generates unique party invite code when creating new party
const generateUniquePartyCode = async () => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code;
  let isUnique = false;

  while (!isUnique) {
    code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    const existingParty = await Party.findOne({ partyInviteCode: code });
    if (!existingParty) {
      isUnique = true;
    }
  }
  return code;
};

//Edit Party Name
router.post('/EditPartyName', authenticate, async (req, res) => {
  const { newPartyName } = req.body;

  try {
    const party = await Party.findOne({ hostID: req.userId });

    if (!party) {
      return res.status(404).json({ message: 'Party not found' });
    }

    party.partyName = newPartyName;
    await party.save();

    res.status(200).json({ message: 'Party name updated successfully', party });
  } catch (err) {
    console.error('Error updating party name:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create party
router.post('/create', authenticate, async (req, res) => {
  const { partyName } = req.body;
  console.log('Creating party for user ID:', req.userId);

  try {
    const existingParty = await Party.findOne({ hostID: req.userId });
    console.log('Found party:', existingParty);

    if (existingParty) {
      return res.status(400).json({ message: 'User already has a party' });
    }

    const partyInviteCode = await generateUniquePartyCode();

    const newParty = new Party({
      partyName,
      hostID: req.userId,
      partyInviteCode,
    });

    await newParty.save();

    const newPoll = new Poll({
      partyID: newParty._id,
      movies: [],
    });

    await newPoll.save();

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
router.get('/home', authenticate, async (req, res) => {
  const { partyID } = req.query;

  try {
    const party = await Party.findById(partyID).populate('hostID');
    console.log('Party found:', party);

    const guests = await PartyGuest.find({ partyID }).populate('userID');
    console.log('Guests found:', guests);

    const guestDetails = guests.map((guest) => ({
      userName: guest.userID.name,
      userEmail: guest.userID.email,
    }));
    console.log('Guest details:', guestDetails);

    const polls = await Poll.find({ partyID }).populate('movies.movieID');
    console.log('Polls found:', polls);

    const topVotedMovie = polls.reduce((top, poll) => {
      const topMovieInPoll = poll.movies.sort((a, b) => b.votes - a.votes)[0];
      return topMovieInPoll && (!top || topMovieInPoll.votes > top.votes)
        ? topMovieInPoll
        : top;
    }, null);
    console.log('Top voted movie:', topVotedMovie);

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
    console.error('Server error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Join party
router.post('/joinParty', authenticate, async (req, res) => {
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
router.post('/leaveParty', authenticate, async (req, res) => {
  const { userID, partyID } = req.body;
  const db = client.db('party-database');
  try {
    await db.collection('party-members').deleteOne({ userID, partyID });
    await db.collection('users').updateOne({ userID }, { $set: { status: 0 } });
    res.status(200).json({ message: 'Left party successfully' });
  } catch (e) {
    res.status500().json({ error: e.toString() });
  }
});

module.exports = router;
