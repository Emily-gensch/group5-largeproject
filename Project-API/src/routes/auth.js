const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// Register
router.post('/register', async (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  const passwordRegex =
    /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,32}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ message: 'Password does not meet criteria' });
  }

  try {
    const emailToken = jwt.sign({ data: 'Token Data' }, 'ourSecretKey');
    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      status: 0,
      emailToken: emailToken,
      emailVerifStatus: 0,
    });
    await newUser.save();
    res
      .status(201)
      .json({ message: 'User registered successfully', user: newUser });
  } catch (e) {
    res.status(500).json({ message: 'Server error', error: e.toString() });
  }
});

router.get('/check-party', async (req, res) => {
  const userID = req.session.userId;

  if (!userID) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const user = await User.findById(userID).populate('partyID');
    if (user && user.partyID) {
      res.status(200).json({ inParty: true, partyID: user.partyID._id });
    } else {
      res.status(200).json({ inParty: false });
    }
  } catch (error) {
    console.error('Error checking party membership:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

//TODO: Add email verification api. Need to alter database
// sendEmail
router.post('/sendEmail', async (req, res) => {
  const { email, emailToken } = req.body;
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'joanndinzey@gmail.com',
      pass: 'ocdr fxxd iggz vysi',
    },
  });
  transporter
    .sendMail({
      from: '"largeproject " <joanndinzey@gmail.com>',
      to: email,
      subject: 'Email Verification',
      text: `Hi! There, You have recently visited 
            our website and entered your email.
            Please follow the given link to verify your email
            https://66a1cdc4cf4a919a61f8c5f9--group5cop4331.netlify.app/verifyEmail/${emailToken} 
            Thanks`,
    })
    .then(() => {
      res.status(200).json({ message: 'email sent' });
    })
    .catch((err) => {
      res.status(500).json({ error: e.toString() });
    });
});

// verifyEmail
router.get('/verifyEmail/:emailToken', async (req, res) => {
  const { emailToken } = req.params;
  try {
    const user = await User.findOne({ emailToken });
    if (!user) {
      res.status(401).send('Email verification failed: Invalid Token');
    } else {
      user.emailVerifStatus = 1;
      user.emailToken = '';
      await user.save();
      res.status(200).send('Email verified successfully');
    }
  } catch (e) {
    res.status(500).send(e.toString());
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // if (user.emailVerifStatus === 0) {
    //   return res.status(401).json({ message: 'Email not verified' });
    // }

    // Set session
    req.session.userId = user._id;
    req.session.email = user.email;
    req.session.save((err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: 'Session save error', error: err });
      }
      res.status(200).json({ message: 'Login successful', userId: user._id });
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/check-session', (req, res) => {
  if (req.session.userId) {
    res.status(200).json({
      userId: req.session.userId,
      email: req.session.email,
    });
  } else {
    res.status(401).json({ message: 'No active session' });
  }
});

module.exports = router;
