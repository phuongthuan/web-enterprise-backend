const logger = require('../../logger')
const auth = require('../../middlewares/auth');

const Post = require('../../models/Post');
const Topic = require('../../models/Topic');
const User = require('../../models/User');
const Comment = require('../../models/Comment');
const { transport, makeANiceEmail } = require('../../services/mail');
const ObjectID = require("mongodb").ObjectID

module.exports = app => {

  // Get all posts
  app.get('/api/posts', auth, async (req, res) => {

    const { page, topicId } = req.query;

    const existedUser = await User.findById({ _id: req.user.id });

    if (existedUser.roles[0] === 'student') {
      const posts = await Post.find({ _user: req.user.id });

      const topics = await Topic.find();

      const users = await User.find();

      const postsWithTopic = posts
        .map(post => {
          const author = users.find(user => user._id.toString() === post._user.toString());
          const topicName = topics.find(topic => topic._id.toString() === post._topic.toString());
          
          return { 
            ...post._doc, 
            _user: { name: author.name, roles: author.roles },
            _topic: { name: topicName.name } 
          }
        });

      return res.json(postsWithTopic);

    } else if (existedUser.roles[0] === 'coordinator') {
      const posts = await Post.find({ _topic: topicId });

      const users = await User.find();

      const postsWithUser = posts
        .map(post => {
          const author = users.find(user => user._id.toString() === post._user.toString());
          return { ...post._doc, _user: { name: author.name, roles: author.roles } }
        });

      return res.json(postsWithUser);

    } else {

      const posts = await Post.find();

      const topics = await Topic.find();

      const users = await User.find();

      const postsWithTopic = posts
        .map(post => {

          const author = users.find(user => user._id.toString() === post._user.toString());
          const topicName = topics.find(topic => ObjectID(topic._id).toString() === ObjectID(post._topic).toString());

          return {
            ...post._doc, 
            _user: { name: author.name, roles: author.roles },
            _topic: { topicName }
          }
        });

      return res.json(postsWithTopic);
    }

  });

  // Get a post
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

  // Create a new post
  app.post('/api/posts', auth, async (req, res) => {
    logger.debug('request: ', req.user);

    const { topicId, title, content, fileUrl } = req.body;

    if (!content || !title) return res.status(400).json({ message: "Please enter all the required fields!"});

    // Find the student
    const student = await User.findById({ _id: req.user.id });

    // Create new post.
    const newPost = await new Post({
      _user: req.user.id,
      _topic: topicId,
      title,
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

  // Publish a post
  app.get('/api/posts/publish/:id', auth, async (req, res) => {
    logger.debug('PUT api/posts/publish request: ', req.params.id);

    // Check the post if it published
    const existedPost = await Post.findById({ _id: req.params.id });
    if (existedPost.isPublished) return res.status(400).json({ msg: 'The post has been published!' });

    // Published
    await Post.findByIdAndUpdate({ _id: req.params.id }, { isPublished: true });
    return res.json({ msg: 'Published success!' });
  })

  // Delete a post
  app.delete('/api/posts/:id', auth, (req, res) => {
    Post.findById(req.params.id)
      .then(post => post.remove().then(() => res.json({ msg: 'Delete successfully!' })))
      .catch(err => res.status(404).json({ msg: 'Delete failed!' }));
  });

  // Comment on a post
  app.post('/api/posts/:id/comments', auth, async (req, res) => {
    logger.debug('POST api/posts/:id/comments: ', req.params.id);

    const { content } = req.body;

    if (!content) return res.status(400).json({ message: 'Please enter comment content!' });

    const newComment = await new Comment({
      _user: req.user.id,
      _post: req.params.id,
      content,
    }).save();

    const userComment = await User.findById({ _id: req.user.id });

    const commentWithUser = { ...newComment._doc, _user: { email: userComment.email, roles: userComment.roles }}

    return res.json(commentWithUser);
  });

  // Get all comments of a post (with user name)
  app.get('/api/posts/:id/comments', auth, async (req, res) => {
    const comments = await Comment.find({ _post: req.params.id });

    const users = await User.find();

    const commentsWithUsername = comments.map(comment => {
      const userComment = users.find(user => user._id.toString() === comment._user.toString());
      return { ...comment._doc, _user: { email: userComment.email, roles: userComment.roles } }
    });

    return res.json(commentsWithUsername);
  });

  // Count number of post in 
  app.get('/api/count/faculties/:id/posts', auth, async (req, res) => {

    const topics = await Topic.find({ _faculty: req.params.id });

    let sum = 0;

    const numberOfPosts = topics.map(async topic => {
      const postCount = await Post.countDocuments({ _topic: topic._id });
      sum = sum + postCount;
      return topic;
    });

    console.log(sum);

    return res.json(numberOfPosts);

  });

};

