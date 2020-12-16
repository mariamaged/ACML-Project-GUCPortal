const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;
const slotSchema = require('SlotSchema.js');
const attendanceSchema = require('AttendanceSchema.js');

const AcademicStaffSchema = mongoose.Schema({
    // Personal Information.
    name: {type: String, required: true}, // No staff can change that.
    id: {type: String, required: true, unique: true}, // No staff can change that.
    email: {type: String, required: true, unique: true},
    password: {type: String, default: "123456"},
    salary: {type: Number, required: true}, // No academic member can change that.
    office: {type: ObjectID, ref: 'Location', required: true},
    gender: {type: String},

    // Academic Information.
    department: {type: ObjectID, ref: 'Department', required: true}, // No academic member can change that.
    faculty: {type: ObjectID, ref: 'Faculty', required: true}, // No academic member can change that.
    courses: [{type: ObjectID, ref: 'Course'}],
    schedule: [slotSchema],

    // Login Information.
    type: {type: String, enum: ['Course Instructor', 'Teaching Assistant'], required: true},
    newAcademicStaffMember: {type: Boolean, default: true},
    isHOD: {type: Boolean, default: false},
    isCourseCoordinator: {type: Boolean, default: false},

    // Attendance Information.
    day_off: {type: String, enum: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']},
    attendance:[attendanceSchema],
    annual_days: {type:Number},
    lastUpdatedAnnual:{type: Date},
    accidentalDaysLeft: {type:Number},
    attendCompensationDay:{type:Boolean}
},

{
    strict: false,
    timestamps: true
});

module.exports = mongoose.model('AcademicStaff', AcademicStaffSchema);