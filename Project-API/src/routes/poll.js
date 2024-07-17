const express = require('express');
const mongoose = require('mongoose');
const Poll = require('../models/Poll');
const Movie = require('../models/Movie');
const router = express.Router();

// Vote Page using query parameter
router.get('/votePage', async (req, res) => {
  const { pollID } = req.query;
  console.log(`Fetching vote page for pollID: ${pollID}`);

  try {
    const poll = await Poll.findById(pollID).populate('movies.movieID');
    if (!poll) {
      console.log('Poll not found');
      return res.status(404).json({ error: 'Poll not found' });
    }

    // Logging for debugging
    console.log('Poll found:', poll);
    console.log('Populated movies:', poll.movies);

    const moviesWithDetails = await Promise.all(
      poll.movies.map(async (movieEntry) => {
        const movie = await Movie.findOne({ movieID: movieEntry.movieID });
        if (!movie) {
          console.log(
            'Movie ID is not correctly populated for movieEntry:',
            movieEntry
          );
          return null;
        }

        const { votes, watchedStatus } = movieEntry;
        return {
          movieName: movie.title,
          votes,
          watchedStatus,
          genre: movie.genre,
          description: movie.description,
        };
      })
    );

    // Filter out any null values in case some movies were not populated correctly
    const validMovies = moviesWithDetails.filter((movie) => movie !== null);

    res.status(200).json({ movies: validMovies });
  } catch (err) {
    console.error('Error fetching vote page:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/addMovieToPoll', async (req, res) => {
  const { partyID, movieID } = req.body;
  console.log(
    `Adding movie to poll for partyID: ${partyID}, movieID: ${movieID}`
  );

  try {
    // Log the type of movieID
    console.log('Type of movieID:', typeof movieID);

    // Ensure the movieID is a valid number
    if (typeof movieID !== 'number') {
      console.log('Invalid movie ID type:', movieID);
      return res.status(400).json({ error: 'Invalid movie ID' });
    }

    // Check if the movie exists in the Movie collection
    const movie = await Movie.findOne({ movieID: movieID });
    if (!movie) {
      console.log('Movie not found for movieID:', movieID);
      return res.status(404).json({ error: 'Movie not found' });
    }

    const poll = await Poll.findOne({
      partyID: mongoose.Types.ObjectId(partyID),
    });
    if (!poll) {
      console.log('Poll not found for partyID:', partyID);
      return res.status(404).json({ error: 'Poll not found for this party' });
    }

    const movieExists = poll.movies.some((movie) => movie.movieID === movieID);
    if (movieExists) {
      console.log('Movie already in poll:', movieID);
      return res.status(400).json({ error: 'Movie already in poll' });
    }

    poll.movies.push({ movieID: movieID, votes: 0, watchedStatus: false });
    await poll.save();

    res.status(201).json({ message: 'Movie added to poll successfully', poll });
  } catch (e) {
    console.error('Error adding movie to poll:', e);
    res.status(500).json({ error: e.toString() });
  }
});

// Upvote movie
router.post('/upvoteMovie', async (req, res) => {
  const { partyID, movieID } = req.body;
  console.log(`Upvoting movie for partyID: ${partyID}, movieID: ${movieID}`);

  try {
    const poll = await Poll.findOne({
      partyID: mongoose.Types.ObjectId(partyID),
      movieID: mongoose.Types.ObjectId(movieID),
    });
    if (!poll) {
      return res
        .status(404)
        .json({ error: 'Poll not found for this party and movie' });
    }
    poll.votes += 1;
    await poll.save();
    res
      .status(200)
      .json({ message: 'Movie upvoted successfully', votes: poll.votes });
  } catch (err) {
    console.error('Error upvoting movie:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Remove movie from poll
router.delete('/removeMovie', async (req, res) => {
  const { partyID, movieID } = req.body;
  console.log(
    `Removing movie from poll for partyID: ${partyID}, movieID: ${movieID}`
  );

  try {
    const poll = await Poll.findOne({
      partyID: mongoose.Types.ObjectId(partyID),
      movieID: mongoose.Types.ObjectId(movieID),
    });
    if (!poll) {
      return res
        .status(404)
        .json({ error: 'Poll not found for this party and movie' });
    }
    await poll.remove();
    res.status(200).json({ message: 'Movie removed from poll successfully' });
  } catch (err) {
    console.error('Error removing movie from poll:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Mark movie as watched
router.post('/markWatched', async (req, res) => {
  const { movieID, partyID } = req.body;
  console.log(
    `Marking movie as watched for movieID: ${movieID}, partyID: ${partyID}`
  );

  try {
    const poll = await Poll.findOne({
      movieID: mongoose.Types.ObjectId(movieID),
      partyID: mongoose.Types.ObjectId(partyID),
    });
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }
    poll.watchedStatus = true;
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

  try {
    const newPoll = new Poll({ partyID, movieID });
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
