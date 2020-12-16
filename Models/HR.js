const { Timestamp } = require('mongodb');
const mongoose=require('mongoose');

//if we are going to rquire slot schema from another file instead of rewriting it
//const slotSchema=require('../Schemas/slot_schemas.js');


const attendaceSchema=mongoose.Schema({
     date: {type: Date}
    ,hours: {type:Number}
    ,last_sign_in: {type:Timestamp}
    ,last_sign_out: {type:Timestamp}
    ,day: {type: String}
})



const HRSchema=mongoose.Schema({
    
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

})

module.exports=mongoose.model('hr',HRSchema);
