const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Party = require('../models/Party');
const PartyMembers = require('../models/PartyMembers');
const Poll = require('../models/Poll');
const mongoose = require('mongoose');
const Movie = require('../models/Movie');
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
router.post('/createWeb', async (req, res) => {
  const { partyName, userID } = req.body;

  if (!userID) {
    return res.status(401).json({ message: 'userID not found' });
  }

  try {
    const existingParty = await Party.findOne({ hostID: userID });

    if (existingParty) {
      return res.status(400).json({ message: 'User already has a party', partyInviteCode: existingParty.partyInviteCode });
    }

    const partyInviteCode = await generateUniquePartyCode();

    const newParty = new Party({
      partyName,
      hostID: userID,
      partyInviteCode,
    });

    const savedParty = await newParty.save();

    const newMember = new PartyMembers({
      userId: userID,
      partyID: savedParty._id,
    });

    await newMember.save();

    req.session.partyID = savedParty._id; // Store the partyID in the session

    res.status(201).json({
      message: 'Party, and Membership created successfully',
      partyInviteCode: savedParty.partyInviteCode,
    });
  } catch (err) {
    console.error('Error creating party, and membership:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/createApp', async (req, res) => {
  const { partyName, userId } = req.body;

  if (!userId) {
    return res.status(401).json({ message: 'session userID not found' });
  }

  console.log('Creating party for user ID:', userId);

  try {
    const existingParty = await Party.findOne({ hostID: userId });
    console.log('Found party:', existingParty);

    if (existingParty) {
      return res.status(400).json({ message: 'User already has a party' });
    }

    const partyInviteCode = await generateUniquePartyCode();

    const newParty = new Party({
      partyName,
      hostID: userId,
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

// Join party
router.post('/joinParty', async (req, res) => {
  const { partyInviteCode } = req.body;
  const userID = req.session.userId;

  if (!userID) {
    return res.status(401).json({ message: 'User ID not found in session' });
  }

  try {
    const party = await Party.findOne({ partyInviteCode });

    if (!party) {
      return res.status(404).json({ message: 'Party not found' });
    }

    const existingMember = await PartyMembers.findOne({ userId: userID, partyID: party._id });

    if (existingMember) {
      req.session.partyID = party._id;
      return res.status(200).json({ message: 'User is already a member of this party', partyID: party._id });
    }

    const newMember = new PartyMembers({
      userId: userID,
      partyID: party._id,
    });

    await newMember.save();

    req.session.partyID = party._id; // Store the partyID in the session

    res.status(200).json({ message: 'Joined party successfully', partyID: party._id });
  } catch (err) {
    console.error('Error joining party:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});



// Check if user is already in a party
router.get('/checkUserParty', async (req, res) => {
  const userID = req.session.userId;

  if (!userID) {
    return res.status(401).json({ message: 'User ID not found in session' });
  }

  try {
    const partyMember = await PartyMembers.findOne({ userID }).populate('partyID');
    if (partyMember) {
      return res.status(200).json({ isInParty: true, partyInviteCode: partyMember.partyID.partyInviteCode });
    } else {
      return res.status(200).json({ isInParty: false });
    }
  } catch (error) {
    console.error('Error checking user party membership:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Home
router.get('/home', async (req, res) => {
  const userID = req.session.userId;

  if (!userID) {
    return res.status(401).json({ message: 'User ID not found in session' });
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

// Leave party
router.post('/leaveParty', async (req, res) => {
  const userID = req.session.userId;

  if (!userID) {
    return res.status(401).json({ message: 'User ID not found' });
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

// Add movie to Poll
router.post('/addMovieToPoll', async (req, res) => {
  const { movieID, partyID } = req.body;
  const userID = req.session.userId;

  if (!partyID || !movieID || !userID) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }

  try {
    const poll = await Poll.findOne({ partyID });

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found for this party' });
    }

    // Ensure the movie exists
    const movie = await Movie.findById(movieID);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Add the movie to the poll
    poll.movies.push({
      movieID: movie._id,
      votes: 0,
      addedBy: userID,
    });

    await poll.save();
    res.status(200).json({ message: 'Movie added to poll successfully', poll });
  } catch (error) {
    console.error('Error adding movie to poll:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;