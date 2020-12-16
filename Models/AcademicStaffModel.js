const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;
const slotSchema = require('SlotSchema.js');

const AcademicStaffSchema = mongoose.Schema({
    // Personal Information.
    name: {type: String, required: true}, // No staff can change that.
    id: {type: String, required: true, unique: true}, // No staff can change that.
    email: {type: String, required: true, unique: true},
    password: {type: String, default: "123456"},
    salary: {type: Number, required: true}, // No academic member can change that.
    office: {type: ObjectID, ref: 'Location', required: true},
    gender: {type: String},

    // Academic Information.
    department: {type: ObjectID, ref: 'Department'}, // No academic member can change that.
    faculty: {type: ObjectID, ref: 'Faculty'}, // No academic member can change that.
    courses: [{type: ObjectID, ref: 'Course'}],
    schedule: [slotSchema],
    day_off: {type: String},
    type: {type: String, required: true},

    // Attendance Information.
    attendance:[attendaceSchema],
    annual_days: {type:Number},
    last_updated_annual:{type: Date},
    accidental_days_left: {type:Number},
    attendCompensationDay:{type:Boolean}
},

{
    strict: false,
    timestamps: true
});

module.exports.model = mongoose.model('AcademicStuff', AcademicStaffSchema);