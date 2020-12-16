const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;
const attendanceSchema = require('AttendanceSchema.js');

const HRSchema = mongoose.Schema({
    // Personal Information.
    name: {type: String, required: true}, // No staff can change that.
    id: {type: String, required: true, unique: true}, // No staff can change that.
    email: {type: String, required: true, unique: true},
    password: {type: String, default: "123456"},
    salary: {type: Number, required: true}, // No academic member can change that.
    office: {type: ObjectID, ref: 'Location', required: true},
    gender: {type: String},

    // Login Information.
    newHRMember: {type: Boolean, default: true},
    
    // Attendance Information.
    day_off: {type: String, enum: ['Saturday']}, // No HR member can change that.
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

module.exports = mongoose.model('HR', HRSchema);
