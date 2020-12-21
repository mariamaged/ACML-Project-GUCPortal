const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;
const StaffMemberModel = require('../Models/StaffMemberModel.js');

const requestSchema=mongoose.Schema({
    reqType:{type:String},
    sickDay:{type:Date},
    slotDate:{type:Date},
    slotNum:{type:Number},
    slotLoc:{type:String},
     sentTo:{type: ObjectID, ref: 'StaffMemberModel'},
    state:{type:String},
    reason:{type:String},
    submission_date:{type:Date},
    replacementStaff:{type: ObjectID, ref: 'StaffMemberModel'},
    medicalDoc:{type:String},
    maternityDoc:{type:String}
})
module.exports = mongoose.model('request',requestSchema)