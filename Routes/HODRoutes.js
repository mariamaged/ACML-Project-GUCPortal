// For models.
const StaffMemberModel = require('../Models/StaffMemberModel.js');
const AcademicStaffModel = require('../Models/AcademicStaffModel.js');
const CourseModel = require('../Models/CourseModel.js');

// For routing.
const express = require('express');
const router = express.Router();

// Route 1.
router.route('/CourseInstructorforSingleCourse')
.post(async (req, res) => {
    if(req.user.isHOD) {
        const {courseID, courseInstructorID} = req.body;
        const course = await CourseModel.findOne({id: courseID});
        if(!course) {
            return res.status(400).send('Course does not exist!');
        }
        else {
            const courseInstructorStaffModel = await StaffMemberModel.findOne({id: courseInstructorID});
            const courseInstructorAcademicModel = await AcademicStaffModel.findOne({member: courseInstructorStaffModel._id});

            if(courseInstructorAcademicModel.type == 'Course Instructor') {
            const HODStaffModel = await StaffMemberModel.findOne({id: req.user.id});
            const HODAcademicModel = await AcademicStaffModel.findOne({member: HODStaffModel._id});
            const HODDepartment = HODAcademicModel.department;
            const CourseDepartment = course.department;

            if(HODDepartment.equals(CourseDepartment)) {
                await CourseModel.findOneAndUpdate({id: courseID}, {$addToSet: {academic_staff: courseInstructorAcademicModel._id}}, {new: true}, (error, doc) => {
                    if(error) console.log("Something wrong happened while updating the course with course instructor");
                    console.log(doc);
                });
            }
            else {
                return res.status(401).send('Course not under your department!');
            }
        }
        else {
                return res.status(400).send('Staff member is not a course instructor!');
            }
        }
    }
    else {
        res.status(401).send('Access Denied!');
    }
})

.delete(async (req, res) => {
 //  if(req.user.isHOD) {
       const {courseID, courseInstructorID} = req.body;
       const course = await CourseModel.findOne({id: courseID});
       if(!course) {
           return res.status(400).send('Course does not exist!');
       }
       else {
           const courseInstructorStaffModel = await StaffMemberModel.findOne({id: courseInstructorID});
           const courseInstructorAcademicModel = await AcademicStaffModel.findOne({member: courseInstructorStaffModel._id});

           if(courseInstructorAcademicModel.type == 'Course Instructor') {
          // const HODStaffModel = await StaffMemberModel.findOne({id: req.user.id});
          // const HODAcademicModel = await AcademicStaffModel.findOne({member: HODStaffModel._id});
           const HODAcademicModel = await AcademicStaffModel.findOne({member: courseInstructorStaffModel._id});
           const HODDepartment = HODAcademicModel.department;
           const CourseDepartment = course.department;

           if(HODDepartment.equals(CourseDepartment)) {
               await CourseModel.findOneAndUpdate({id: courseID}, {$pull: {academic_staff: courseInstructorStaffModel._id}}, {new: true}, (error, doc) => {
                   if(error) console.log("Something wrong happened while updating the course with course instructor");
                   console.log(doc);
               });
           }
           else {
               return res.status(401).send('Course not under your department!');
           }
       }
       else {
               return res.status(400).send('Staff member is not a course instructor!');
           }
       }
 //  }
 /*  else {
       res.status(401).send('Access Denied!');
   }*/
});

// Route 2.
router.route('/viewDepartmentStaff')
.get(async (req, res) => {
    //  if(req.user.isHod) {
        const HODStaffModel = await StaffMemberModel.findOne({id: "ac-1"}); // Delete later.
        const HODAcademicModel = await AcademicStaffModel.findOne({member: HODStaffModel._id}); // member: req.user.id or member: req.user._id.
        const HODDepartment = HODAcademicModel.department;
        const staffInDepartmentAcademicModel = await AcademicStaffModel.find({department: HODDepartment});

        const returnArray = [];
        for(let index = 0; index < staffInDepartmentAcademicModel.length; index++) {
          const staffTemp = await StaffMemberModel.findById(staffInDepartmentAcademicModel[index].member);
          const officeTemp = await LocationModel.findById(staffTemp.office);
          const departmentTemp = await DepartmentModel.findById(staffInDepartmentAcademicModel[index].department);
          const facultyTemp = await FacultyModel.findById(staffInDepartmentAcademicModel[index].faculty);
          
          const returnObject = {};
          returnObject.name = staffTemp.name;
          returnObject.email = staffTemp.email;
          returnObject.id = staffTemp.id;
          returnObject.salary = staffTemp.salary;
          returnObject.office = officeTemp.id;
          returnObject.department = departmentTemp.name;
          returnObject.faculty = facultyTemp.id;
          if(staffTemp.hasOwnProperty('gender')) returnObject.gender = staffTemp.gender;
          returnArray.push(returnObject);
      }
        return res.send(returnArray);         
 // }
  /*else {
      res.status(401).send('Access Denied!');
  }*/
});


// Export the router.
module.exports = router;