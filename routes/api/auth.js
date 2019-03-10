const express = require('express');
const bcrypt = require('bcryptjs');
const config = require('config');
const logger = require('../../logger');

const router = express.Router();

// User Model
const User = require('../../models/User');

// @route   POST api/auth
// @desc    Auth user
// @access  Public
router.post('/', async (req, res) => {
  logger.debug('request', req.body);
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ msg: 'Please enter all fields! '});

  // Check for existing user
  try {
    const user = await User.findOne({ email });

    if(!user) return res.status(400).json({ msg: 'User Does not exist' });

  } catch (error) {

    console.log(error)
    
  }
});

module.exports = router;