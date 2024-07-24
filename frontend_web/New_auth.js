const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const axios = require('axios');

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

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,32}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: 'Password does not meet criteria' });
    }

    const emailToken = jwt.sign({ data: email }, 'ourSecretKey', { expiresIn: '1h' });
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
    try {
      const emailResponse = await axios.post('http://localhost:5001/api/auth/sendEmail', {
        email,
        emailToken
      });

      if (emailResponse.status !== 200) {
        console.error('Failed to send verification email:', emailResponse.data);
        throw new Error('Failed to send verification email');
      }
    } catch (error) {
      console.error('Failed to send verification email:', error.message);
      return res.status(500).json({ message: 'Failed to send verification email' });
    }

    res.status(201).json({ message: 'User registered successfully. Please check your email for verification instructions.' });
  } catch (e) {
    console.error('Server error during registration:', e);
    res.status(500).json({ message: 'Server error', error: e.toString() });
  }
});

// Send Email
// Send Email
router.post('/sendEmail', async (req, res) => {
  const { email, emailToken } = req.body;
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'joanndinzey@gmail.com',
      pass: 'ocdr fxxd iggz vysi', // Consider using environment variables for sensitive info
    },
  });

  try {
    await transporter.sendMail({
      from: '"largeproject" <joanndinzey@gmail.com>',
      to: email,
      subject: 'Email Verification',
      html: `Hi there! You have recently registered on our website. Please follow the link below to verify your email address:
            <a href="https://themoviesocial-a63e6cbb1f61.herokuapp.com/api/auth/verifyEmail/${emailToken}">Verify Email</a>
            <p>Thank you!</p>`,
    });
    res.status(200).json({ message: 'Email sent' });
  } catch (err) {
    console.error('Failed to send verification email:', err);
    res.status(500).json({ error: err.toString() });
  }
});

// Verify Email
router.get('/verifyEmail/:emailToken', async (req, res) => {
  const { emailToken } = req.params;

  try {
    const user = await User.findOne({ emailToken });

    if (!user) {
      return res.status(401).send(`
        <html>
          <body>
            <h2>Email verification failed</h2>
            <p>The link you clicked is invalid or has expired. Please try registering again.</p>
            <p><a href="http://localhost:3000/register">Go to Registration Page</a></p>
          </body>
        </html>
      `);
    }

    user.emailVerifStatus = 1;
    user.emailToken = '';
    await user.save();

    res.status(200).send(`
      <html>
        <body>
          <h2>Email verified successfully</h2>
          <p>Your email has been successfully verified. You can now log in to your account.</p>
          <p><a href="http://localhost:3000/login">Go to Login Page</a></p>
        </body>
      </html>
    `);
  } catch (e) {
    console.error('Error during email verification:', e);
    res.status(500).send(`
      <html>
        <body>
          <h2>Internal Server Error</h2>
          <p>There was a problem processing your email verification. Please try again later.</p>
        </body>
      </html>
    `);
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if the provided password matches the hashed password
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Proceed with login logic (e.g., setting session, generating tokens)
    req.session.userId = user._id;
    req.session.email = user.email;
    req.session.save((err) => {
      if (err) {
        return res.status(500).json({ message: 'Session save error', error: err.message });
      }
      res.status(200).json({ message: 'Login successful', userId: user._id });
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
