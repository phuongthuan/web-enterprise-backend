const logger = require('../../logger')
const auth = require('../../middlewares/auth');

const Faculty = require('../../models/Faculty');
const User = require('../../models/User');
const Comment = require('../../models/Comment');

module.exports = app => {

  // Get all comments of a post
  app.get('/api/posts/comments/:id', auth, async (req, res) => {

    const comments = await Comment.find({ _post: req.params.id });

    const users = await User.find();

    return res.json(faculties);

  });
}