require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// MongoDB connection
const url = process.env.MONGO_URI;

mongoose.set('strictQuery', true);

if (process.env.NODE_ENV !== 'test') {
  console.log('MongoDB URI:', url);
  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));
}

// Mongoose Models
const User = require('./models/User');
const Party = require('./models/Party');
const Poll = require('./models/Poll');
const PartyGuest = require('./models/PartyGuest');
const Movie = require('./models/Movie');

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware authentication
const authenticate = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'Access Denied' });
  }

  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Access Denied' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verified.id;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

app.use('/api/auth', require('./routes/auth'));
app.use('/api/party', authenticate, require('./routes/party'));

// app.get('/api/poll/:partyID', authenticate, async (req, res) => {
//   const { partyID } = req.params;

//   try {
//     const polls = await Poll.find({
//       partyID: mongoose.Types.ObjectId(partyID),
//     }).populate('movies.movieID');
//     res.status(200).json(polls);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });

// // Create party
// app.post('/api/party/create', authenticate, async (req, res) => {
//   const { partyName, partyInviteCode } = req.body;

//   try {
//     const newParty = new Party({
//       partyName,
//       hostID: new mongoose.Types.ObjectId(req.userId),
//       partyInviteCode,
//     });

//     await newParty.save();

//     const newPoll = new Poll({
//       partyID: newParty._id,
//       movies: [],
//     });

//     await newPoll.save();

//     // Logging for debugging
//     console.log('New Party:', newParty);
//     console.log('New Poll:', newPoll);

//     res.status(201).json({
//       message: 'Party and Poll created successfully',
//       party: newParty,
//       poll: newPoll,
//     });
//   } catch (err) {
//     console.error('Error creating party and poll:', err);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });

// // Homepage of party
// app.get('/api/party/home', authenticate, async (req, res) => {
//   const { partyID } = req.query;

//   try {
//     const party = await Party.findById(partyID).populate('hostID');
//     const guests = await PartyGuest.find({ partyID }).populate('userID');
//     const guestDetails = guests.map((guest) => ({
//       userName: guest.userID.name,
//       userEmail: guest.userID.email,
//     }));

//     // Use correct path for population
//     const polls = await Poll.find({ partyID }).populate('movies.movieID');
//     const topVotedMovie = polls.reduce((top, poll) => {
//       const topMovieInPoll = poll.movies.sort((a, b) => b.votes - a.votes)[0];
//       return topMovieInPoll && (!top || topMovieInPoll.votes > top.votes)
//         ? topMovieInPoll
//         : top;
//     }, null);

//     res.status(200).json({
//       partyName: party.partyName,
//       partyInviteCode: party.partyInviteCode,
//       hostName: party.hostID.name,
//       guests: guestDetails,
//       topVotedMovie: topVotedMovie
//         ? topVotedMovie.movieID.title
//         : 'No votes yet',
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });

// Join party
// app.post('/api/joinParty', authenticate, async (req, res) => {
//   const { partyInviteCode, userID } = req.body;
//   const db = client.db('party-database');
//   let error = 'none';

//   const party = await db.collection('party').findOne({ partyInviteCode });
//   if (!party) {
//     return res.status(400).json({ error: 'Invalid code' });
//   }

//   const newMember = { userID, partyID: party.partyID };
//   try {
//     await db.collection('party-members').insertOne(newMember);
//     await db.collection('users').updateOne({ userID }, { $set: { status: 1 } });
//     res.status(200).json({
//       userID,
//       partyID: party.partyID,
//       message: 'Joined party successfully',
//     });
//   } catch (e) {
//     res.status(500).json({ error: e.toString() });
//   }
// });

// Display movies
app.post('/api/displayMovies', async (req, res) => {
  const db = client.db('party-database');
  try {
    const movies = await db.collection('movie').find({}).toArray();
    movies.sort((a, b) => a.title.localeCompare(b.title));
    res.status(200).json(movies);
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// // Start poll
// app.post('/api/startPoll', authenticate, async (req, res) => {
//   const { partyID } = req.body; // Only require partyID
//   try {
//     const newPoll = new Poll({ partyID, movies: [] });
//     await newPoll.save();
//     res.status(201).json({
//       pollID: newPoll._id,
//       partyID,
//       message: 'Poll started successfully',
//     });
//   } catch (e) {
//     res.status(500).json({ error: e.toString() });
//   }
// });

// app.post('/api/addMovieToPoll', authenticate, async (req, res) => {
//   const { pollID, movieID } = req.body; // Accept pollID and movieID
//   try {
//     const poll = await Poll.findById(pollID);
//     if (!poll) {
//       return res.status(404).json({ error: 'Poll not found' });
//     }
//     poll.movies.push({ movieID, votes: 0, watchedStatus: false });
//     await poll.save();
//     res.status(200).json({ message: 'Movie added to poll successfully', poll });
//   } catch (e) {
//     res.status(500).json({ error: e.toString() });
//   }
// });

// Display watched movies
app.post('/api/displayWatchedMovies', authenticate, async (req, res) => {
  const { partyID } = req.body;
  const db = client.db('party-database');
  try {
    const watchedMovies = await db
      .collection('poll')
      .find({ partyID, watchedStatus: 1 })
      .toArray();
    const movieIDs = watchedMovies.map((m) => m.movieID);
    const movies = await db
      .collection('movie')
      .find({ movieID: { $in: movieIDs } })
      .toArray();
    res.status(200).json(movies);
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// Display user account
app.post('/api/userAccount', authenticate, async (req, res) => {
  const { userID } = req.body;
  const db = client.db('party-database');
  try {
    const user = await db.collection('users').findOne({ userID });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// // Vote Page
// app.get('/api/votePage', async (req, res) => {
//   const { pollID } = req.body;
//   try {
//     const poll = await Poll.findById(pollID).populate('movieID');
//     if (!poll) {
//       return res.status(404).json({ error: 'Poll not found' });
//     }
//     res.status(200).json({ movieName: poll.movieID.title, votes: poll.votes });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });

// // Upvote movie button (incoming: poll ID)
// app.post('/api/upvoteMovie', authenticate, async (req, res) => {
//   const { pollID, movieID } = req.body;
//   try {
//     const poll = await Poll.findById(pollID);
//     if (!poll) {
//       return res.status(404).json({ error: 'Poll not found' });
//     }
//     const movie = poll.movies.find((m) => m.movieID.toString() === movieID);
//     if (!movie) {
//       return res.status(404).json({ error: 'Movie not found in poll' });
//     }
//     movie.votes += 1;
//     await poll.save();
//     res
//       .status(200)
//       .json({ message: 'Movie upvoted successfully', votes: movie.votes });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });

// // Remove movie button (incoming: poll ID)
// app.delete('/api/removeMovie', authenticate, async (req, res) => {
//   const { pollID, movieID } = req.body;
//   try {
//     const poll = await Poll.findById(pollID);
//     if (!poll) {
//       return res.status(404).json({ error: 'Poll not found' });
//     }
//     const movieIndex = poll.movies.findIndex(
//       (m) => m.movieID.toString() === movieID
//     );
//     if (movieIndex === -1) {
//       return res.status(404).json({ error: 'Movie not found in poll' });
//     }
//     poll.movies.splice(movieIndex, 1); // Remove the movie
//     await poll.save();
//     res.status(200).json({ message: 'Movie removed from poll successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });

const generateUniquePartyCode = async () => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code;
  let isUnique = false;

  while (!isUnique) {
    code = '';
    for (let i = 0; i < 8; i++) {
      // Adjust length as needed
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    const existingParty = await Party.findOne({ partyInviteCode: code });
    if (!existingParty) {
      isUnique = true;
    }
  }
  return code;
};

// Mark movie watched
// app.post('/api/markWatched', authenticate, async (req, res) => {
//   const { movieID, partyID } = req.body;
//   try {
//     const poll = await Poll.findOne({ movieID, partyID });
//     if (!poll) {
//       return res.status(404).json({ error: 'Poll not found' });
//     }
//     poll.watchedStatus = 1;
//     await poll.save();
//     res.status(200).json({ message: 'Movie marked as watched successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });

// app.post('/api/downvoteMovie', authenticate, async (req, res) => {
//   const { pollID, movieID } = req.body;
//   try {
//     const poll = await Poll.findById(pollID);
//     if (!poll) {
//       return res.status(404).json({ error: 'Poll not found' });
//     }
//     const movie = poll.movies.find((m) => m.movieID.toString() === movieID);
//     if (!movie) {
//       return res.status(404).json({ error: 'Movie not found in poll' });
//     }
//     movie.votes -= 1;
//     await poll.save();
//     res
//       .status(200)
//       .json({ message: 'Movie downvoted successfully', votes: movie.votes });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });

// // Leave party
// app.post('/api/leaveParty', authenticate, async (req, res) => {
//   const { userID, partyID } = req.body;
//   const db = client.db('party-database');
//   try {
//     await db.collection('party-members').deleteOne({ userID, partyID });
//     await db.collection('users').updateOne({ userID }, { $set: { status: 0 } });
//     res.status(200).json({ message: 'Left party successfully' });
//   } catch (e) {
//     res.status(500).json({ error: e.toString() });
//   }
// });

// Change password
app.post('/api/changePassword', authenticate, async (req, res) => {
  const { userID, newPassword, validatePassword } = req.body;
  const db = client.db('party-database');
  const passwordRegex =
    /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,32}$/;

  if (newPassword !== validatePassword) {
    return res.status(400).json({ error: 'Passwords must match' });
  }
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({ error: 'Weak password' });
  }

  try {
    const existingUser = await db
      .collection('users')
      .findOne({ userID, password: newPassword });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: 'Password matches current password' });
    }
    await db
      .collection('users')
      .updateOne({ userID }, { $set: { password: newPassword } });
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// Start the server
client.connect((err) => {
  if (err) {
    console.error('Failed to connect to the database. Exiting now...');
    process.exit();
  } else {
    app.listen(5000, () => {
      console.log('Server is running on port 5000');
    });
  }
});

module.exports = app;
