const mongoose = require('mongoose');
const { Schema } = mongoose;

const FacultySchema = new Schema({
    _manager: { type: Schema.Types.ObjectId, ref: 'User' }, // Faculty Manager
    name: { type: String, required: true }, // Faculty Name
    posted_date: { type: Date, default: Date.now }
});

module.exports = Faculty = mongoose.model('faculties', FacultySchema);