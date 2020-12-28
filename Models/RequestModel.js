const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;
const CounterModel = require('./CounterModel.js');

const RequestSchema = mongoose.Schema({
   requestID: {type: String, unique: true},

   // For all requests
   reqType: {type: String, required: true, enum: ['Change Day off', 'Slot Linking', 'Annual Leave', 'Accidental Leave', 'Sick Leave', 'Maternity Leave', 'Compensation Leave', 'Replacement']},
   sentBy: {type: ObjectID, ref: 'StaffMemberModel', required: true},
   sentTo: {type: ObjectID, ref: 'StaffMemberModel', required: true},
   state: {type: String, required: true, enum: ['Accepted', 'Rejected', 'Pending']},
   submission_date: {type: Date, required: true},
    
   // Change Day Off
   newDayOff: {type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday', 'Sunday']},


    // for Replacement Request
    slotDate: {type: Date},
    slotNum: {type: Number},
    slotLoc: {type: String},
    replacementStaff: {type: ObjectID, ref: 'StaffMemberModel'},

    // for Slot Linking
    slotDay: {type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday', 'Sunday']},
    courseID: {type: String},
    
    // for Other 4 Leave Requests
    reason: {type: String},
    medicalDoc: {type: String},
    maternityDoc: {type: String},
    accidentDate: {type: Date},
    sickDay: {type: Date},
    missedDay:{type: Date},

    // Acceptance
    RejectionReason: {type: String}
});

RequestSchema.pre('save', function(next) {
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
        
              doc.requestID = counter._id + counter.seq ;
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
        
              doc.requestID = counter._id + counter.seq ;
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
        
              doc.requestID = counter._id + counter.seq ;
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
        
              doc.requestID = counter._id + counter.seq ;
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
        
              doc.requestID = counter._id + counter.seq ;
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
        
              doc.requestID = counter._id + counter.seq ;
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
        
              doc.requestID = counter._id + counter.seq ;
              next();
            }
          );
      }
      else {
        CounterModel.findByIdAndUpdate(         // ** Method call begins **
            'Replacement-',                     // The ID to find for in counters model
            { $inc: { seq: 1 } },               // The update
            { new: true, upsert: true },        // The options
            function(error, counter) {          // The callback
              if(error) return next(error);
        
              doc.requestID = counter._id + counter.seq ;
              next();
            }
          );         
      }
});

module.exports = mongoose.model('request', RequestSchema);