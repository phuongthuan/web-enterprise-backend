const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

const logger = require('../../logger');
const auth = require('../../middlewares/auth');
const jwtSecret = require('../../config/keys').secretOrKey;
const User = require('../../models/User');

module.exports = app => {

  // Admin get all users
  app.get('/api/users', auth, async (req, res) => {
    // console.log(req.user);
    const existedUser = await User.findById({ _id: req.user.id });

    // Make sure the user is an admin
    if (existedUser.roles[0] !== 'admin') {
      return res.status(403).json({ msg: `You don't have permission to do that!` });
    }

    const users = await User.find();

    return res.json(users);
  });

  // Create new user
  app.post('/api/users', (req, res) => {
    const { name, email, password, address, phone_number, roles } = req.body;

    logger.debug('POST api/users', req.body);

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
                        phone_number: user.phone_number || '',
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

  // Get all posts of the user.
  app.get('/api/users/:id/posts', auth, async (req, res) => {
    const { id } = req.params;
    logger.debug('GET api/users/:id/posts', req.params)
    try {
      const posts = await Post.find({ _user: id });
      return res.json(posts);
    } catch (error) {
      return res.status(400).json({ msg: 'User Does not exist' });
    }
  });

  // Delete a post
  app.delete('/api/users/:id', auth, (req, res) => {
      User.findById(req.params.id)
        .then(user => user.remove().then(() => res.json(user)))
        .catch(err => res.status(404).json({ msg: 'Delete failed!' }));
  });

};