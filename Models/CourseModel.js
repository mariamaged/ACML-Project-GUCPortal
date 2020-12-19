const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;
const slotSchema = require('./SlotSchema.js');

const CourseSchema = mongoose.Schema({
    id: {type: String, unique: true, required: true},
    name: {type: String, required: true},
    department: {type: ObjectID, ref: 'Department'}, // Not sure if it should be required.
    academic_staff: [{type: ObjectID, ref: 'AcademicStaff'}],
    slots_needed: {type: Number, default: 0}, 
    slots_covered: {type: Number, default: 0},
    schedule: [slotSchema],
    course_coordinator: {type: ObjectID, ref: 'AcademicStaff'}
},

{
    strict: false,
    timestamps: true
});

module.exports = mongoose.model('Course', CourseSchema);