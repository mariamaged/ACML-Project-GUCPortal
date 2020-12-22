const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;
const StaffMemberModel = require('../Models/StaffMemberModel.js');

const requestSchema=mongoose.Schema({
   //for all requests
   reqType:{type:String},
   sentBy:{type: ObjectID, ref: 'StaffMemberModel'},
   sentTo:{type: ObjectID, ref: 'StaffMemberModel'},
   state:{type:String},
   submission_date:{type:Date},
    
   //change day off
   newDayOff:{type:String , enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday', 'Sunday']},
    
    //for replacement request
    slotDate:{type:Date},
    slotNum:{type:Number},
    slotLoc:{type:String},
    replacementStaff:{type: ObjectID, ref: 'StaffMemberModel'},

    //for slot linking
    slotDay:{type:String , enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday', 'Sunday']}
    ,courseID:{type:String}
    
    //for other requests
    ,reason:{type:String},
    accidentDate:{type:Date},
    medicalDoc:{type:String},
    maternityDoc:{type:String},
    sickDay:{type:Date},
})
module.exports = mongoose.model('request',requestSchema)