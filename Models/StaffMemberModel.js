const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;
const CounterModel = require('./CounterModel.js');

//const slotSchema = require('SlotSchema.js');
//const attendanceSchema = require('AttendanceSchema.js');

const attendanceSchema = mongoose.Schema({
    date: {type: Date}
   ,hours: {type:Number}
   ,last_signIn: {type:Date ,default:Date.now}
   ,last_signOut: {type:Date ,default:Date.now}
   ,day: {type: String}
});

const slotSchema = mongoose.Schema({
    day: {type: String, required: true},
    number: {type: Number, required: true}, 
    location: {type: ObjectID, ref: 'Location', required: true},
    academic_member_id: {type: ObjectID, ref: 'AcademicStaff', required: true},
    course: {type: ObjectID, ref:'Course'}
});


const StaffMemberSchema = mongoose.Schema({
    // Personal Information.
    name: {type: String, required: true}, // No staff can change that.
    id: {type: String, unique: true}, // No staff can change that.
    email: {type: String, required: true, unique: true},
    password: {type: String, default: "123456"},
    salary: {type: Number, required: true}, // No academic member can change that.
    office: {type: ObjectID, ref: 'Location', required: true},
    gender: {type: String},

    // Login Information.
    newStaffMember: {type: Boolean, default: true},
    staff_type:{type: String, enum: ['HR', 'Academic Member'], required: true},
    
    // Attendance Information.
    attendance:[attendanceSchema],
    annual_days: {type:Number},
    lastUpdatedAnnual:{type: Date},
    accidentalDaysLeft: {type:Number},
    attendCompensationDay:{type:Boolean}
},

{
    strict: false,
    timestamps: true
});

StaffMemberSchema.pre('save', function(next) {
    var doc = this;
    if (!doc.isNew) {
        next();
        return;
      }
    
      if(doc.staff_type == 'Academic Member') {
        CounterModel.findByIdAndUpdate(         // ** Method call begins **
            'ac-',                              // The ID to find for in counters model
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
        CounterModel.findByIdAndUpdate(          // ** Method call begins **
            'hr-',                               // The ID to find for in counters model
            { $inc: { seq: 1 } },                // The update
            { new: true, upsert: true },         // The options
            function(error, counter) {           // The callback
              if(error) return next(error);
        
              doc.id = counter._id + counter.seq;
              next();
            }
          ); 
    }  

})

module.exports = mongoose.model('Staff', StaffMemberSchema);