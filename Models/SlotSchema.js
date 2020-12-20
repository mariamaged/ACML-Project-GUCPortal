const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;

const SlotSchema = mongoose.Schema({
    day: {type: String, required: true},
    number: {type: Number, required: true}, 
    location: {type: ObjectID, ref: 'Location', required: true},
    academic_member_id: {type: ObjectID, ref: 'AcademicStaff'},
    course: {type: ObjectID, ref:'Course', required: true}
});

module.exports = SlotSchema;