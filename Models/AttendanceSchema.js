const mongoose = require('mongoose');

const attendanceSchema = mongoose.Schema({
    date: {type: Date}
   ,hours: {type:Number}
   ,last_signIn: {type:Date ,default:Date.now}
   ,last_signOut: {type:Date ,default:Date.now}
   ,day: {type: String}
});

module.exports = attendanceSchema;
