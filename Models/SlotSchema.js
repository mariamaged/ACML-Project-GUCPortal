const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;

const SlotSchema = mongoose.Schema({
    day: {type: String, required: true},
    number: {type: Number, required: true}, 
    location: {type: ObjectID, ref: 'Location', required: true},
    academic_member_id: {type: ObjectID, ref: 'AcademicStaff', required: true},
    course_id: {type: String, required: true}
});

modules.exports = SlotSchema;