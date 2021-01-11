const mongoose = require('mongoose');

const attendanceSchema = mongoose.Schema({
    date: {type: Date},
    time: {type: Date},
    dayOffBool: {type: Boolean, default: false},
    //var datetime = new Date();
    //console.log(datetime.toISOString().slice(0,10)); ----->2020-12-18,
    attended: {type: Boolean, default: false},
    signedIn: {type: Boolean, default: false},
    signedOut: {type: Boolean, default: true},
    hours: {type: Number,default: 0},
    minutes: {type: Number, default: 0},
    last_signIn: {type: Date},
    last_signOut: {type: Date},
    day: {type: String},
    accepted_leave: {type: Boolean, default: false},
    signins:[String],
    signouts:[String]
});

module.exports = attendanceSchema;
