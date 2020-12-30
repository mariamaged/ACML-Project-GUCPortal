const mongoose = require('mongoose');

const monthlyHoursSchema = mongoose.Schema({
    num: {type: Number},
    yearNum: {type: Number},
    extraHours: {type: Number, default: 0},
    extraMinutes:{type: Number, default: 0},
 // mustAttendHours: {type: Number},
 // mustAttendMinutes: {type: Number},
    missingHours: {type: Number, default: 0},
    missingMinutes: {type: Number, default: 0},
});

module.exports = monthlyHoursSchema;