const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Party = require('../models/Party');
const PartyMembers = require('../models/PartyMembers');
const Poll = require('../models/Poll');
const mongoose = require('mongoose');
const Movie = require('../models/Movie');
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
      movies: [], // Start with an empty array
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
  console.log(`Fetching home page for partyID: ${partyID}`);

  try {
    const party = await Party.findById(partyID).populate('hostID');
    if (!party) {
      console.log('Party not found');
      return res.status(404).json({ error: 'Party not found' });
    }

    console.log('Party found:', party);

    const guests = await PartyMembers.find({ partyID }).populate('userID');
    console.log('Guests found:', guests);

    const guestDetails = guests.map((guest) => ({
      userName: guest.userID.name,
      userEmail: guest.userID.email,
    }));
    console.log('Guest details:', guestDetails);

    const polls = await Poll.find({ partyID });
    console.log('Polls found:', polls);

    const moviesWithDetails = await Promise.all(
      polls.map(async (poll) => {
        return await Promise.all(
          poll.movies.map(async (movieEntry) => {
            const movie = await Movie.findOne({ movieID: movieEntry.movieID });
            if (!movie) {
              console.log('Movie not found for movieID:', movieEntry.movieID);
              return null;
            }
            return {
              movieName: movie.title,
              votes: movieEntry.votes,
              watchedStatus: movieEntry.watchedStatus,
              genre: movie.genre,
              description: movie.description,
            };
          })
        );
      })
    );

    const topVotedMovie = moviesWithDetails.flat().reduce((top, movie) => {
      if (!movie) return top;
      return movie.votes > (top.votes || 0) ? movie : top;
    }, {});

    res.status(200).json({
      partyName: party.partyName,
      partyInviteCode: party.partyInviteCode,
      hostName: party.hostID.name,
      guests: guestDetails,
      topVotedMovie: topVotedMovie.movieName || 'No votes yet',
    });
  } catch (err) {
    console.error('Server error:', err);
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
      .collection('PartyMembers')
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
      .collection('PartyMembers')
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

router.get('/getPartyMembers', async (req, res) => {
  const { partyID } = req.query; // Get partyID from query parameters

  if (!partyID) {
    return res.status(400).json({ message: 'Party ID is required' });
  }

  try {
    const partyObjectId = new ObjectId(partyID);
    const members = await PartyMembers.find({ partyID: partyObjectId }).populate('userID');
    
    if (!members || members.length === 0) {
      return res.status(404).json({ message: 'No members found for this party' });
    }

    const memberDetails = members.map((member) => ({
      username: member.userID.username,
      email: member.userID.email,
    }));

    res.status(200).json({ members: memberDetails });
  } catch (err) {
    console.error('Error fetching party members:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/getPollMovies', async (req, res) => {
  const { pollID } = req.query;
  
  try {
    const poll = await Poll.findOne({ _id: mongoose.Types.ObjectId(pollID) });
    
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }
    
    const movieIDs = poll.movies.map(movie => movie.movieID);
    const movies = await Movie.find({ _id: { $in: movieIDs } });
    
    res.status(200).json({ movies });
  } catch (e) {
    console.error('Error fetching poll movies:', e);
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
      .collection('PartyMembers')
      .findOne({ userID: userObjectId, partyID: partyObjectId });
    if (!partyMember) {
      console.log('User is not in the party');
      return res.status(400).json({ message: 'User is not in the party' });
    }

    const currentMembers = await db
      .collection('PartyMembers')
      .find({ partyID: partyObjectId })
      .toArray();
    console.log('Current party members:', currentMembers);

    const deleteResult = await db
      .collection('PartyMembers')
      .deleteOne({ userID: userObjectId, partyID: partyObjectId });
    console.log('Delete result:', deleteResult);

    const updatedMembers = await db
      .collection('PartyMembers')
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