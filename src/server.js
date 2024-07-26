require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const app = express();

// MongoDB connection
const url = 'mongodb+srv://lyrenee02:tSGwv9viMBFajw3u@cluster.muwwbsd.mongodb.net/party-database?retryWrites=true&w=majority';

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

app.use(
  cors({
    origin: 'https://socialmoviebackend-4584a07ae955.herokuapp.com',
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(express.json());

app.use(
  session({
    secret: 'e89d35b3747d1f046e14a882dfc781b936eb511a8ffbec71d777b4e6da365fa8',
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
      secure: false,
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

// Get party members
app.get('/getPartyMembers', async (req, res) => {
  const userID = req.session.userId;

  if (!userID) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const partyMember = await PartyGuest.findOne({ userID }).populate('partyID');

    if (!partyMember) {
      return res.status(404).json({ message: 'Party not found' });
    }

    const members = await PartyGuest.find({
      partyID: partyMember.partyID._id,
    }).populate('userID', 'username email');

    const currentUser = await User.findById(userID).select('username email');

    res.status(200).json({ members, currentUser });
  } catch (error) {
    console.error('Error fetching party members:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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
  const { userID } = req.body;
  try {
    const user = await User.findById(userID);
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
  const { userID, newPassword, validatePassword } = req.body;
  const passwordRegex =
    /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,32}$/;

  if (newPassword !== validatePassword) {
    return res.status(400).json({ error: 'Passwords must match' });
  }
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({ error: 'Weak password' });
  }

  try {
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const isSamePassword = bcrypt.compareSync(newPassword, user.password);
    if (isSamePassword) {
      return res
        .status(400)
        .json({ error: 'Password matches current password' });
    }
    user.password = bcrypt.hashSync(newPassword, 8);
    await user.save();
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// Send reset password email
app.post('/api/sendResetPassEmail', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email' });
    }
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const passToken = jwt.sign({ data: 'Pass Token' }, 'PassTokenKey', { expiresIn: '24h' });
    await transporter.sendMail({
      from: '"largeproject " <themoviesocial@gmail.com>',
      to: email,
      subject: 'Password Reset Request',
      text: `Hi! There, You can reset your password 
            by clicking the link below:
            https://socialmoviebackend-4584a07ae955.herokuapp.com/api/resetPassword/${passToken}/${email}
            Thanks`,
    });
    res.status(200).json({ message: 'email sent' });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// Reset password verify and redirect
app.get('/api/resetPassword/:passToken/:email', async (req, res) => {
  const { passToken, email } = req.params;
  try {
    // Verifying the JWT token 
    jwt.verify(passToken, 'PassTokenKey', function (err, decoded) {
      if (err) {
        return res.status(401).send(`
          <html>
            <body>
              <h2>Reset password failed</h2>
              <p>The link you clicked is invalid or has expired. </p>
              <p><a href="https://socialmoviebackend-4584a07ae955.herokuapp.com/login">Go to Login Page</a></p>
            </body>
          </html>
        `);
      }
      const url = new URL("https://socialmoviebackend-4584a07ae955.herokuapp.com/RESET_PASSWORD_PAGE?email=" + email);
      res.status(200).send(`
        <html>
          <head>
            <title>Redirecting to another page</title>
            <!-- Redirecting to another page using meta tag -->
            <meta http-equiv="refresh" content="1; url = ${url} " />
          </head>
          <body>
            <h3>
              Redirecting to another page
            </h3>
            <p><strong>Note:</strong> If your browser supports Refresh, you'll be
              redirected to the Reset Password Page. 
            </p>
            <p>If you are not redirected in 5 seconds, click the link below:
              <a href="${url}" target="_blank">click here</a>
            </p>
          </body>
        </html>`
      );
    });
  } catch (e) {
    console.error('Error during reset password:', e);
    res.status(500).send(`
      <html>
        <body>
          <h2>Internal Server Error</h2>
          <p>There was a problem processing your password reset. Please try again later.</p>
        </body>
      </html>
    `);
  }
});

// Reset password with email
app.post('/api/resetPass', async (req, res) => {
  const { email, newPassword, validatePassword } = req.body;
  const passwordRegex =
    /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,32}$/;

  if (newPassword !== validatePassword) {
    return res.status(400).json({ error: 'Passwords must match' });
  }
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({ error: 'Weak password' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const isSamePassword = bcrypt.compareSync(newPassword, user.password);
    if (isSamePassword) {
      return res
        .status(400)
        .json({ error: 'Password matches current password' });
    }
    user.password = bcrypt.hashSync(newPassword, 8);
    await user.save();
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
