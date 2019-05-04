const logger = require('../../logger')
const auth = require('../../middlewares/auth');

const Post = require('../../models/Post');
const User = require('../../models/User');
const Comment = require('../../models/Comment');
const { transport, makeANiceEmail } = require('../../services/mail');

module.exports = app => {
  // @route   GET api/posts
  // @desc    Get All Posts
  // @access  Public
  app.get('/api/posts', async (req, res) => {

    const { page, topicId } = req.query;

    logger.debug('GET api/posts', page);

    const options = {
      page: page || 1,
      limit: 10,
      collation: {
          locale: 'en'
      },
      sort: {
        posted_date: 'descending'
      }
    };

    const posts = await Post.paginate({ _topic: topicId }, options);

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

    const { topicId, title, content, description, fileUrl } = req.body;

    if (!content || !title) return res.status(400).json({ message: "Please enter all the required fields!"});

    // Find the student
    const student = await User.findById({ _id: req.user.id });

    // Create new post.
    const newPost = await new Post({
      _user: req.user.id,
      _topic: topicId,
      title,
      description,
      content,
      fileUrl
    }).save();

    // Send email to Coordinator
    await transport.sendMail({
      from: 'service@greenwich.com',
      to: 'mc@gmail.com',
      subject: 'New contribution 🚩',
      html: makeANiceEmail(`
      Dear Mr. Marketing Coordinator
      \n\n
      <p>A new contribution has been submitted by student ${student.name}.</p>
      \n\n
      <p>Please remind that you must review, comment and approved within 14 days.</p>
      \n\n
      <p>If not, this contribution will be deleted after 14 days pending.</p>
      \n\n
      <p>Greenwich Team,</p>
      `),
    });

    return res.json(newPost);
  });

  // @route   POST api/posts/publish/:id
  // @desc    Publish a post
  // @access  Private
  app.post('/api/posts/publish/:id', auth, async (req, res) => {
    logger.debug('PUT api/posts/publish request: ', req.params.id);

    // Check the post if it published
    const existedPost = await Post.findById({ _id: req.params.id });
    if (existedPost.isPublished) return res.status(400).json({ msg: 'The post has been published!' });

    // Published
    await Post.findByIdAndUpdate({ _id: req.params.id }, { isPublished: true });
    return res.json({ msg: 'Published success!' });
  })

  // @route   DELETE api/posts/:id
  // @desc    Delete A Post
  // @access  Private
  app.delete('/api/posts/:id', auth, (req, res) => {
    Post.findById(req.params.id)
      .then(post => post.remove().then(() => res.json({ msg: 'Delete successfully!' })))
      .catch(err => res.status(404).json({ msg: 'Delete failed!' }));
  });

  // @route   POST api/posts/:id/comment
  // @desc    Comment on a Post
  // @access  Private
  app.post('/api/posts/:id/comment', auth, async (req, res) => {
    logger.debug('POST api/posts/:id/comment: ', req.params.id);

    const { content } = req.body;

    if (!content) return res.status(400).json({ message: "Please enter comment content!"});

    const newComment = await new Comment({
      _user: req.user.id,
      _post: req.params.id,
      content,
    }).save();

    return res.json(newComment);
  });
};

