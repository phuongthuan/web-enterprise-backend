const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const logger = require('../../logger');

const jwtSecret = require('../../config/keys').secretOrKey;
// User Model
const User = require('../../models/User');

module.exports = app => {

  // @route   POST api/users
  // @desc    Register new user
  // @access  Public
  app.post('/api/users', (req, res) => {
    const { name, email, password, address, phone_number, roles } = req.body;

    // Simple validation
    if(!name || !email || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // Check for existing user
    User.findOne({ email })
      .then(user => {
        if(user) return res.status(400).json({ msg: 'User already exists' });

        const newUser = new User({
          name,
          email,
          password,
          phone_number,
          address,
          roles
        });

        // Create salt & hash
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => {
                jwt.sign(
                  { id: user.id },
                  jwtSecret,
                  { expiresIn: "1d" },
                  (err, token) => {
                    if(err) throw err;
                    res.json({
                      token,
                      user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        address: user.address || '',
                        roles: user.roles,
                      }
                    });
                  }
                )
              });
          })
        })
      })
  });

  // @route   GET api/users/:id/posts
  // @desc    Get All Posts of Users
  // @access  Public
  app.get('/api/users/:id/posts', async (req, res) => {
    const { id } = req.params;
    logger.debug('GET api/users/:id/posts', req.params)
    try {
      const posts = await Post.find({ _user: id });
      return res.json(posts);
    } catch (error) {
      return res.status(400).json({ msg: 'User Does not exist' });
    }
  });

};