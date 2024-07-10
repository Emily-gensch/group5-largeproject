// routes/poll.js
const express = require('express');
const mongoose = require('mongoose');
const Poll = require('../models/Poll');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

router.get('/api/poll/:partyID', authenticate, async (req, res) => {
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

router.post('/api/addMovieToPoll', authenticate, async (req, res) => {
  const { pollID, movieID } = req.body; // Accept pollID and movieID
  try {
    const poll = await Poll.findById(pollID);
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }
    poll.movies.push({ movieID, votes: 0, watchedStatus: false });
    await poll.save();
    res.status(200).json({ message: 'Movie added to poll successfully', poll });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// Upvote movie button (incoming: poll ID)
router.post('/api/upvoteMovie', authenticate, async (req, res) => {
  const { pollID, movieID } = req.body;
  try {
    const poll = await Poll.findById(pollID);
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
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

router.post('/api/downvoteMovie', authenticate, async (req, res) => {
  const { pollID, movieID } = req.body;
  try {
    const poll = await Poll.findById(pollID);
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
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

// Remove movie button (incoming: poll ID)
router.delete('/api/removeMovie', authenticate, async (req, res) => {
  const { pollID, movieID } = req.body;
  try {
    const poll = await Poll.findById(pollID);
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }
    const movieIndex = poll.movies.findIndex(
      (m) => m.movieID.toString() === movieID
    );
    if (movieIndex === -1) {
      return res.status(404).json({ error: 'Movie not found in poll' });
    }
    poll.movies.splice(movieIndex, 1); // Remove the movie
    await poll.save();
    res.status(200).json({ message: 'Movie removed from poll successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

//mark movie as watched
router.post('/api/markWatched', authenticate, async (req, res) => {
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

// Vote Page
router.get('/api/votePage', async (req, res) => {
  const { pollID } = req.body;
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

// Start poll
routes.post('/api/startPoll', authenticate, async (req, res) => {
  const { partyID } = req.body; // Only require partyID
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
