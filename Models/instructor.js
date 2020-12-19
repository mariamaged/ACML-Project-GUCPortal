const { Timestamp } = require('mongodb');
const mongoose=require('mongoose');
//const slotSchema=require('../Schemas/slot_schemas.js');

// const requestSchema=mongoose.Schema({

//     reqType:{type: String},
//     date:{type: date}
// })

const courseSchema=mongoose.Schema({
    id:{type: Number}
    ,name: {type:String}
    ,slots_needed:{type: Number}
    ,slots_covered: {type:Number}
})

const slotSchema=mongoose.Schema({
    day:{type: String}
    ,number: {type:Number}
    ,location:{type:String}
    ,academic_member_id: {type:String}
    ,course_id: {type:Number}
})

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



const instSchema=mongoose.Schema({
    
    name:{type: String}
    ,id: {type:String}
    ,password: {type:String}
    ,email: {type:String}
    ,salary: {type:Number}
    ,day_off: {type:String}
    ,type: {type:String}
    ,office: {type:String}
    ,attendance:[attendaceSchema]
    ,gender: {type:String}
    ,annual_days: {type:Number}
    ,last_updated_annual:{type: Date}
    ,accidental_days_left: {type:Number}
    ,attendCompensationDay:{type:Boolean}

    ,schedule:[slotSchema]

    //NEED TO REFERENCE THESE ATTRIBUTES
    ,department: {type:Schema.Types.ObjectID, ref:'department'}
    ,faculty: {type:String}
    ,courses:[courseSchema]
    ///-------------------------------------------

    // ,sent_requests: [requestSchema]
    // ,recieved_requests:[requestSchema]
})

module.exports=mongoose.model('instructor',instSchema);
