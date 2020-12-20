const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;
const moment=require('moment')
//const slotSchema = require('SlotSchema.js');
//const attendanceSchema = require('AttendanceSchema.js');

const attendanceSchema = mongoose.Schema({
    date: {type: Date}
    ,time:{type:Date}
    ,dayOffBool:{type:Boolean ,default:false}
    //var datetime = new Date();
    //console.log(datetime.toISOString().slice(0,10)); ----->2020-12-18,
    ,attended:{type:Boolean, default:false},
    signedIn:{type:Boolean, default:false},
    signedOut:{type:Boolean, default:true}
   ,hours: {type:Number,default:0},
    minutes:{type:Number,default:0}
   ,last_signIn: {type:Date }
   ,last_signOut: {type:Date }
   ,day: {type: String},
   accepted_leave:{type:Boolean,default:false}
});

const slotSchema = mongoose.Schema({
    day: {type: String, required: true},
    number: {type: Number, required: true}, 
    location: {type: ObjectID, ref: 'Location', required: true},
    academic_member_id: {type: ObjectID, ref: 'AcademicStaff', required: true},
    course: {type: ObjectID, ref:'Course'}
});

const monthlyHoursSchema = mongoose.Schema({
   num:{type:Number}
   ,extraHours:{type:Number ,default:0}
   ,extraMinutes:{type:Number ,default:0}
    // ,mustAttendHours:{type:Number}
    // ,mustAttendMinutes:{type:Number}
    ,missingHours:{type:Number ,default:0},
    missingMinutes:{type:Number ,default:0},
});

const StaffMemberSchema = mongoose.Schema({
    // Personal Information.
    name: {type: String, required: true}, // No staff can change that.
    id: {type: String, required: true, unique: true}, // No staff can change that.
    email: {type: String, required: true, unique: true},
    password: {type: String, default: "123456"},
   salary: {type: Number, required: true}, // No academic member can change that.
    office: {type: ObjectID, ref: 'Location', required: true},
    gender: {type: String},

    // Login Information.
    newStaffMember: {type: Boolean, default: true},
    staff_type:{type: String, required: true},
    
    // Attendance Information.
    attendance:{type:[attendanceSchema],default:[]},
    annual_days: {type:Number},
    lastUpdatedAnnual:{type: Date},
    accidentalDaysLeft: {type:Number},
    attendCompensationDay:{type:Boolean},
    missingDays:{type:[String],default:[]},
    time_attended:{type:[monthlyHoursSchema],default:[]}
},

{
    strict: false,
    timestamps: true
});
StaffMemberSchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Staff', StaffMemberSchema);

module.exports.attendanceSchema = mongoose.model('attendance', attendanceSchema);
module.exports.monthlyHoursSchema = mongoose.model('monthlyHour', monthlyHoursSchema);