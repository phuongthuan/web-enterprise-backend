const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema } = mongoose;

const PostSchema = new Schema({
    _user: { type: Schema.Types.ObjectId, ref: 'User' },
    _topic: { type: Schema.Types.ObjectId, ref: 'Topic' },
    _faculty: { type: Schema.Types.ObjectId, ref: 'Faculty' },
    title: { type: String, required: true },
    content: { type: String, required: true },
    fileUrl: { type: String },
    isPublished: {
        type: Boolean,
        default: false,
    },
    posted_date: { type: Date, default: Date.now }
});

PostSchema.plugin(mongoosePaginate);

module.exports = Post = mongoose.model('posts', PostSchema);