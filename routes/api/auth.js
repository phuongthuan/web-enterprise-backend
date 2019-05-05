const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middlewares/auth');
const logger = require('../../logger');

const jwtSecret = require('../../config/keys').secretOrKey;
// User Model
const User = require('../../models/User');

module.exports = app => {
  // @route   POST api/auth
  // @desc    Auth user
  // @access  Public
  app.post('/api/auth', (req, res) => {
    const { email, password } = req.body;
    logger.debug('POST api/auth', req.body);

    // Simple validation
    if(!email || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // Check for existing user
    User.findOne({ email })
      .then(user => {
        if(!user) return res.status(400).json({ msg: 'User Does not exist' });

        // Validate password
        bcrypt.compare(password, user.password)
          .then(isMatch => {
            if(!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

            jwt.sign(
              { id: user.id },
              jwtSecret,
              { expiresIn: "365d" },
              (err, token) => {
                if(err) throw err;
                res.json({
                  token,
                  user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    address: user.address || '',
                    roles: user.roles
                  }
                });
              }
            )
          })
      })
  });

  // Load user
  app.get('/api/auth/user', auth, (req, res) => {
    logger.debug('GET api/auth/user', req.user)
    User.findById(req.user.id)
      .select('-password')
      .then(user => res.json(user));
  });
};