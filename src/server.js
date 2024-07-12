require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// MongoDB connection
const url = process.env.MONGO_URI_PARTY;

mongoose.set('strictQuery', true);

if (process.env.NODE_ENV !== 'test') {
  console.log('MongoDB URI:', url);
  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'party-database',
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
const partyRouter = require('./routes/party');

app.use('/api/auth', authRouter);
app.use('/api/party', partyRouter);

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

//search movies
app.post('/api/searchMovie', async (req, res) => {
  const { search } = req.body;
  var _search = search.trim();
  try {
    const db = client.db('party-database');
    const results = await db
      .collection('movie')
      .find({ title: { $regex: _search + '.*', $options: 'i' } })
      .toArray();
    var titles = [];
    for (var i = 0; i < results.length; i++) {
      titles.push(results[i].title);
    }
    var movies = { results: titles };
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
