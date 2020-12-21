const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;
const slotSchema = require('./SlotSchema.js');

const AcademicStaffSchema = mongoose.Schema({
    // Personal Information.
   member:{type:ObjectID,ref:'Staff'},

    // Academic Information.
    department: {type: ObjectID, ref: 'Department', required: true}, // No academic member can change that.
    faculty: {type: ObjectID, ref: 'Faculty', required: true}, // No academic member can change that.
    courses: [{type: ObjectID, ref: 'Course'}],
    schedule: [slotSchema],

    // Login Information.
    type: {type: String, enum: ['Course Instructor', 'Teaching Assistant'], required: true},
    isHOD: {type: Boolean, default: false},
    isCourseCoordinator: {type: Boolean, default: false},

    // Attendance Information.
    day_off: {type: String, enum: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']},

},

{
    strict: false,
    timestamps: true
});

module.exports = mongoose.model('AcademicStaff', AcademicStaffSchema);