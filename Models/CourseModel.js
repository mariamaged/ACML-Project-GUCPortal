const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');

const CourseSchema = mongoose.Schema({
    id: {type: Number, unique: true, required: true}, // I think ID should be String. For example, "CSEN703".
    name: {type: String, required: true},
    department: {type: ObjectID, ref: 'Department'}, // Not sure if it should be required.
    slots_needed: {type: Number, min: 1, required: true}, 
    slots_covered: {type: Number, default: 0}
},

{
    strict: false,
    timestamps: true
})

module.exports.model = mongoose.model('Course', CourseSchema);
module.exports.schema = CourseSchema;