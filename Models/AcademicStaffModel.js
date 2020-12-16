const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;
//const slotSchema = require('SlotSchema.js');
//const attendanceSchema = require('AttendanceSchema.js');


const attendanceSchema = mongoose.Schema({
    date: {type: Date}
   ,hours: {type:Number}
   ,last_signIn: {type:Date ,default:Date.now}
   ,last_signOut: {type:Date ,default:Date.now}
   ,day: {type: String}
});

const slotSchema = mongoose.Schema({
    day: {type: String, required: true},
    number: {type: Number, required: true}, 
    location: {type: ObjectID, ref: 'Location', required: true},
    academic_member_id: {type: ObjectID, ref: 'AcademicStaff', required: true},
    course: {type: ObjectID, ref:'Course'}
});


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
    day_off: {type: String, enum: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']},

},

{
    strict: false,
    timestamps: true
});

module.exports = mongoose.model('AcademicStaff', AcademicStaffSchema);