const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentSchema = new Schema({
    _user: { type: Schema.Types.ObjectId, ref: 'User' },
    _post: { type: Schema.Types.ObjectId, ref: 'Post' },
    content: { type: String, required: true },
    posted_date: { type: Date, default: Date.now }
});

module.exports = Post = mongoose.model('comments', CommentSchema);