const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Login a user
router.post('/login', async (req, res) => {
  const { login, password } = req.body;
  try {
    const user = await User.findOne({ login, password });
    if (user) {
      res.status(200).json({ message: 'Login successful', user });
    } else {
      res.status(401).json({ message: 'Invalid login or password' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
