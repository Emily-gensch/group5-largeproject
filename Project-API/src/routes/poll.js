const express = require('express');
const mongoose = require('mongoose');
const Poll = require('../models/Poll');
const PartyMembers = require('../models/PartyMembers');
const Movie = require('../models/Movie');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Upvote a movie
router.post('/upvoteMovie', async (req, res) => {
  const { movieID, pollID } = req.body;

  if (!mongoose.Types.ObjectId.isValid(movieID) || !mongoose.Types.ObjectId.isValid(pollID)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const poll = await Poll.findOne({ _id: pollID, movieID: new mongoose.Types.ObjectId(movieID) });
    if (!poll) {
      console.error('Poll not found for movieID:', movieID);
      return res.status(404).json({ error: 'Movie not found in poll' });
    }

    poll.votes += 1;
    await poll.save();
    res.status(200).json({ votes: poll.votes });
  } catch (error) {
    console.error('Error upvoting movie:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add movie to Poll
router.post('/addMovieToPoll', async (req, res) => {
  const { movieID, userID } = req.body;

  if (!mongoose.Types.ObjectId.isValid(movieID) || !mongoose.Types.ObjectId.isValid(userID)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const partyMember = await PartyMembers.findOne({ userID: new mongoose.Types.ObjectId(userID) }).populate('partyID');
    if (!partyMember) {
      return res.status(404).json({ message: 'Party not found for user' });
    }

    const partyID = partyMember.partyID._id;

    // Ensure the movie exists
    const movie = await Movie.findById(new mongoose.Types.ObjectId(movieID));
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Create a new poll entry for the movie
    const newPoll = new Poll({
      pollID: uuidv4(),
      partyID: new mongoose.Types.ObjectId(partyID),
      movieID: new mongoose.Types.ObjectId(movieID),
      votes: 0,
      watchedStatus: false
    });

    await newPoll.save();
    res.status(200).json({ message: 'Movie added to poll successfully', newPoll });
  } catch (error) {
    console.error('Error adding movie to poll:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove movie from poll
router.delete('/removeMovie', async (req, res) => {
  const { partyID, movieID } = req.body;
  console.log(`Removing movie from poll for partyID: ${partyID}, movieID: ${movieID}`);

  if (!mongoose.Types.ObjectId.isValid(partyID) || !mongoose.Types.ObjectId.isValid(movieID)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const poll = await Poll.findOne({ partyID });
    if (!poll) {
      console.log('Poll not found for partyID:', partyID);
      return res.status(404).json({ error: 'Poll not found for this party' });
    }

    const movieIndex = poll.movies.findIndex((movie) => movie.movieID.toString() === movieID);
    if (movieIndex === -1) {
      console.log('Movie not found in poll:', movieID);
      return res.status(404).json({ error: 'Movie not found in poll' });
    }

    poll.movies.splice(movieIndex, 1);
    await poll.save();

    res.status(200).json({ message: 'Movie removed from poll successfully' });
  } catch (err) {
    console.error('Error removing movie from poll:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Mark movie as watched
router.post('/markWatched', async (req, res) => {
  const { movieID, partyID } = req.body;
  console.log(`Marking movie as watched for movieID: ${movieID}, partyID: ${partyID}`);

  if (!mongoose.Types.ObjectId.isValid(partyID) || !mongoose.Types.ObjectId.isValid(movieID)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const poll = await Poll.findOne({ partyID });
    if (!poll) {
      console.log('Poll not found for partyID:', partyID);
      return res.status(404).json({ error: 'Poll not found' });
    }

    const movieEntry = poll.movies.find((movie) => movie.movieID.toString() === movieID);
    if (!movieEntry) {
      console.log('Movie not found in poll:', movieID);
      return res.status(404).json({ error: 'Movie not found in poll' });
    }

    movieEntry.watchedStatus = true;
    await poll.save();

    res.status(200).json({ message: 'Movie marked as watched successfully' });
  } catch (err) {
    console.error('Error marking movie as watched:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Start poll
router.post('/startPoll', async (req, res) => {
  const { partyID, movieID } = req.body;
  console.log(`Starting poll for partyID: ${partyID}, movieID: ${movieID}`);

  if (!mongoose.Types.ObjectId.isValid(partyID) || !mongoose.Types.ObjectId.isValid(movieID)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const newPoll = new Poll({
      pollID: uuidv4(),
      partyID: new mongoose.Types.ObjectId(partyID),
      movies: [] // Initialize movies array
    });
    await newPoll.save();
    res.status(201).json({
      pollID: newPoll._id,
      partyID,
      message: 'Poll started successfully',
    });
  } catch (e) {
    console.error('Error starting poll:', e);
    res.status(500).json({ error: e.toString() });
  }
});


module.exports = router;
