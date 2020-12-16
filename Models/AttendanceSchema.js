const mongoose = require('mongoose');

const AttendanceSchema = mongoose.Schema({
    date: {type: Date}
   ,hours: {type:Number}
   ,last_signIn: {type:Timestamp}
   ,last_signOut: {type:Timestamp}
   ,day: {type: String}
});

modules.exports = AttendanceSchema;
