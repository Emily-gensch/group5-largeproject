const express = require('express');
const router = express.Router();
const Party = require('../models/Party');

// Create a new party
router.post('/create', async (req, res) => {
  const { partyName, date, hostID, location } = req.body;
  try {
    const newParty = new Party({
      partyName,
      date,
      hostID,
      location,
    });
    await newParty.save();
    res.status(201).json(newParty);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all parties
router.get('/', async (req, res) => {
  try {
    const parties = await Party.find();
    res.json(parties);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
