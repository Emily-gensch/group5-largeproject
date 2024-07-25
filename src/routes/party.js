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
  const { partyName } = req.body;
  const userID = req.session.userId;

  if (!userID) {
    return res.status(401).json({ message: 'userID not found' });
  }

  console.log(partyName);

  try {
    const existingParty = await Party.findOne({ hostID: userID });

    if (existingParty) {
      return res.status(400).json({ message: 'User already has a party' });
    }

    const partyInviteCode = await generateUniquePartyCode();

    const newParty = new Party({
      partyName,
      hostID: userID,
      partyInviteCode,
    });

    const savedParty = await newParty.save();

    const newPoll = new Poll({
      pollID: Date.now(),
      partyID: savedParty._id,
      movieID: null,
      votes: 0,
      watchedStatus: false,
    });

    const savedPoll = await newPoll.save();

    const newMember = new PartyMembers({
      userID: userID,
      partyID: savedParty._id,
    });

    await newMember.save();

    res.status(201).json({
      message: 'Party, Poll, and Membership created successfully',
      party: savedParty,
      poll: savedPoll,
    });
  } catch (err) {
    console.error('Error creating party, poll, and membership:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/home', async (req, res) => {
  const userID = req.session.userId;

  if (!userID) {
    return res.status(401).json({ message: 'userID not found in session' });
  }

  try {
    const partyMember = await PartyMembers.findOne({ userID }).populate(
      'partyID'
    );
    if (!partyMember) {
      return res.status(404).json({ message: 'Party not found for user' });
    }

    const partyID = partyMember.partyID._id;

    console.log(`Fetching home page for partyID: ${partyID}`);

    const party = await Party.findById(partyID).populate('hostID');
    if (!party) {
      console.log('Party not found');
      return res.status(404).json({ error: 'Party not found' });
    }

    console.log('Party found:', party);

    const guests = await PartyMembers.find({ partyID }).populate('userID');
    console.log('Guests found:', guests);

    const guestDetails = guests.map((guest) => ({
      userName: guest.userID.username,
      userEmail: guest.userID.email,
    }));
    console.log('Guest details:', guestDetails);

    const polls = await Poll.find({ partyID });
    console.log('Polls found:', polls);

    const moviesWithDetails = await Promise.all(
      polls.map(async (poll) => {
        if (!poll.movies || poll.movies.length === 0) return [];
        return await Promise.all(
          poll.movies.map(async (movieEntry) => {
            if (!movieEntry.movieID) {
              return {
                movieName: 'No movie assigned',
                votes: movieEntry.votes,
                watchedStatus: movieEntry.watchedStatus,
                genre: null,
                description: null,
              };
            }
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

//Leave Party
router.post('/leaveParty', async (req, res) => {
  const userID = req.session.userId;

  if (!userID) {
    return res.status(401).json({ message: 'userID not found' });
  }

  try {
    console.log(`Attempting to remove user ${userID} from their party`);

    const userObjectId = new ObjectId(userID);

    const partyMember = await PartyMembers.findOne({ userID: userObjectId });
    if (!partyMember) {
      console.log('User is not in any party');
      return res.status(400).json({ message: 'User is not in any party' });
    }

    const partyObjectId = partyMember.partyID;

    const currentMembers = await PartyMembers.find({ partyID: partyObjectId });
    console.log('Current party members:', currentMembers);

    const deleteResult = await PartyMembers.deleteOne({
      userID: userObjectId,
      partyID: partyObjectId,
    });
    console.log('Delete result:', deleteResult);

    const updatedMembers = await PartyMembers.find({ partyID: partyObjectId });
    console.log('Updated party members:', updatedMembers);

    const updateResult = await User.updateOne(
      { _id: userObjectId },
      { $set: { status: 0 } }
    );
    console.log('Update result:', updateResult);

    res.status(200).json({ message: 'Left party successfully' });
  } catch (e) {
    console.error('Error leaving party:', e);
    res.status(500).json({ error: e.toString() });
  }
});

module.exports = router;
