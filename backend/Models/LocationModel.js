const mongoose = require('mongoose');

const LocationSchema = mongoose.Schema({
    id: {type: String, required: true, unique: true},
    type: {type: String, enum: ['Tutorial Room', 'Office', 'Lecture Hall','Lab'], required: true},
    maximum_capacity: {type: Number, required: true},
    current_capacity: {type: Number, default: 0}
},
 
{
    strict: false,
    timestamps: true
});

module.exports = mongoose.model('Location', LocationSchema);