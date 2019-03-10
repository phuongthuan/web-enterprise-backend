const express = require('express');
const router = express.Router();
const logger = require('../../logger')

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
router.post('/', async (req, res) => {
  logger.debug('request: ', req.body);
  const { title, content, description, fileUrl } = req.body;

  if (!content || !title) return res.status(400).json({ message: "Please enter all the required fields!"});

  const newPost = await new Post({
    title,
    description,
    content,
    fileUrl
  }).save();

  return res.json(newPost);
});

module.exports = router;

