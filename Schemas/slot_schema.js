const mongoose=require('mongoose');

const slotSchema=mongoose.Schema({
    day:{type: String}
    ,number: {type:Number}
    ,location:{type:String}
    ,academic_member_id: {type:String}
    ,course_id: {type:Number}
})

modules.export=slotSchema;