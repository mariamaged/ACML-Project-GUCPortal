// For routing.
const express = require('express');
const router = express.Router();

// For models.
const StaffMemberModel = require('../Models/StaffMemberModel.js');
const AcademicStaffModel = require('../Models/AcademicStaffModel.js');
const CourseModel = require('../Models/CourseModel.js');

router.route('/CourseInstructorforCourse')
.post(async (req, res) => {
   // if(req.user.isHOD) {
        const {courseID, courseInstructorID} = req.body;
        const course = await CourseModel.findOne({id: courseID});
        if(!course) {
            return res.status(400).send('Course does not exist!');
        }
        else {
            const HOD = await AcademicStaffModel.find({member: req.user._id});
            const HODDepartment = HOD.department;
            const courseInstructorStaffModel = await StaffMemberModel.findOne({id: courseInstructorID});
            const courseInstructorAcademicModel = await AcademicStaffModel.findOne({member: courseInstructorStaffModel._id});
            if(HODDepartment == courseInstructorAcademicModel.department) {
                await CourseModel.findOneAndUpdate({id: courseID}, {$push: {academic_staff: courseInstructorStaffModel._id}}, {new: true}, (error, doc) => {
                    if(error) console.log("Something wrong happened while updating the course with course instructor");
                    console.log(doc);
                });
            }
            else {
                return res.status(400).send('Course not under your department!');
            }
        }
   // }
 /*   else {
        res.status(401).send('Access Denied!');
    }*/
});