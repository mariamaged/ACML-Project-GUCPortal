const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;

const DepartmentSchema = mongoose.Schema({
    name: {type: String, required: true, unique: true},
    faculty: {type: ObjectID, ref: 'Faculty'}, // Not sure If it should be required.
    HOD: {type: ObjectID, ref: 'AcademicStaff'}
}, 

{
    strict: false,
    timestamps: true
});

module.exports = mongoose.model('Department', DepartmentSchema);