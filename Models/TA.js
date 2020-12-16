const { Timestamp } = require('mongodb');
const mongoose=require('mongoose');

//if we are going to rquire slot schema from another file instead of rewriting it
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

const attendaceSchema=mongoose.Schema({
     date: {type: Date}
    ,hours: {type:Number}
    ,last_sign_in: {type:Timestamp}
    ,last_sign_out: {type:Timestamp}
    ,day: {type: String}
})



const TASchema=mongoose.Schema({
    
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
    ,department: {type:String}
    ,faculty: {type:String}
    ,courses:[courseSchema]

    // ,sent_requests: [requestSchema]
    // ,recieved_requests:[requestSchema]
})

module.exports=mongoose.model('TA',TASchema);
