const mongoose = require('mongoose');

const DepartmentSchema = mongoose.Schema({
    name: {type: String, required: true, unique: true},
    faculty: {type: ObjectID, ref: 'Faculty'},
    // Not sure if I should keep track of all courses under the department.
}

, {
    strict: false,
    timestamps: true
});

module.exports = mongoose.model('Department', DepartmentSchema);