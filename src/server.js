require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// MongoDB connection
const url = process.env.MONGO_URI_MINE;

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

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Register
app.post('/api/auth/register', async (req, res) => {
  const { email, name, password } = req.body;

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'Email already in use' });
  }

  const passwordRegex =
    /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,32}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ error: 'Weak password' });
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      status: 0,
    });
    await newUser.save();
    res
      .status(201)
      .json({ message: 'User registered successfully', user: newUser });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// Create party
app.post('/api/party/create', authenticate, async (req, res) => {
  const { partyName, partyInviteCode } = req.body;

  try {
    const newParty = new Party({
      partyName,
      hostID: new mongoose.Types.ObjectId(req.userId),
      partyInviteCode,
    });
    await newParty.save();
    res
      .status(201)
      .json({ message: 'Party created successfully', party: newParty });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Homepage of party
app.get('/api/party/home', authenticate, async (req, res) => {
  const { partyID } = req.query;

  try {
    const party = await Party.findById(partyID).populate('hostID');
    const guests = await PartyGuest.find({ partyID }).populate('userID');
    const guestDetails = guests.map((guest) => ({
      userName: guest.userID.name,
      userEmail: guest.userID.email,
    }));

    const polls = await Poll.find({ partyID }).populate('movieID');
    const topVotedMovie = polls.sort((a, b) => b.votes - a.votes)[0];

    res.status(200).json({
      partyName: party.partyName,
      partyInviteCode: party.partyInviteCode,
      hostName: party.hostID.name,
      guests: guestDetails,
      topVotedMovie: topVotedMovie
        ? topVotedMovie.movieID.title
        : 'No votes yet',
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Join party
app.post('/api/joinParty', authenticate, async (req, res) => {
  const { partyInviteCode, userID } = req.body;
  const db = client.db('party-database');
  let error = 'none';

  const party = await db.collection('party').findOne({ partyInviteCode });
  if (!party) {
    return res.status(400).json({ error: 'Invalid code' });
  }

  const newMember = { userID, partyID: party.partyID };
  try {
    await db.collection('party-members').insertOne(newMember);
    await db.collection('users').updateOne({ userID }, { $set: { status: 1 } });
    res.status(200).json({
      userID,
      partyID: party.partyID,
      message: 'Joined party successfully',
    });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

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

// Start poll
app.post('/api/startPoll', authenticate, async (req, res) => {
  const { movieID, partyID } = req.body;
  const db = client.db('party-database');
  try {
    const newPoll = { partyID, movieID, votes: 0, watchedStatus: 0 };
    await db.collection('poll').insertOne(newPoll);
    res
      .status(201)
      .json({ partyID, movieID, message: 'Poll started successfully' });
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

// Leave party
app.post('/api/leaveParty', authenticate, async (req, res) => {
  const { userID, partyID } = req.body;
  const db = client.db('party-database');
  try {
    await db.collection('party-members').deleteOne({ userID, partyID });
    await db.collection('users').updateOne({ userID }, { $set: { status: 0 } });
    res.status(200).json({ message: 'Left party successfully' });
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
