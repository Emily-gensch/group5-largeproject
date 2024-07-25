const express = require('express');
const mongoose = require('mongoose');
const Poll = require('../models/Poll');
const Movie = require('../models/Movie');
const router = express.Router();

// Vote Page using query parameter
// Example: http://localhost:5000/api/poll/votePage?pollID=66980dc3b03ee5fdec99ffde
router.get('/votePage', async (req, res) => {
  const { pollID } = req.query;
  console.log(`Fetching vote page for pollID: ${pollID}`);

  try {
    const pollObjectId = mongoose.Types.ObjectId(pollID);

    const poll = await Poll.findById(pollObjectId);
    if (!poll) {
      console.log('Poll not found');
      return res.status(404).json({ error: 'Poll not found' });
    }

    console.log('Poll found:', poll);
    console.log('Movies:', poll.movies);

    const moviesWithDetails = await Promise.all(
      poll.movies.map(async (movieEntry) => {
        const movie = await Movie.findOne({ movieID: movieEntry.movieID });
        if (!movie) {
          console.log('Movie not found for movieID:', movieEntry.movieID);
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

    const validMovies = moviesWithDetails.filter((movie) => movie !== null);

    res.status(200).json({ movies: validMovies });
  } catch (err) {
    console.error('Error fetching vote page:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add movie to Poll
// Example: {
//     "partyID": "66980dc3b03ee5fdec99ffdc",
//     "movieID": 3
// }
router.post('/addMovieToPoll', async (req, res) => {
  const { partyID, movieID } = req.body;
  console.log(
    `Adding movie to poll for partyID: ${partyID}, movieID: ${movieID}`
  );

  try {
    console.log('Type of partyID:', typeof partyID, 'Value:', partyID);

    if (typeof movieID !== 'number') {
      console.log('Invalid movie ID type:', movieID);
      return res.status(400).json({ error: 'Invalid movie ID' });
    }

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
      console.log(poll);
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
// Example: {
//     "partyID": "66980dc3b03ee5fdec99ffdc",
//     "movieID": 3
// }
router.post('/upvoteMovie', async (req, res) => {
  const { partyID, movieID } = req.body;
  console.log(`Upvoting movie for partyID: ${partyID}, movieID: ${movieID}`);

  try {
    const partyObjectId = mongoose.Types.ObjectId(partyID);

    const poll = await Poll.findOne({ partyID: partyObjectId });
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found for this party' });
    }

    const movieEntry = poll.movies.find((movie) => movie.movieID === movieID);
    if (!movieEntry) {
      return res.status(404).json({ error: 'Movie not found in poll' });
    }

    movieEntry.votes += 1;
    await poll.save();

    res
      .status(200)
      .json({ message: 'Movie upvoted successfully', votes: movieEntry.votes });
  } catch (err) {
    console.error('Error upvoting movie:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Remove movie from poll
// Example: {
//     "partyID": "66980dc3b03ee5fdec99ffdc",
//     "movieID": 3
// }
router.delete('/removeMovie', async (req, res) => {
  const { partyID, movieID } = req.body;
  console.log(
    `Removing movie from poll for partyID: ${partyID}, movieID: ${movieID}`
  );

  try {
    const partyObjectId = mongoose.Types.ObjectId(partyID);

    const poll = await Poll.findOne({ partyID: partyObjectId });
    if (!poll) {
      console.log('Poll not found for partyID:', partyID);
      return res.status(404).json({ error: 'Poll not found for this party' });
    }

    const movieIndex = poll.movies.findIndex(
      (movie) => movie.movieID === movieID
    );
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
// Example: {
//     "partyID": "66980dc3b03ee5fdec99ffdc",
//     "movieID": 3
// }
router.post('/markWatched', async (req, res) => {
  const { movieID, partyID } = req.body;
  console.log(
    `Marking movie as watched for movieID: ${movieID}, partyID: ${partyID}`
  );

  try {
    const partyObjectId = mongoose.Types.ObjectId(partyID);

    const poll = await Poll.findOne({ partyID: partyObjectId });
    if (!poll) {
      console.log('Poll not found for partyID:', partyID);
      return res.status(404).json({ error: 'Poll not found' });
    }

    const movieEntry = poll.movies.find((movie) => movie.movieID === movieID);
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

  try {
    const newPoll = new Poll({
      partyID,
      movies: [{ movieID, votes: 0 }],
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
