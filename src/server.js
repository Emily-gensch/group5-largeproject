require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();

// MongoDB connection
const url = process.env.MONGO_URI_PARTY;


app.use(cors({
  origin: 'https://themoviesocial-a63e6cbb1f61.herokuapp.com', // Set your allowed origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Set allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Set allowed headers
}));

app.get('/api/some-endpoint', (req, res) => {
  res.json({ message: 'This is a CORS-enabled endpoint' });
});


mongoose.set('strictQuery', true);

if (process.env.NODE_ENV !== 'test') {
  console.log('MongoDB URI:', url);
  mongoose
    .connect(url, {
      dbName: 'party-database',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));
}

// Mongoose Models
const User = require('./models/User');
const Party = require('./models/Party');
const Poll = require('./models/Poll');
const PartyGuest = require('./models/PartyMembers');
const Movie = require('./models/Movie');

app.use(bodyParser.json());
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: url,
      dbName: 'party-database',
      collectionName: 'sessions',
    }),
    cookie: {
      maxAge: 1000 * 60 * 60,
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
  })
);

// Routes
const authRouter = require('./routes/auth');
const partyRouter = require('./routes/party');
const pollRouter = require('./routes/poll');

app.use('/api/auth', authRouter);
app.use('/api/party', partyRouter);
app.use('/api/poll', pollRouter);

app.get('/', (req, res) => {
  if (!req.session.views) {
    req.session.views = 0;
  }
  req.session.views++;
  res.send(`Number of views: ${req.session.views}`);
});

app.get('/api/check-session', (req, res) => {
  res.json(req.session);
});

// Display movies
app.post('/api/displayMovies', async (req, res) => {
  try {
    const movies = await Movie.find({}).sort({ title: 1 }).exec();
    res.status(200).json(movies);
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// Display watched movies
app.post('/api/displayWatchedMovies', async (req, res) => {
  const { partyID } = req.body;
  try {
    const polls = await Poll.find({ partyID, watchedStatus: 1 });
    const movieIDs = polls.flatMap((poll) =>
      poll.movies.map((movie) => movie.movieID)
    );
    const movies = await Movie.find({ _id: { $in: movieIDs } });
    res.status(200).json(movies);
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// Search movies
app.post('/api/searchMovie', async (req, res) => {
  const { search } = req.body;
  try {
    const movies = await Movie.find({ title: new RegExp(search, 'i') });
    res.status(200).json(movies.map((movie) => movie.title));
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// Display user account
app.post('/api/userAccount', async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// Change password
app.post('/api/changePassword', async (req, res) => {
  const { userId, currentPassword, newPassword, validatePassword } = req.body;
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,32}$/;

  // Validate password match
  if (newPassword !== validatePassword) {
    return res.status(400).json({ error: 'Passwords must match' });
  }

  // Validate new password strength
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({ error: 'Password must be 8-32 characters long, contain at least one number, one special character, and one uppercase letter.' });
  }

  try {
    const user = await User.findById(userId); // Fixed variable name
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the current password is correct
    const isCurrentPasswordCorrect = bcrypt.compareSync(currentPassword, user.password);
    if (!isCurrentPasswordCorrect) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Check if the new password is the same as the old one
    const isSamePassword = bcrypt.compareSync(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ error: 'New password cannot be the same as the current password' });
    }

    // Hash and save the new password
    user.password = bcrypt.hashSync(newPassword, 8);
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
