const mongoose = require('mongoose');
const { Schema } = mongoose;

const TopicSchema = new Schema({
    _faculty: { type: Schema.Types.ObjectId, ref: 'Faculty' },
    name: { type: String, required: true },
    description: { type: String },
    posted_date: { type: Date, default: Date.now }
});

module.exports = Topic = mongoose.model('topics', TopicSchema);