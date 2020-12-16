const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;

const CourseSchema = mongoose.Schema({
    id: {type: String, unique: true, required: true},
    name: {type: String, required: true},
    department: {type: ObjectID, ref: 'Department'}, // Not sure if it should be required.
    TAs: [{type: ObjectID, ref: 'TA'}],
    CourseInstructors: [{type: ObjectID, ref: 'CourseInstructor'}],
    slots_needed: {type: Number, min: 1, required: true}, 
    slots_covered: {type: Number, default: 0}
},

{
    strict: false,
    timestamps: true
});

module.exports.model = mongoose.model('Course', CourseSchema);
module.exports.schema = CourseSchema;