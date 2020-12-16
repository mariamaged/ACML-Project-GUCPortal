const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');

const CourseSchema = mongoose.Schema({
    id: {type: Number},
    name: {type: String},
    department: {type: ObjectID, ref: 'Department'},
    slots_needed: {type: Number},
    slots_covered: {type: Number}
},

{
    strict: false,
    timestamps: true
})

module.exports.model = mongoose.model('Course', CourseSchema);
module.exports.schema = CourseSchema;