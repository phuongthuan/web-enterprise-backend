const logger = require('../../logger')
const auth = require('../../middlewares/auth');

const Topic = require('../../models/Topic');

module.exports = app => {


  /**
  |--------------------------------------------------
  | GET all topics: /api/topics
  |--------------------------------------------------
  */
  app.get('/api/topics', async (req, res) => {
    logger.debug('GET all topics: /api/topics');
    const topics = await Topic.find({});

    return res.json(topics);
  });

  /**
  |--------------------------------------------------
  | CREATE a topic: /api/topics
  |--------------------------------------------------
  */
  app.post('/api/topics', auth, async (req, res) => {
    logger.debug('CREATE a topic: /api/topics', req.body);
    const { name, description } = req.body;
    const newTopic = await new Topic({
      name,
      description
    }).save();

    return res.json(newTopic);
  });

};