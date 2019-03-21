const mongoose = require('mongoose');
const { Schema } = mongoose;

const TopicSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    posted_date: { type: Date, default: Date.now }
});

module.exports = Post = mongoose.model('topics', TopicSchema);