const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;
const CounterModel = require('./CounterModel.js');
const attendanceSchema = require('./AttendanceSchema.js');
const monthlyHoursSchema = require('./MonthlyHoursSchema.js');

const StaffMemberSchema = mongoose.Schema({
    // Personal Information.
    name: {type: String, required: true}, // No staff can change that.
    id: {type: String, unique: true}, // No staff can change that.
    email: {type: String, required: true, unique: true},
    password: {type: String, default: "123456"},
    salary: {type: Number, required: true}, // No academic member can change that.
    office: {type: ObjectID, ref: 'Location', required: true},
    gender: {type: String, required: true, enum: ['Male', 'Female']},

    // Login Information.
    newStaffMember: {type: Boolean, default: true},
    staff_type: {type: String, enum: ['HR', 'Academic Member'], required: true},
    
    // Attendance Information.
    attendance: {type: [attendanceSchema], default:[]},
    annual_days: {type: Number},
    lastUpdatedAnnual: {type: Date},
    accidentalDaysLeft: {type:Number, default:6},
    attendCompensationDay: {type: Boolean},
    missingDays: {type: [String], default: []},
    time_attended: {type: [monthlyHoursSchema], default: []},
    // requestsReceived:[{type: ObjectID, ref: 'request'}],
    // requestsSent:[{type: ObjectID, ref: 'request'}],
    lastUpdatedAnnual: {type: Date},
    accidentalDaysLeft: {type:Number},
    attendCompensationDay: {type:Boolean},
    notifications: [{type: String, default: []}]
},

{
    strict: false,
    timestamps: true
});

module.exports = mongoose.model('Staff', StaffMemberSchema);