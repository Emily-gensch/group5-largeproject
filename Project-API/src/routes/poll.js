const express = require('express');
const mongoose = require('mongoose');
const Poll = require('../models/Poll');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

// APIs that have the 'authenticate' parameter will utilize the 'authenticate.js' file within the middleware folder.
// 'authenticate' is used for verifying that the user has the correct permission to be granted specific functionality

// Get polls for a party by partyID
router.get('/poll/:partyID', authenticate, async (req, res) => {
  const { partyID } = req.params;

  try {
    const polls = await Poll.find({
      partyID: mongoose.Types.ObjectId(partyID),
    }).populate('movies.movieID');
    res.status(200).json(polls);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Vote Page
//! Not fixed "error": "Cannot populate path `movieID` because it is not in your schema. Set the `strictPopulate` option to false to override."
router.get('/votePage/:pollID', async (req, res) => {
  const { pollID } = req.params;
  try {
    const poll = await Poll.findById(pollID).populate('movieID');
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }
    res.status(200).json({ movieName: poll.movieID.title, votes: poll.votes });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add movie to poll
router.post('/addMovieToPoll', authenticate, async (req, res) => {
  const { partyID, movieID } = req.body;
  try {
    const poll = await Poll.findOne({ partyID });
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found for this party' });
    }

    poll.movies.push({ movieID, votes: 0, watchedStatus: false });
    await poll.save();

    res.status(200).json({ message: 'Movie added to poll successfully', poll });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// Upvote movie
// User cannot vote on more than one movie in total.
// TODO: Update so user can only vote for one movie.
router.post('/upvoteMovie', authenticate, async (req, res) => {
  const { partyID, movieID } = req.body;
  try {
    const poll = await Poll.findOne({
      partyID: mongoose.Types.ObjectId(partyID),
    });
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found for this party' });
    }
    const movie = poll.movies.find((m) => m.movieID.toString() === movieID);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found in poll' });
    }
    movie.votes += 1;
    await poll.save();
    res
      .status(200)
      .json({ message: 'Movie upvoted successfully', votes: movie.votes });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Downvote movie
router.post('/downvoteMovie', authenticate, async (req, res) => {
  const { partyID, movieID } = req.body;
  try {
    const poll = await Poll.findOne({
      partyID: mongoose.Types.ObjectId(partyID),
    });
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found for this party' });
    }
    const movie = poll.movies.find((m) => m.movieID.toString() === movieID);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found in poll' });
    }
    movie.votes -= 1;
    await poll.save();
    res
      .status(200)
      .json({ message: 'Movie downvoted successfully', votes: movie.votes });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Remove movie from poll
router.delete('/removeMovie', authenticate, async (req, res) => {
  const { partyID, movieID } = req.body;
  try {
    const poll = await Poll.findOne({
      partyID: mongoose.Types.ObjectId(partyID),
    });
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found for this party' });
    }
    const movieIndex = poll.movies.findIndex(
      (m) => m.movieID.toString() === movieID
    );
    if (movieIndex === -1) {
      return res.status(404).json({ error: 'Movie not found in poll' });
    }
    poll.movies.splice(movieIndex, 1);
    await poll.save();
    res.status(200).json({ message: 'Movie removed from poll successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Mark movie as watched
router.post('/markWatched', authenticate, async (req, res) => {
  const { movieID, partyID } = req.body;
  try {
    const poll = await Poll.findOne({ movieID, partyID });
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }
    poll.watchedStatus = 1;
    await poll.save();
    res.status(200).json({ message: 'Movie marked as watched successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Start poll
router.post('/startPoll', authenticate, async (req, res) => {
  const { partyID } = req.body;
  try {
    const newPoll = new Poll({ partyID, movies: [] });
    await newPoll.save();
    res.status(201).json({
      pollID: newPoll._id,
      partyID,
      message: 'Poll started successfully',
    });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

module.exports = router;
