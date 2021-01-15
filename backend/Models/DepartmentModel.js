const mongoose = require('mongoose');

const FacultySchema = mongoose.Schema({
    name: {type: String, required: true, unique: true},
},
 
{
    strict: false,
    timestamps: true
});

module.exports = mongoose.model('Faculty', FacultySchema);