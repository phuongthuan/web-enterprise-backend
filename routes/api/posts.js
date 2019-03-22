const logger = require('../../logger')
const auth = require('../../middlewares/auth');

const Post = require('../../models/Post');

module.exports = app => {
  // @route   GET api/posts
  // @desc    Get All Posts
  // @access  Public
  app.get('/api/posts', async (req, res) => {
    logger.debug('GET api/posts')
    const posts = await Post.find({});
    return res.json(posts);
  });

  // @route   GET api/posts/:id
  // @desc    Get A Post
  // @access  Public
  app.get('/api/posts/:id', async (req, res) => {
    const { id } = req.params;
    logger.debug('GET api/posts/:id ', req.params)
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
  app.post('/api/posts', auth, async (req, res) => {
    logger.debug('request: ', req.user);

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

  // @route   PUT api/posts/publish
  // @desc    Publish a post
  // @access  Private
  app.put('/api/posts/:id', auth, async (req, res) => {
    logger.debug('PUT api/posts/publish request: ', req.params);

    // Check the post if it published
    const existedPost = await Post.findById({ _id: req.params.id });
    if (existedPost.isPublished) return res.status(400).json({ msg: 'The post has been published!' });

    // Published
    await Post.findByIdAndUpdate({ _id: req.params.id }, { isPublished: true });
    return res.json({ msg: 'Published success!' });
  });

  // @route   DELETE api/posts/:id
  // @desc    Delete A Post
  // @access  Private
  app.delete('/api/posts/:id', auth, (req, res) => {
    Post.findById(req.params.id)
      .then(post => post.remove().then(() => res.json({ msg: 'Delete successfully!' })))
      .catch(err => res.status(404).json({ msg: 'Delete failed!' }));
  });
};

