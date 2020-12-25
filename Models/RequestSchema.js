const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;
const StaffMemberModel = require('../Models/StaffMemberModel.js');

const requestSchema=mongoose.Schema({
    requestID: {type: Number, unique: true},
   //for all requests
   reqType:{type:String},
   sentBy:{type: ObjectID, ref: 'StaffMemberModel'},
   sentTo:{type: ObjectID, ref: 'StaffMemberModel'},
   state:{type:String},
   submission_date:{type:String},
    
   //change day off
   newDayOff:{type:String , enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday', 'Sunday']},

    //compensation leave
    missedDay:{type:Date},

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


requestSchema.pre('save', function(next) {
    var doc = this;
    if (!doc.isNew) {
        next();
        return;
      }
    
      if(doc.reqType == 'Annual Leave') {
        CounterModel.findByIdAndUpdate(         // ** Method call begins **
            'AnnualLeave-',                     // The ID to find for in counters model
            { $inc: { seq: 1 } },               // The update
            { new: true, upsert: true },        // The options
            function(error, counter) {          // The callback
              if(error) return next(error);
        
              doc.id = counter._id + counter.seq ;
              next();
            }
          );
      }
      else if(doc.reqType == 'Change Day off') {
        CounterModel.findByIdAndUpdate(         // ** Method call begins **
            'ChangeDayOff-',                    // The ID to find for in counters model
            { $inc: { seq: 1 } },               // The update
            { new: true, upsert: true },        // The options
            function(error, counter) {          // The callback
              if(error) return next(error);
        
              doc.id = counter._id + counter.seq ;
              next();
            }
          );
      }
      else if(doc.reqType == 'Slot Linking') {
        CounterModel.findByIdAndUpdate(         // ** Method call begins **
            'SlotLinking-',                     // The ID to find for in counters model
            { $inc: { seq: 1 } },               // The update
            { new: true, upsert: true },        // The options
            function(error, counter) {          // The callback
              if(error) return next(error);
        
              doc.id = counter._id + counter.seq ;
              next();
            }
          );
      }
      else if(doc.reqType == 'Sick Leave') {
        CounterModel.findByIdAndUpdate(         // ** Method call begins **
            'SickLeave-',                       // The ID to find for in counters model
            { $inc: { seq: 1 } },               // The update
            { new: true, upsert: true },        // The options
            function(error, counter) {          // The callback
              if(error) return next(error);
        
              doc.id = counter._id + counter.seq ;
              next();
            }
          );
      }
      else if(doc.reqType == 'Compensation Leave') {
        CounterModel.findByIdAndUpdate(         // ** Method call begins **
            'CompensationLeave-',               // The ID to find for in counters model
            { $inc: { seq: 1 } },               // The update
            { new: true, upsert: true },        // The options
            function(error, counter) {          // The callback
              if(error) return next(error);
        
              doc.id = counter._id + counter.seq ;
              next();
            }
          );
      }
      else if(doc.reqType == 'Maternity Leave') {
        CounterModel.findByIdAndUpdate(         // ** Method call begins **
            'MaternityLeave-',                  // The ID to find for in counters model
            { $inc: { seq: 1 } },               // The update
            { new: true, upsert: true },        // The options
            function(error, counter) {          // The callback
              if(error) return next(error);
        
              doc.id = counter._id + counter.seq ;
              next();
            }
          );
      }
      else if(doc.reqType == 'Accidental Leave') {
        CounterModel.findByIdAndUpdate(         // ** Method call begins **
            'AccidentalLeave-',                 // The ID to find for in counters model
            { $inc: { seq: 1 } },               // The update
            { new: true, upsert: true },        // The options
            function(error, counter) {          // The callback
              if(error) return next(error);
        
              doc.id = counter._id + counter.seq ;
              next();
            }
          );
      }
      else {
        CounterModel.findByIdAndUpdate(         // ** Method call begins **
            'Replacement-',                 // The ID to find for in counters model
            { $inc: { seq: 1 } },               // The update
            { new: true, upsert: true },        // The options
            function(error, counter) {          // The callback
              if(error) return next(error);
        
              doc.id = counter._id + counter.seq ;
              next();
            }
          );         
      }
});
module.exports = mongoose.model('request',requestSchema)