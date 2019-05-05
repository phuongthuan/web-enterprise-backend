const logger = require('../../logger')
const auth = require('../../middlewares/auth');

const Topic = require('../../models/Topic');
const User = require('../../models/User');
const Faculty = require('../../models/Faculty');

module.exports = app => {

  // Get all topics
  app.get('/api/topics', auth, async (req, res) => {
    logger.debug('GET all topics: /api/topics');

    const existedUser = await User.findById({ _id: req.user.id });

     // Make sure the user is an admin
     if (existedUser.roles[0] === 'admin' || existedUser.roles[0] === 'student') {
      const topics = await Topic.find();
      return res.json(topics);
    } 
    // If the user is coordinator
    else if (existedUser.roles[0] === 'coordinator') {

      // Get faculty ID
      const faculties = await Faculty.find();
      const faculty = faculties.filter(faculty => faculty._manager.toString() === existedUser._id.toString());
      const facultyId = faculty[0]._id.toString();

      const topics = await Topic.find({ _faculty: facultyId });
      
      return res.json(topics);

    }
    else {
      return res.status(403).json({ msg: `You don't have permission to do that!` });
    }

  });

  // Get all topics by facultyID
  app.get('/api/topics/faculties/:id', auth, async (req, res) => {
    logger.debug('GET all topics by faculty: /api/topics/faculties/:id', req.params.id);

    const topics = await Topic.find({ _faculty: req.params.id });

    return res.json(topics);
    
  });

  // Create new topic
  app.post('/api/topics', auth, async (req, res) => {
    logger.debug('CREATE a topic: /api/topics', req.body);

    const existedUser = await User.findById({ _id: req.user.id });

    const faculties = await Faculty.find();

    const faculty = faculties.filter(faculty => faculty._manager.toString() === existedUser._id.toString());

    const facultyId = faculty[0]._id.toString();

    // Make sure the user is an admin
    if (existedUser.roles[0] === 'coordinator') {
      const { name, description } = req.body;

      const newTopic = await new Topic({
        _faculty: facultyId,
        name,
        description
      }).save();
  
      return res.json(newTopic);
    } else {
      return res.status(403).json({ msg: `You don't have permission to do that!` });
    }
    
  });

  // Delete a topic
  app.delete('/api/topics/:id', auth, async (req, res) => {

    logger.debug('DELETE a topic: /api/topics/:id', req.params.id);

    const existedUser = await User.findById({ _id: req.user.id });

    // Make sure user is an admin or coordinator
    if (existedUser.roles[0] === 'coordinator' || existedUser.roles[0] === 'admin') {

      Topic.findById({ _id: req.params.id })
      .then(post => post.remove().then(() => res.json({ msg: 'Delete successfully!' })))
      .catch(err => res.status(404).json({ msg: 'Delete failed!' }));
      
    } else {
      return res.status(403).json({ msg: `You don't have permission to do that!` });
    }

  });

};