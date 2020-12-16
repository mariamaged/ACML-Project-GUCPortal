const mongoose = require('mongoose');

const FacultySchema = mongoose.Schema({
    name: {type: String, required: true, unique: true},
    // Not sure if I should keep track of departments under the faculty.
}

, {
    strict: false,
    timestamps: true
});

module.exports = mongoose.model('Faculty', FacultySchema);