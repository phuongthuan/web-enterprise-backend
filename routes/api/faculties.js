const logger = require('../../logger')
const auth = require('../../middlewares/auth');

const Faculty = require('../../models/Faculty');
const User = require('../../models/User');

module.exports = app => {
  /**
  |--------------------------------------------------
  | GET all topics: /api/faculties
  |--------------------------------------------------
  */
  app.get('/api/faculties', auth, async (req, res) => {
    logger.debug('GET all faculties: /api/faculties');

    const existedUser = await User.findById({ _id: req.user.id });

    // Make sure the user is an admin or manager.
    if ((existedUser.roles[0] === 'admin') || (existedUser.roles[0] === 'manager')) {
      const faculties = await Faculty.find();
      return res.json(faculties);
    } else {
      return res.status(403).json({ msg: `You don't have permission to do that!` });
    }

  });

  // Create new faculty
  app.post('/api/faculties', auth, async (req, res) => {
    logger.debug('CREATE a faculty: /api/faculties', req.body);

    const existedUser = await User.findById({ _id: req.user.id });

    // Make sure the user is an admin or manager.
    if ((existedUser.roles[0] === 'admin') || (existedUser.roles[0] === 'manager')) {
      const { name, managerId } = req.body;

      const newFaculty = await new Faculty({
        _manager: managerId,
        name
      }).save();

      return res.json(newFaculty);

    } else {
      return res.status(403).json({ msg: `You don't have permission to do that!` });
    }
    
  });

};