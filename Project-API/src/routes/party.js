const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Party = require('../models/Party');
const PartyMembers = require('../models/PartyMembers');
const Poll = require('../models/Poll');
const mongoose = require('mongoose');
const authenticate = require('../middleware/authenticate');
const { ObjectId } = require('mongodb');

const MongoClient = require('mongodb').MongoClient;
const url =
  'mongodb+srv://lyrenee02:tSGwv9viMBFajw3u@cluster.muwwbsd.mongodb.net/party-database?retryWrites=true&w=majority&appName=cluster';
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

// Edit Party Name
router.post('/EditPartyName', async (req, res) => {
  const { newPartyName, hostID } = req.body;

  if (!hostID) {
    return res.status(400).json({ message: 'Host ID is required' });
  }

  try {
    const party = await Party.findOne({ hostID });

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
router.post('/create', async (req, res) => {
  const { partyName, userID } = req.body;

  if (!userID) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  console.log('Creating party for user ID:', userID);

  try {
    const existingParty = await Party.findOne({ hostID: userID });
    console.log('Found party:', existingParty);

    if (existingParty) {
      return res.status(400).json({ message: 'User already has a party' });
    }

    const partyInviteCode = await generateUniquePartyCode();

    const newParty = new Party({
      partyName,
      hostID: userID,
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
router.get('/home', async (req, res) => {
  const { partyID } = req.query;
  const db = client.db('party-database');

  try {
    const party = await Party.findById(partyID).populate('hostID');
    if (!party) {
      return res.status(404).json({ message: 'Party not found' });
    }
    console.log('Party found:', party);

    const guests = await db
      .collection('partyMembers')
      .find({ partyID: new ObjectId(partyID) })
      .toArray();
    console.log('Guests found:', guests);

    const guestDetails = await Promise.all(
      guests.map(async (guest) => {
        const user = await db
          .collection('users')
          .findOne({ _id: new ObjectId(guest.userID) });
        return {
          userName: user.name,
          userEmail: user.email,
        };
      })
    );
    console.log('Guest details:', guestDetails);

    const polls = await Poll.find({ partyID: new ObjectId(partyID) }).populate(
      'movies.movieID'
    );
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
router.post('/joinParty', async (req, res) => {
  const { partyInviteCode, userID } = req.body;
  const db = client.db('party-database');

  if (!userID) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const party = await Party.findOne({ partyInviteCode });
    if (!party) {
      console.log('Invalid party invite code');
      return res.status(400).json({ error: 'Invalid code' });
    }

    const userObjectId = new ObjectId(userID);
    const partyObjectId = new ObjectId(party._id);

    const existingMember = await db
      .collection('partyMembers')
      .findOne({ userID: userObjectId, partyID: partyObjectId });
    if (existingMember) {
      console.log('User is already a member of the party');
      return res
        .status(400)
        .json({ message: 'User is already a member of the party' });
    }

    const newMember = {
      userID: userObjectId,
      partyID: partyObjectId,
    };

    const insertResult = await db
      .collection('partyMembers')
      .insertOne(newMember);
    console.log('Insert result:', insertResult);

    const updateResult = await db
      .collection('users')
      .updateOne({ _id: userObjectId }, { $set: { status: 1 } });

    res.status(200).json({
      userID: userID,
      partyID: party._id,
      message: 'Joined party successfully',
    });
  } catch (e) {
    console.error('Error joining party:', e);
    res.status(500).json({ error: e.toString() });
  }
});

//Leave Party
router.post('/leaveParty', async (req, res) => {
  const { userID, partyID } = req.body;
  const db = client.db('party-database');

  try {
    console.log(`Attempting to remove user ${userID} from party ${partyID}`);

    const userObjectId = new ObjectId(userID);
    const partyObjectId = new ObjectId(partyID);

    const partyMember = await db
      .collection('partyMembers')
      .findOne({ userID: userObjectId, partyID: partyObjectId });
    if (!partyMember) {
      console.log('User is not in the party');
      return res.status(400).json({ message: 'User is not in the party' });
    }

    const currentMembers = await db
      .collection('partyMembers')
      .find({ partyID: partyObjectId })
      .toArray();
    console.log('Current party members:', currentMembers);

    const deleteResult = await db
      .collection('partyMembers')
      .deleteOne({ userID: userObjectId, partyID: partyObjectId });
    console.log('Delete result:', deleteResult);

    const updatedMembers = await db
      .collection('partyMembers')
      .find({ partyID: partyObjectId })
      .toArray();
    console.log('Updated party members:', updatedMembers);

    const updateResult = await db
      .collection('users')
      .updateOne({ _id: userObjectId }, { $set: { status: 0 } });
    console.log('Update result:', updateResult);

    res.status(200).json({ message: 'Left party successfully' });
  } catch (e) {
    console.error('Error leaving party:', e);
    res.status(500).json({ error: e.toString() });
  }
});

module.exports = router;
