const express = require('express');
const mongoose = require('mongoose');
const Poll = require('../models/Poll');
const Party = require('../models/Party');
const Movie = require('../models/Movie');
const PartyMembers = require('../models/PartyMembers');
const StoredMovies = require('../models/StoredMovies');
const router = express.Router();

// Vote Page using query parameter
// Example: http://localhost:5000/api/poll/votePage?pollID=66980dc3b03ee5fdec99ffde
router.get('/votePage', async (req, res) => {
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

    const storedMovies = await StoredMovies.find({ partyID }).populate(
      'movieID'
    );
    if (!storedMovies || storedMovies.length === 0) {
      return res
        .status(404)
        .json({ error: 'No stored movies found for this party' });
    }

    const moviesWithDetails = storedMovies.map((movieEntry) => ({
      _id: movieEntry.movieID._id,
      title: movieEntry.movieID.title,
      votes: movieEntry.votes,
      watchedStatus: movieEntry.watchedStatus,
      genre: movieEntry.movieID.genre,
      description: movieEntry.movieID.description,
    }));

    res.status(200).json({ movies: moviesWithDetails });
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
  const { movieID } = req.body;
  const userID = req.session.userId;
  if (!userID) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const party = await Party.findOne({ hostID: userID });

    if (!party) {
      console.log('Party not found for userID:', userID);
      return res.status(404).json({ error: 'Party not found for this user' });
    }

    const partyID = party._id;

    if (!mongoose.Types.ObjectId.isValid(partyID)) {
      console.log('Invalid party ID:', partyID);
      return res.status(400).json({ error: 'Invalid party ID' });
    }

    if (typeof movieID !== 'number') {
      console.log('Invalid movie ID type:', movieID);
      return res.status(400).json({ error: 'Invalid movie ID' });
    }

    const movie = await Movie.findOne({ movieID: movieID });
    if (!movie) {
      console.log('Movie not found for movieID:', movieID);
      return res.status(404).json({ error: 'Movie not found' });
    }

    const existingStoredMovie = await StoredMovies.findOne({
      movieID: movie._id,
      partyID: partyID,
    });
    if (existingStoredMovie) {
      console.log('Movie already in storedMovies:', movieID);
      return res.status(400).json({ error: 'Movie already in storedMovies' });
    }

    const storedMovie = new StoredMovies({
      userID: userID,
      movieID: movie._id,
      partyID: partyID,
      votes: 0,
      watchedStatus: false,
    });

    await storedMovie.save();

    res.status(201).json({
      message: 'Movie added to storedMovies successfully',
      storedMovie,
    });
  } catch (e) {
    console.error('Error adding movie to storedMovies:', e);
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
