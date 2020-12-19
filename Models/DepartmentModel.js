const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;

const DepartmentSchema = mongoose.Schema({
    name: {type: String, required: true, unique: true},
    faculty: {type: ObjectID, ref: 'Faculty', required: true}, // Not sure If it should be required...> I believe it should be required (Maya)
    // Not sure if I should keep track of all courses under the department.
    HOD: {type: ObjectID, ref: 'AcademicStaff'}
}, 

{
    strict: false,
    timestamps: true
});

module.exports = mongoose.model('Department', DepartmentSchema);