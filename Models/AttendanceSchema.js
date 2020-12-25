const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');

const AttendanceSchema = mongoose.Schema({
    date: {type: Date}
   ,hours: {type:Number}
   ,last_signIn: {type:Timestamp}
   ,last_signOut: {type:Timestamp}
   ,day: {type: String},
   signins:[String],
   signouts:[String]
});

modules.exports = AttendanceSchema;
