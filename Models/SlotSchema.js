const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;

const slotSchema = mongoose.Schema({
    day: {type: String, required: true, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]},
    number: {type: Number, required: true, enum: [1, 2, 3, 4, 5]}, 
    location: {type: ObjectID, ref: 'Location', required: true},
    academic_member_id: {type: ObjectID, ref: 'AcademicStaff'},
    course: {type: ObjectID, ref:'Course'}
});

module.exports = slotSchema;