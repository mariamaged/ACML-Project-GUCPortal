const mongoose = require('mongoose');

const attendanceSchema = mongoose.Schema({
    date: {type: String}
    ,time:{time:Date}
    //var datetime = new Date();
    //console.log(datetime.toISOString().slice(0,10)); ----->2020-12-18
   ,hours: {type:Number}
   ,last_signIn: {type:Date }
   ,last_signOut: {type:Date }
   ,day: {type: String}
});

modules.exports = AttendanceSchema;
