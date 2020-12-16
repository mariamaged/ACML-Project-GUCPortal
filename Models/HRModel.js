const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;
//const attendanceSchema = require('AttendanceSchema.js');

const HRSchema = mongoose.Schema({
    // Personal Information.
    member:{type:ObjectID,ref:'Staff'},
    // Login Information.
    
    // Attendance Information.
    day_off: {type: String, enum: ['Saturday']}, // No HR member can change that.
},

{
    strict: false,
    timestamps: true
});

module.exports = mongoose.model('HR', HRSchema);
