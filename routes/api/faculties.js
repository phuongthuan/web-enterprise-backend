const logger = require('../../logger')
const auth = require('../../middlewares/auth');

const Faculty = require('../../models/Faculty');
const User = require('../../models/User');

module.exports = app => {

  // Get all faculties
  app.get('/api/faculties', auth, async (req, res) => {
    logger.debug('GET all faculties: /api/faculties');
    const faculties = await Faculty.find();
    
    let sumPost = 0;

    const facultiesWithContributions = faculties.map(async faculty => {
      const posts = await Post.find({ _faculty: faculty._id });

      sumPost += posts.length;

      return {
        ...faculty._doc,
        count: posts.length,
      }
    });

    const results = await Promise.all(facultiesWithContributions);


    return res.json({ faculties: results, totalPost: sumPost });

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

  app.delete('/api/faculties', auth, async (req, res) => {
    logger.debug('DELETE a faculty: /api/faculties', req.params.id);

    const existedUser = await User.findById({ _id: req.user.id });

    // Make sure user is an admin or coordinator
    if (existedUser.roles[0] === 'manager' || existedUser.roles[0] === 'admin') {

      Faculty.findById({ _id: req.params.id })
      .then(post => post.remove().then(() => res.json({ msg: 'Delete successfully!' })))
      .catch(err => res.status(404).json({ msg: 'Delete failed!' }));
      
    } else {
      return res.status(403).json({ msg: `You don't have permission to do that!` });
    }

  });

};