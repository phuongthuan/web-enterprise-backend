const express = require('express');
const router = express.Router();
const logger = require('../../logger')
const auth = require('../../middlewares/auth');

const Post = require('../../models/Post');

// @route   GET api/posts
// @desc    Get All Posts
// @access  Public
router.get('/', async (req, res) => {
  const posts = await Post.find({});
  return res.json(posts);
});

// @route   GET api/posts/:id
// @desc    Get A Post
// @access  Public
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  logger.debug('request: ', req.params)
  try {
    const post = await Post.findById(id);
    return res.json(post);
  } catch (error) {
    return res.status(400).json({ msg: 'Post Does not exist' });
  }
});

// @route   POST api/posts
// @desc    Create A Post
// @access  Private
router.post('/', auth, async (req, res) => {
  logger.debug('request: ', req.user.id);

  const { title, content, description, fileUrl } = req.body;

  if (!content || !title) return res.status(400).json({ message: "Please enter all the required fields!"});

  const newPost = await new Post({
    _user: req.user.id,
    title,
    description,
    content,
    fileUrl
  }).save();

  return res.json(newPost);
});

// @route   DELETE api/posts/:id
// @desc    Delete A Post
// @access  Private
router.delete('/:id', auth, (req, res) => {
  Post.findById(req.params.id)
    .then(post => post.remove().then(() => res.json({ success: true })))
    .catch(err => res.status(404).json({ success: false }));
});

module.exports = router;

