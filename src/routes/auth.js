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
    const emailToken = jwt.sign({ email }, 'ourSecretKey', { expiresIn: '1d' });
    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      status: 0,
      emailToken,
      emailVerifStatus: 0,
    });
    await newUser.save();

    // Send verification email
    await sendVerificationEmail(email, emailToken);

    res.status(201).json({ message: 'User registered successfully. Please check your email for verification.' });
  } catch (e) {
    res.status(500).json({ message: 'Server error', error: e.toString() });
  }
});

// Function to send verification email
const sendVerificationEmail = async (email, emailToken) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'your-email@gmail.com', // Update with your email
      pass: 'your-email-password', // Update with your email password
    },
  });

  await transporter.sendMail({
    from: '"Your Project" <your-email@gmail.com>',
    to: email,
    subject: 'Email Verification',
    text: `Hi! You have recently registered on our website. Please follow the link to verify your email:
      https://yourdomain.com/verifyEmail/${emailToken}
      Thanks!`,
  });
};

// Verify Email
router.get('/verifyEmail/:emailToken', async (req, res) => {
  const { emailToken } = req.params;

  try {
    const decoded = jwt.verify(emailToken, 'ourSecretKey');
    const user = await User.findOne({ emailToken });

    if (!user) {
      return res.status(401).send('Email verification failed: Invalid Token');
    }

    await User.updateOne(
      { emailToken },
      { $set: { emailVerifStatus: 1, emailToken: '' } }
    );

    res.status(200).send('Email verified successfully');
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

    if (user.emailVerifStatus === 0) {
      return res.status(401).json({ message: 'Email not verified' });
    }

    // Set session
    req.session.userId = user._id;
    req.session.email = user.email;
    req.session.save((err) => {
      if (err) {
        return res.status(500).json({ message: 'Session save error', error: err });
      }
      res.status(200).json({ message: 'Login successful', userId: user._id });
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Check Session
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
