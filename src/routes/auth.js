const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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
    res.status(500).json({ message: 'Server error', error: e.toString() });
  }
});

//TODO: Add email verification api. Need to alter database

// Login
router.post('/login', async (req, res) => {
  // Request started
  console.log('Login request received:', req.body);
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    // Checkpoint
    console.log('User found:', user);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      // Login failed
      console.log('Invalid email or password');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // JWT token generation (uncomment if needed)
    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    //   expiresIn: '1h',
    // });

    // Login completed successfully
    console.log('Login approved.', user._id);
    res.status(200).json({
      message: 'Login successful',
      userID: user._id,
      // token, // Include token if generated
    });
  } catch (err) {
    // Error from server response
    console.error('Server error', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;