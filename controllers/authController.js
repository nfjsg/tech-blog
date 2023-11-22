const express = require('express');
const router = express.Router();
const { User } = require('../models');
const passport = require('passport');

// Sign-up route
router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username is already taken
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username is already taken.' });
    }

    // Create a new user
    const newUser = await User.create({ username, password });

    // Log in the new user
    req.login(newUser, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      return res.status(201).json({ user: newUser, message: 'User created and logged in successfully.' });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Login route
router.post('/login', passport.authenticate('local'), (req, res) => {
  // If the login is successful, send a response
  res.status(200).json({ user: req.user, message: 'Login successful.' });
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout();
  res.status(200).json({ message: 'Logout successful.' });
});

module.exports = router;
