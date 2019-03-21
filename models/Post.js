const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
    _user: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    content: { type: String, required: true },
    description: String,
    fileUrl: { type: String },
    posted_date: { type: Date, default: Date.now }
});

module.exports = Post = mongoose.model('posts', PostSchema);