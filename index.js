// Models.
const StaffMemberModel = require('./Models/StaffMemberModel.js');
const HRModel = require('./Models/HRModel.js');
const AcademicStaffModel = require('./Models/AcademicStaffModel.js');
const LocationModel = require('./Models/LocationModel.js');
const FacultyModel = require('./Models/FacultyModel.js');
const DepartmentModel = require('./Models/DepartmentModel.js');
const CourseModel = require('./Models/CourseModel.js');
const CounterModel = require('./Models/CounterModel.js');
const RequestModel = require('./Models/RequestModel.js');
const jwt = require('jsonwebtoken');
const bcrypt=require('bcrypt');

// For environmental variables.
require('dotenv').config();

// For database instance.
const moment = require('moment');
const mongoose = require('mongoose');

// For app singleton instance.
const {app} = require('./app.js');
const slotSchema = require('./Models/SlotSchema.js');

// Database connection parameters.
const databaseParameters = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(process.env.DB_URL, databaseParameters)
.then(console.log('Successfully Connected to The Database'));

function authenticateToken(req,res,next){
    
    const token=req.header('x-auth-token');
    if(!token){
    return res.sendStatus(401).status('Access deined please log in first')
    
    }
    const verified= jwt.verify(token, process.env.TOKEN_SECRET)
    req.user=verified
    console.log("in auth "+req.user)
    next();
}

// Listen on port.
app.post('/CourseInstructorforCourse', async (req, res) => {
 //   if(req.user.isHOD) {
        const {courseID, courseInstructorID} = req.body;
        const course = await CourseModel.findOne({id: courseID});
        if(!course) {
            return res.status(400).send('Course does not exist!');
        }
        else {
            const courseInstructorStaffModel = await StaffMemberModel.findOne({id: courseInstructorID});
            const courseInstructorAcademicModel = await AcademicStaffModel.findOne({member: courseInstructorStaffModel._id});

            if(courseInstructorAcademicModel.type == 'Course Instructor') {
            const HODStaffModel = await StaffMemberModel.findOne({id: "ac-4"});
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
 //   }
   /* else {
        res.status(401).send('Access Denied!');
    }*/
});

app.post('/viewDepartmentStaffPerCourse', async (req, res) => {
        //  if(req.user.isHod) {
            
            const {courseID} = req.body;
            const course = await CourseModel.findOne({id: courseID});
            const CourseDepartment = course.department;
            const HODStaffModel = await StaffMemberModel.findOne({id: "ac-1"}); // Delete later.
            const HODAcademicModel = await AcademicStaffModel.findOne({member: HODStaffModel._id}); // member: req.user.id or member: req.user._id.
            const HODDepartment = HODAcademicModel.department;

            if(HODDepartment.equals(CourseDepartment)) {
            const academicArray = course.academic_staff;
            
            const returnArray = [];
            for(let index = 0; index < academicArray.length; index++) {
              const academicTemp = await AcademicStaffModel.findById(academicArray[index]);
              const staffTemp = await StaffMemberModel.findById(academicTemp.member);
              const officeTemp = await LocationModel.findById(staffTemp.office);
              const departmentTemp = await DepartmentModel.findById(academicTemp.department);
              const facultyTemp = await FacultyModel.findById(academicTemp.faculty);
              
              const returnObject = {};
              returnObject.name = staffTemp.name;
              returnObject.email = staffTemp.email;
              returnObject.id = staffTemp.id;
              returnObject.salary = staffTemp.salary;
              returnObject.office = officeTemp.id;
              returnObject.department = departmentTemp.name;
              returnObject.faculty = facultyTemp.name;
              if(staffTemp.hasOwnProperty('gender')) returnObject.gender = staffTemp.gender;
              returnArray.push(returnObject);
          }
            return res.send(returnArray);
        }
        else {
            return res.status(401).send('Course not under your department!');
        }
       // }
        /*else {
            res.status(401).send('Access Denied!');
        }*/
});

app.get('/viewDepartmentStaffAllCourses', async (req, res) => {
     //  if(req.user.isHod) {
        const HODStaffModel = await StaffMemberModel.findOne({id: "ac-4"}); // Delete later.
        const HODAcademicModel = await AcademicStaffModel.findOne({member: HODStaffModel._id}); // member: req.user.id or member: req.user._id.
        const HODDepartment = HODAcademicModel.department;

        const courses = await CourseModel.find({department: HODDepartment});
        const returnArray = [];

        for(let index = 0; index < courses.length; index++) {
            const course = courses[index];

            const returnObject = {};
            returnObject.courseID = course.id;
            returnObject.courseName = course.name;

            const tempArray = [];

            const academicArray = course.academic_staff;
            for(let j = 0; j < academicArray.length; j++) {
                const academicTemp = await AcademicStaffModel.findById(academicArray[j]);
                const staffTemp = await StaffMemberModel.findById(academicTemp.member);
                const officeTemp = await LocationModel.findById(staffTemp.office);
                const departmentTemp = await DepartmentModel.findById(academicTemp.department);
                const facultyTemp = await FacultyModel.findById(academicTemp.faculty);
                
                const tempObject = {};
                tempObject.name = staffTemp.name;
                tempObject.email = staffTemp.email;
                tempObject.id = staffTemp.id;
                tempObject.salary = staffTemp.salary;
                tempObject.office = officeTemp.id;
                tempObject.department = departmentTemp.name;
                tempObject.faculty = facultyTemp.name;
                if(staffTemp.hasOwnProperty('gender')) tempObject.gender = staffTemp.gender;
                tempArray.push(tempObject);
            }

            returnObject.academicStaff = tempArray;
            returnArray.push(returnObject);
        }
        return res.send(returnArray);

     // }
        /*else {
            res.status(401).send('Access Denied!');
        }*/

});

app.get('/viewDepartmentStaffDayOff', async (req, res) => {
    //  if(req.user.isHod) {
        const HODStaffModel = await StaffMemberModel.findOne({id: "ac-11"}); // Delete later.
        const HODAcademicModel = await AcademicStaffModel.findOne({member: HODStaffModel._id}); // member: req.user.id or member: req.user._id.
        const HODDepartment = HODAcademicModel.department;
        const staffInDepartmentAcademicModel = await AcademicStaffModel.find({department: HODDepartment});

        const returnArray = [];
        for(let index = 0; index < staffInDepartmentAcademicModel.length; index++) {
          const staffTemp = await StaffMemberModel.findById(staffInDepartmentAcademicModel[index].member);
          
          const returnObject = {
            academicStaffMemberID: staffTemp.id,
            academicStaffMemberName: staffTemp.name,
            dayOff: staffInDepartmentAcademicModel[index].day_off
          };

          returnArray.push(returnObject);
      }
        return res.status(200).json(returnArray);       
 // }
  /*else {
      res.status(401).send('Access Denied!');
  }*/
});

app.get('/viewDepartmentStaffMemberDayOff/:memberID', async (req, res) => {
    //  if(req.user.isHod) {
        const memberID = req.params.memberID;
        const HODStaffModel = await StaffMemberModel.findOne({id: "ac-11"}); // Delete later.
        const HODAcademicModel = await AcademicStaffModel.findOne({member: HODStaffModel._id}); // member: req.user.id or member: req.user._id.
        const HODDepartment = HODAcademicModel.department;

        const staffMemberModel = await StaffMemberModel.findOne({id: memberID});
        var academicMemberModel = null;
        if(staffMemberModel)
            academicMemberModel = await AcademicStaffModel.findOne({member: staffMemberModel._id});

        if(!academicMemberModel) return res.status(400).send('Academic member not found!');
        if(academicMemberModel.department.equals(HODDepartment)) {
            const returnObject = {
            academicStaffMemberName: staffMemberModel.name,
            dayOff: academicMemberModel.day_off
          };
          return res.status(200).send(returnObject);
        }
        else {
            return res.status(401).send("Staff member not in your department!");
        }       
 // }
  /*else {
      res.status(401).send('Access Denied!');
  }*/
});

app.post('/courseSlots', async (req, res) => {
    //  if(req.user.isCourseCoordinator) {
    const {courseID, details} = req.body;
    const course = await CourseModel.findOne({id: courseID});
    if(!course) return res.status(400).send("Course not found!");

    const CCStaffModel = await StaffMemberModel.findOne({id: "ac-11"}); // Delete later.
    const CCAcademicModel = await AcademicStaffModel.findOne({member: CCStaffModel._id}); // member: req.user.id or member: req.user._id.
    if(!course.course_coordinator.equals(CCAcademicModel._id)) 
        return res.status(401).send("You are not a course coordinator for this course!");
    
    const errorMessages = [];

    for(let index = 0; index < details.length; index++) {
        const {number, locationID, date} = details[index];
        const errorMessage = {};
        errorMessage.slot = details[index];
        const location = await LocationModel.findOne({id: locationID});

        if(!location) {
            errorMessage.locationID = locationID;
            errorMessage.locationNotFound = true;
            errorMessages.push(errorMessage);
        }
        else {
            const allCourses = await CourseModel.find();
            const conflictingCourses = [];

            for(let i = 0; i < allCourses.length; i++) {
            var slotFound = allCourses[i].schedule.some(function (assignedSlot) {
                return assignedSlot.date.getTime() == new Date(date).getTime() && assignedSlot.number == number && assignedSlot.location.equals(location._id);
            });
            if(slotFound) conflictingCourses.push(allCourses[i].id);
            }


            if(conflictingCourses.length == 0) {
            const newCourseSlot = {
                day: moment(date, 'YYYY-MM-DD').format('dddd').toString(),
                number: number,
                location: location._id,
                date: new Date(date)
            };

            if(course.schedule.length == 0) course.schedule = [];
            course.schedule.push(newCourseSlot);
            course.slots_needed++;
            await course.save();
            }

            else {
                errorMessage.slotAlreadyExistsforOtherCourses = true;
                errorMessage.conflictingCourses = conflictingCourses;
                errorMessages.push(errorMessage);
            }
    }
}
    if(errorMessages.length != 0)   
        return res.status(400).json(errorMessages);
    else
        return res.status(200).send("Operation done successfully!");

      // }
    /*else {
      return res.status(401).send('Access Denied!');
  }*/
});

app.delete('/courseSlots', async (req, res) => {
        //  if(req.user.isCourseCoordinator) {
            const {courseID, details} = req.body;
            const course = await CourseModel.findOne({id: courseID});
            if(!course) return res.status(400).send("Course not found!");
        
            const CCStaffModel = await StaffMemberModel.findOne({id: "ac-11"}); // Delete later.
            const CCAcademicModel = await AcademicStaffModel.findOne({member: CCStaffModel._id}); // member: req.user.id or member: req.user._id.
            if(!course.course_coordinator.equals(CCAcademicModel._id)) 
                return res.status(401).send("You are not a course coordinator for this course!");
            
            const errorMessages = [];
        
            for(let index = 0; index < details.length; index++) {
                const {number, locationID, date} = details[index];
                const errorMessage = {};
                errorMessage.slot = details[index];
                const location = await LocationModel.findOne({id: locationID});
        
                if(!location) {
                    errorMessage.locationID = locationID;
                    errorMessage.locationNotFound = true;
                    errorMessages.push(errorMessage);
                }
                else {
                    var position = -1;
                    const SlotExists = course.schedule.some(function (assignedSlot, ind) {
                            var flag = assignedSlot.date.getTime() == new Date(date).getTime() 
                            && assignedSlot.number == number
                            && assignedSlot.location.equals(location._id);
                            if(flag) {
                                position = ind;
                                return flag;
                            }
                        });
                    
                    if(SlotExists) {
                        course.schedule.splice(position, 1);
                        course.slots_needed--;
                        await course.save();
                    }
                    else {
                        errorMessage.slotDoesNotExistinCourseSchedule = true;
                        errorMessages.push(errorMessage);
                    }
            }
        }
            if(errorMessages.length != 0)   
                return res.status(400).json(errorMessages);
            else
                return res.status(200).send("Operation done successfully!");
        
              // }
            /*else {
              return res.status(401).send('Access Denied!');
          }*/
});

app.post('/updateCourseSlots', async (req, res) => {
    //  if(req.user.isCourseCoordinator) {
        const {courseID, details} = req.body;
        const course = await CourseModel.findOne({id: courseID});
        if(!course) return res.status(400).send("Course not found!");
    
        const CCStaffModel = await StaffMemberModel.findOne({id: "ac-11"}); // Delete later.
        const CCAcademicModel = await AcademicStaffModel.findOne({member: CCStaffModel._id}); // member: req.user.id or member: req.user._id.
        if(!course.course_coordinator.equals(CCAcademicModel._id)) 
            return res.status(401).send("You are not a course coordinator for this course!");
        
        const errorMessages = [];
    
        for(let index = 0; index < details.length; index++) {
            const {numberOld, locationIDOld, dateOld} = details[index].oldSlot;
            const newSlot = details[index].newSlot;
            
            const errorMessage = {};
            errorMessage.oldSlot = details[index].oldSlot;
            errorMessage.newSlot = details[index].newSlot;
            const locationOld = await LocationModel.findOne({id: locationIDOld});
            const locationNew = await LocationModel.findOne({id: newSlot.locationIDNew});

            const updatedSlot = {};
            if(newSlot.hasOwnProperty('numberNew'))
                updatedSlot.number = newSlot.numberNew;
            else
                updatedSlot.number = numberOld;
                    
            if(newSlot.hasOwnProperty('dateNew')) {
                updatedSlot.date = new Date(newSlot.dateNew);
                updatedSlot.day = moment(newSlot.dateNew, 'YYYY-MM-DD').format('dddd').toString()
            }
            else {
                updatedSlot.date = new Date(dateOld);
                updatedSlot.day = moment(dateOld, 'YYYY-MM-DD').format('dddd').toString()
            }

            if(!locationOld) {
                errorMessage.locationIDOld = locationIDOld;
                errorMessage.locationNotFound = true;

                if(newSlot.hasOwnProperty('locationIDNew') && !locationNew) {
                    errorMessage.locationIDNew = newSlot.locationIDNew;
                }

                errorMessages.push(errorMessage);
            }
            else {
                if(newSlot.hasOwnProperty('locationIDNew') && !locationNew) {
                    errorMessage.locationIDNew = newSlot.locationIDNew;
                    errorMessage.locationNotFound = true;
                    errorMessages.push(errorMessage);
                }
                else {
                    if(!newSlot.hasOwnProperty('locationIDNew')) {
                        updatedSlot.location = locationOld._id;
                    }
                    if(newSlot.hasOwnProperty('locationIDNew') && locationNew) {
                        updatedSlot.location = locationNew._id;
                    }
                    
                    const allCourses = await CourseModel.find();
                    const conflictingCourses = [];
    
                    for(let i = 0; i < allCourses.length; i++) {
                        var slotFound = allCourses[i].schedule.some(function (assignedSlot) {
                            return assignedSlot.date.getTime() == updatedSlot.date.getTime() 
                            && assignedSlot.number == updatedSlot.number 
                            && assignedSlot.location.equals(updatedSlot.location);
                        });

                        if(slotFound) conflictingCourses.push(allCourses[i].id);
                    }
    
                    var position = -1;
                    const OldSlotExists = course.schedule.some(function (assignedSlot, ind) {
                            var flag = assignedSlot.date.getTime() == new Date(dateOld).getTime() 
                            && assignedSlot.number == numberOld
                            && assignedSlot.location.equals(locationOld._id);
                            if(flag) {
                                position = ind;
                                return flag;
                            }
                        });

                    if(conflictingCourses.length == 0) {
                        if(OldSlotExists) {
                            course.schedule[position].day = updatedSlot.day;
                            course.schedule[position].date = updatedSlot.date;
                            course.schedule[position].number = updatedSlot.number;
                            course.schedule[position].location = updatedSlot.location;
                            await course.save();
                        }
                        else {
                            errorMessage.oldSlotDoesNotExistinCourseScedule = true;
                            errorMessages.push(errorMessage);
                        }
                    }
                    else {
                        if(!OldSlotExists) {
                            errorMessage.oldSlotDoesNotExistinCourseScedule = true;
                        }
                        errorMessage.updatedSlotAlreadyExistsforOtherCourses = true;
                        errorMessage.conflictingCourses = conflictingCourses;
                        errorMessages.push(errorMessage);
                }
            }
        }   
    }

        if(errorMessages.length != 0)   
            return res.status(400).json(errorMessages);
        else
            return res.status(200).send("Operation done successfully!");
    
          // }
        /*else {
          return res.status(401).send('Access Denied!');
      }*/
});

// 7 (a)
app.get('/courseCoverage/:courseID', authenticateToken, async (req, res) => {
        const courseID = req.params.courseID;

        const HODAcademicModel = await AcademicStaffModel.findOne({member: req.user.id}); 

        if(HODAcademicModel.isHOD) {
        const course = await CourseModel.findOne({id: courseID});
        if(!course) return res.status(400).send('Course does not exist!');
        if(!HODAcademicModel.department.equals(course.department)) return res.status(401).send('Course not under your department!');
        if(course.slots_needed == 0) return res.status(400).send('Course does not have any slots for now!');

        const coverage = course.slots_covered/course.slots_needed * 100;
        return res.status(200).send('Course coverage is equal to: ' + coverage + "%");
        }

        else {
            return res.status(401).send('Access Denied!');
        }

});

// 7 (b)
app.get('/coursesCoverage', authenticateToken, async (req, res) => {
        const HODAcademicModel = await AcademicStaffModel.findOne({member: req.user.id}); 

        if(HODAcademicModel.isHOD) {
        const courses = await CourseModel.find({department: HODAcademicModel.department});

        const errorMessages = [];
        for(let index = 0; index < courses.length; index++) {
            const errorMessage = {courseID: courses[index].id};
            if(courses[index].slots_needed == 0) errorMessage.courseDoesNotHaveSlotsAssigned = true;
            else {
                const coverage = courses[index].slots_covered/courses[index].slots_needed * 100;
                errorMessage.courseCoverage = coverage;
            }
            errorMessages.push(errorMessage);
        }

        return res.status(200).json(errorMessages);
    }

        else {
            return res.status(401).send('Access Denied!');
        }

});

// 4
app.get('/viewDayOffLeaveRequests', authenticateToken, async (req, res) => {
        const HODAcademicModel = await AcademicStaffModel.findOne({member: req.user.id});
        
        if(HODAcademicModel.isHOD) {
        const off = await RequestModel.find({sentTo: HODAcademicModel.member, reqType: 'Change Day off'});
        const leave = await RequestModel.find({$and: [
            { // First and condition starts.
          $or: [
            {reqType: 'Maternity Leave'},
            {reqType: 'Sick Leave'},
            {reqType: 'Compensation Leave'},
            {reqType: 'Accidental Leave'},
            {reqType: 'Annual Leave'}
          ],  
            }, // First and condition ends.

            {sentTo: HODAcademicModel.member} // Second and condition.
          ], 
        });

        const updatedOff = [];
        for(let index = 0; index < off.length; index++) {
            const request = off[index];
            const offObject = {
                requestType: request.reqType,
                state: request.state,
                submission_date: moment(request.submission_date).format('YYYY-MM-DD')
            };

            const sentByStaff = await StaffMemberModel.findById(request.sentBy);

            offObject.sentByID = sentByStaff.id;
            offObject.sentByName = sentByStaff.name;
            if(request.HODRejectionReason) offObject.HODRejectionReason = request.HODRejectionReason;

            offObject.newDayOff = request.newDayOff;

            if(request.reason) offObject.reason = request.reason;

            updatedOff.push(offObject);
        }

        const updatedLeave = [];
        for(let index = 0; index < leave.length; index++) {
            const request = leave[index];
 
            const leaveObject = {
                requestType: request.reqType,
                state: request.state,
                submission_date: moment(request.submission_date).format('YYYY-MM-DD')
            };

            const sentByStaff = await StaffMemberModel.findById(request.sentBy);

            leaveObject.sentByID = sentByStaff.id;
            leaveObject.sentByName = sentByStaff.name;
            if(request.HODRejectionReason) leaveObject.HODRejectionReason = request.HODRejectionReason;

            if(request.reqType == 'Maternity Leave') {
                leaveObject.maternityDoc = request.maternityDoc;
                if(request.reason) leaveObject.reason = request.reason;
            }
            else if(request.reqType == 'Sick Leave') {
                leaveObject.medicalDoc = request.medicalDoc;
                leaveObject.sickDay = moment(request.sickDay).format('YYYY-MM-DD')
                if(request.reason) leaveObject.reason = request.reason;
            }
            else if(request.reqType == 'Accidental Leave') {
                leaveObject.accidentDate = moment(request.accidentDate).format('YYYY-MM-DD');
                if(request.reason) leaveObject.reason = request.reason;
            }
            else if(request.reqType == 'Compensation Leave'){
                leaveObject.missedDate = moment(request.missedDate).format('YYYY-MM-DD');
                leaveObject.reason = request.reason;
            }
            else {
                leaveObject.slotDate = moment(request.slotDate).format('YYYY-MM-DD');
                leaveObject.slotNum = request.slotNum;
                leaveObject.slotLoc = request.slotLoc;

                const replacementStaff = await StaffMemberModel.findById(request.replacementStaff);

                leaveObject.replacementStaffID = replacementStaff.id;
                leaveObject.replacementStaffName = replacementStaff.name;
                if(!request.reason) leaveObject.reason = request.reason;
            }
            updatedLeave.push(leaveObject);
        }

        const returnObject = {
            dayOffRequests: updatedOff,
            leaveRequests: updatedLeave,
        };

        return res.status(200).json(returnObject);
    }

    else {
        return res.status(401).send('Access Denied!');
    } 
});

app.post('/sendAnnualLeavetoHOD', async (req, res) => {
  //  const user = await StaffMemberModel.findById(req.user.id); // const user = await StaffMemberModel.findById(req.user._id);
    const user = await StaffMemberModel.findOne({id: "ac-11"});
    const userAcademic = await AcademicStaffModel.findOne({member: user._id});

    const department = await DepartmentModel.findById(userAcademic.department);

    const HODAcademicModel = await AcademicStaffModel.findById(department.HOD);
    const HODStaffModel = await StaffMemberModel.findById(HODAcademicModel.member);
    
    const {slotNum, slotDate, slotLoc} = req.body;
    const acceptedRequest = await RequestModel.findOne({
          slotNum: slotNum, slotDate: moment(slotDate, 'YYYY-MM-DD'), slotLoc: slotLoc, 
          state: 'Accepted',
          sentBy: user._id}); // req.user.id/ req.user._id.
    
    const requestsSameSlot = await RequestModel.find({
         slotNum: slotNum, slotDate: moment(slotDate, 'YYYY-MM-DD'), slotLoc: slotLoc,
         sentBy: user._id}); // req.user.id/ req.user._id.

    if(acceptedRequest) {
        const newAnnualRequest = new RequestModel({
            requestType: 'Annual Leave',
            sentTo: HODStaffModel._id,
            sentBy: user._id, // req.user.id/ req.user._id
            state: 'Pending',
            submission_date: moment(),

            slotNum: slotNum,
            slotDate: moment(slotDate, 'YYYY-MM-DD'),
            slotLoc: slotLoc,
            replacementStaff: acceptedRequest.sentTo
        });
        if(req.body.reason) newAnnualRequest.reason = req.body.reason;
        await newAnnualRequest.save();

        const acceptedStaff = await StaffMemberModel.findById(acceptedRequest.sentTo);
        return res.status(200).send('Annual Leave request sent to HOD with the details about the academic member who accepted your request: ' 
        + acceptedStaff.name + ", with id: " + acceptedStaff.id + '.');
    }
    else {
        if(requestsSameSlot.length == 0) {
            return res.status(400).send('You do not have a replacement request with such details!');
        }
        else {
            const newAnnualRequest = new RequestModel({
                requestType: 'Annual Leave',
                sentTo: HODStaffModel._id,
                sentBy: user._id, // req.user.id/ req.user._id.
                state: 'Pending',
                submission_date: moment(),
    
                slotNum: slotNum,
                slotDate: moment(slotDate, 'YYYY-MM-DD'),
                slotLoc: slotLoc,
            });
            if(req.body.reason) newAnnualRequest.reason = req.body.reason;
            await newAnnualRequest.save();

            return res.status(200).send('Annual Leave request sent to HOD with request that has no accept responses.');
        }
    }

});

app.post('/acceptRequest', async (req, res) => {
    //    if(req.user.isHOD) {
        const HODStaffModel = await StaffMemberModel.findOne({id: "ac-12"}); // Delete later

        const {requestID} = req.body;
        const request = await RequestModel.findOne({requestID: requestID});
        if(!request.sentTo.equals(HODStaffModel._id)) return res.status(400).send('This request is not sent for you!');

        if(request.reqType == 'Annual Leave') {
            const sentByAcademic = await AcademicStaffModel.findOne({member: request.sentBy});
            const replacementAcademic = await AcademicStaffModel.findOne({member: request.replacementStaff});
            const slotLocation = await Location.findOne({id: request.slotLoc});

            request.state = 'Accepted';

            var position = -1.
            sentByAcademic.schedule.some(function(assignedSlot, ind) {
                var flag = assignedSlot.date.getTime() == request.slotDate.getTime()
                    && assignedSlot.number == request.slotNum
                    && assignedSlot.location.equals(slotLocation._id);
                if(flag) {
                    position = ind;
                    return flag;
                }
            });

            const slot = sentByAcademic.schedule[position];
            sentByAcademic.schedule.splice(position, 1);
            await sentByAcademic.save();

            slot.isReplaced = true;

            replacementAcademic.schedule.push(slot);
            await replacementAcademic.save();

            const courses = await CourseModel.find({});
            for(let i = 0; i < courses.length; i++) {
                const course = courses[i];
                
                var pos = - 1;
                var SlotExists = course.schedule.some(function(courseSlot, ind) {
                    var flag = courseSlot.date.getTime() == slot.date.getTime()
                    && courseSlot.number == slot.number
                    && courseSlot.location.equals(slot.location);

                    if(flag) {
                        pos = ind;
                        return flag;
                    }
                });

                if(SlotExists) {
                    course.schedule[pos].isReplaced = true;
                    course.academic_member_id = replacementAcademic._id;
                    await course.save();
                }
            }

            return res.status(200).send('Operation done successfully!');
        }
          /*  else {
        return res.status(401).send('Access Denied!');
    } */
 //}  
});

app.get('/teachingAssignmentPerCourse', async (req, res) => {
    //  if(req.user.isHOD) {
    const {courseID} = req.body;
    const course = await CourseModel.findOne({id: courseID});
    if(!course) return res.status(400).send("Course not found!");

    const HODStaffModel = await StaffMemberModel.findOne({id: "ac-11"}); // Delete later.
    const HODAcademicModel = await AcademicStaffModel.findOne({member: HODStaffModel._id}); // member: req.user.id or member: req.user._id.
    if(!HODAcademicModel.department.equals(course.department)) {
        return res.status(401).send("This course is not under your department!");  
    }

    const schedule = course.schedule;
    const academicStaff = course.academic_staff;
    const returnArray = [];

    for(let index = 0; index < academicStaff.length; index++) {
        const oneMemberAcademicModel = await AcademicStaffModel.findById(academicStaff[index]);
        const oneMemberStaffModel = await StaffMemberModel.findById(oneMemberAcademicModel.member);
        const oneObject = {academicStaffID: oneMemberStaffModel.id, academicStaffName: oneMemberStaffModel.name, slots: []};

        const slotsArray = schedule.filter(function(elem) {
            return elem.academic_member_id.equals(academicStaff[index]);
        });

        for(let i = 0; i < slotsArray.length; i++) {
            const loc = await LocationModel.findById(slotsArray[i].location);
            const slotObject = {
                day: slotsArray[i].day,
                number: slotsArray[i].number,
                location: loc.id
            }
            oneObject.slots.push(slotObject);
        }
        returnArray.push(oneObject);
    }

    return res.json(returnArray);
        // }
    /*else {
      res.status(401).send('Access Denied!');
  }*/
});

app.get('/teachingAssignmentAllCourses', async (req, res) => {
    //  if(req.user.isHOD) {
    const HODStaffModel = await StaffMemberModel.findOne({id: "ac-11"}); // Delete later.
    const HODAcademicModel = await AcademicStaffModel.findOne({member: HODStaffModel._id}); // member: req.user.id or member: req.user._id.

    const courses = await CourseModel.find({department: HODAcademicModel.department});
    const finalArray = [];

    for(let j = 0; j < courses.length; j++) {
    const course = courses[j];
    const finalObject = {
        courseID: course.id,
    };

    const schedule = course.schedule;
    const academicStaff = course.academic_staff;
    const returnArray = [];

    for(let index = 0; index < academicStaff.length; index++) {
        const oneMemberAcademicModel = await AcademicStaffModel.findById(academicStaff[index]);
        const oneMemberStaffModel = await StaffMemberModel.findById(oneMemberAcademicModel.member);
        const oneObject = {academicStaffID: oneMemberStaffModel.id, academicStaffName: oneMemberStaffModel.name, slots: []};

        const slotsArray = schedule.filter(function(elem) {
            return elem.academic_member_id.equals(academicStaff[index]);
        });

        for(let i = 0; i < slotsArray.length; i++) {
            const loc = await LocationModel.findById(slotsArray[i].location);
            const slotObject = {
                day: slotsArray[i].day,
                number: slotsArray[i].number,
                location: loc.id
            }
            oneObject.slots.push(slotObject);
        }
        returnArray.push(oneObject);
    }
    finalObject.scheduleForEachTA = returnArray
    finalArray.push(finalObject)
}

    return res.json(finalArray);
        // }
    /*else {
      res.status(401).send('Access Denied!');
  }*/
});

app.post('/assignCourseInstructorforCourses', async (req, res) => {
//    if(req.user.isHOD) {
        const body = req.body;
        const errorMessages = [];

        const HODStaffModel = await StaffMemberModel.findOne({id: "ac-11"}); // Delete later
        const HODAcademicModel = await AcademicStaffModel.findOne({member: HODStaffModel._id}); // member: req.user.id or member: req.user._id.

        for(let index = 0; index < body.length; index++) {
            const errorMessage = {};
            errorMessage.request = body[index];

            const {courseID, member} = body[index];
            const course = await CourseModel.findOne({id: courseID});
            const courseInstructorStaffModel = await StaffMemberModel.findOne({id: member});
            var courseInstructorAcademicModel = null;
            if(courseInstructorStaffModel)
                  courseInstructorAcademicModel = await AcademicStaffModel.findOne({member: courseInstructorStaffModel._id});

            if(!course) 
                errorMessage.unfoundCourse = true;
            if(!courseInstructorAcademicModel) 
                errorMessage.unfoundAcademicMember = true;
            
            if(courseInstructorAcademicModel) {
                if(courseInstructorAcademicModel.type != 'Course Instructor')
                    errorMessage.memberNotCourseInstructor = true;
                
                    if(course) {
                        if(!course.department.equals(HODAcademicModel.department))
                            errorMessage.courseNotunderHODDepartment = true;
                        if(!course.department.equals(courseInstructorAcademicModel.department))
                            errorMessage.memberNotBelongingtoCourseDep = true;
                    }
                    else {
                        errorMessage.courseNotunderHODDepartment = true;
                        errorMessage.memberNotBelongingtoCourseDep = true;
                    }
            }
            else {
                errorMessage.memberNotCourseInstructor = true;

                if(course) {
                    if(!course.department.equals(HODAcademicModel.department))
                        errorMessage.courseNotunderHODDepartment = true;
                    errorMessage.memberNotBelongingtoCourseDep = true;
                }
                else {
                    errorMessage.courseNotunderHODDepartment = true;
                    errorMessage.memberNotBelongingtoCourseDep = true;
                }
            }


            if(Object.keys(errorMessage).length == 1) {
                var isAssigned = courseInstructorAcademicModel.courses.some(function (assignedCourse) {
                    return assignedCourse.equals(course._id.toString());
                });
                if(isAssigned) {
                    errorMessage.courseInstructorAlreadyAssigned = true;
                    errorMessages.push(errorMessage);
                }
                else {
                    if(course.academic_staff.length == 0) {
                        course.academic_staf = [];
                    }
                    course.academic_staff.push(courseInstructorAcademicModel._id);
                    await course.save();

                    if(courseInstructorAcademicModel.courses.length == 0) {
                        courseInstructorAcademicModel.courses = [];
                    }
                    courseInstructorAcademicModel.courses.push(course._id);
                    await courseInstructorAcademicModel.save();
                }
            }
            else
                errorMessages.push(errorMessage);
    }

    if(errorMessages.length != 0)   
        return res.status(400).json(errorMessages);
    else
        return res.status(200).send("Operation done successfully!");
 //   }
  /*  else {
        return res.status(401).send('Access Denied!');
    } */
})

app.post('/updateAcademicMemberstoCourses', async (req, res) => {
    //  if(req.user.academicRole == "Course Instructor") {
        const body = req.body;
        const errorMessages = [];

        const InstructorStaffModel = await StaffMemberModel.findOne({id: "ac-11"}); // Delete later
        const InstructorModel = await AcademicStaffModel.findOne({member: InstructorStaffModel._id}); // member: req.user.id or member: req.user._id.

        for(let index = 0; index < body.length; index++) {
            const errorMessage = {};
            errorMessage.request = body[index];

            const {courseID, oldMember, newMember} = body[index];
            const course = await CourseModel.findOne({id: courseID});
            const oldStaff = await StaffMemberModel.findOne({id: oldMember});
            var oldAcademic = null;
            if(oldStaff)
                oldAcademic = await AcademicStaffModel.findOne({member: oldStaff._id});
            const newStaff = await StaffMemberModel.findOne({id: newMember});
            var newAcademic = null;
            if(newStaff)
                newAcademic = await AcademicStaffModel.findOne({member: newStaff._id});

            if(!course) 
                errorMessage.unfoundCourse = true;
            if(!oldAcademic) 
                errorMessage.unfoundAcademicOldMember = true;
            if(!newAcademic) 
                errorMessage.unfoundAcademicNewMember = true;

            if(newAcademic) {
                    if(course) {
                        if(!newAcademic.department.equals(course.department))
                            errorMessage.newMemberNotBelongingtoCourseDep = true;

                        var isAssigned = InstructorModel.courses.some(function (assignedCourse) {
                            return assignedCourse.equals(course._id.toString());
                        });
                        if(!isAssigned) 
                            errorMessage.notAssignedToCourse = true;

                        if(oldAcademic) {
                            var isAssignedOld = oldAcademic.courses.some(function (assignedCourse) {
                                return assignedCourse.equals(course._id.toString());
                            });
                            if(!isAssignedOld)
                                errorMessage.oldNotAssignedToCourse = true;  
                        }
                        else 
                            errorMessage.oldNotAssignedToCourse = true;  
                    }
                    else {
                        errorMessage.newMemberNotBelongingtoCourseDep = true;
                        errorMessage.notAssignedToCourse = true;
                        errorMessage.oldNotAssignedToCourse = true;
                    }
            }
            else  {
            errorMessage.newMemberNotBelongingtoCourseDep = true;

            if(course) {
                var isAssigned = InstructorModel.courses.some(function (assignedCourse) {
                    return assignedCourse.equals(course._id.toString());
                });
                if(!isAssigned) 
                    errorMessage.notAssignedToCourse = true;

                if(oldAcademic) {
                    var isAssignedOld = oldAcademic.courses.some(function (assignedCourse) {
                        return assignedCourse.equals(course._id.toString());
                    });
                    if(!isAssignedOld)
                        errorMessage.oldNotAssignedToCourse = true;  
                }
                else 
                    errorMessage.oldNotAssignedToCourse = true;  
            }
            else {
                errorMessage.notAssignedToCourse = true;
                errorMessage.oldNotAssignedToCourse = true;
            }
        }    
            if(Object.keys(errorMessage).length == 1) {
                    var isAssignedNew = newAcademic.courses.some(function (assignedCourse) {
                        return assignedCourse.equals(course._id.toString());
                    });
                    if(isAssignedNew) {
                        errorMessage.newMemberAlreadyAssigned = true;
                        errorMessages.push(errorMessage);
                    }

                    else {
                        course.academic_staff.pull(oldAcademic._id);
                        if(course.academic_staff.length == 0)
                            course.academic_staff = [];
                        course.academic_staff.push(newAcademic._id);
                        await course.save();

                        oldAcademic.courses.pull(course._id);
                        await oldAcademic.save();

                        if(newAcademic.courses.length == 0)
                            newAcademic.courses = [];
                        newAcademic.courses.push(course._id);
                        await newAcademic.save();
                    }
           }
           else 
                errorMessages.push(errorMessage);
    }
    if(errorMessages.length != 0)   
        return res.status(400).json(errorMessages);
    else
        return res.status(200).send("Operation done successfully!");
    /*else {
      return res.status(401).send('Access Denied!');
  }*/
});

app.delete('/deleteAcademicMemberstoCourses', async (req, res) => {
    //  if(req.user.academicRole == "Course Instructor") {
        const body = req.body;
        const errorMessages = [];

        const InstructorStaffModel = await StaffMemberModel.findOne({id: "ac-11"}); // Delete later
        const InstructorModel = await AcademicStaffModel.findOne({member: InstructorStaffModel._id}); // member: req.user.id or member: req.user._id.

        for(let index = 0; index < body.length; index++) {
            const errorMessage = {};
            errorMessage.request = body[index];

            const {courseID, member} = body[index];
            const course = await CourseModel.findOne({id: courseID});
            const staffMember = await StaffMemberModel.findOne({id: member});
            var academicMember = null;
            if(staffMember)
                academicMember = await AcademicStaffModel.findOne({member: staffMember._id});

            if(!course) 
                errorMessage.unfoundCourse = true;
            if(!academicMember) 
                errorMessage.unfoundAcademicMember = true;

            if(newAcademic) {
                    if(course) {
                        if(!newAcademic.department.equals(course.department))
                            errorMessage.newMemberNotBelongingtoCourseDep = true;

                        var isAssigned = InstructorModel.courses.some(function (assignedCourse) {
                            return assignedCourse.equals(course._id.toString());
                        });
                        if(!isAssigned) 
                            errorMessage.notAssignedToCourse = true;

                        if(oldAcademic) {
                            var isAssignedOld = oldAcademic.courses.some(function (assignedCourse) {
                                return assignedCourse.equals(course._id.toString());
                            });
                            if(!isAssignedOld)
                                errorMessage.oldNotAssignedToCourse = true;  
                        }
                        else 
                            errorMessage.oldNotAssignedToCourse = true;  
                    }
                    else {
                        errorMessage.newMemberNotBelongingtoCourseDep = true;
                        errorMessage.notAssignedToCourse = true;
                        errorMessage.oldNotAssignedToCourse = true;
                    }
            }
            else  {
            errorMessage.newMemberNotBelongingtoCourseDep = true;

            if(course) {
                var isAssigned = InstructorModel.courses.some(function (assignedCourse) {
                    return assignedCourse.equals(course._id.toString());
                });
                if(!isAssigned) 
                    errorMessage.notAssignedToCourse = true;

                if(oldAcademic) {
                    var isAssignedOld = oldAcademic.courses.some(function (assignedCourse) {
                        return assignedCourse.equals(course._id.toString());
                    });
                    if(!isAssignedOld)
                        errorMessage.oldNotAssignedToCourse = true;  
                }
                else 
                    errorMessage.oldNotAssignedToCourse = true;  
            }
            else {
                errorMessage.notAssignedToCourse = true;
                errorMessage.oldNotAssignedToCourse = true;
            }
        }    
            if(Object.keys(errorMessage).length == 1) {
                    var isAssignedNew = newAcademic.courses.some(function (assignedCourse) {
                        return assignedCourse.equals(course._id.toString());
                    });
                    if(isAssignedNew) {
                        errorMessage.newMemberAlreadyAssigned = true;
                        errorMessages.push(errorMessage);
                    }

                    else {
                        course.academic_staff.pull(oldAcademic._id);
                        if(course.academic_staff.length == 0)
                            course.academic_staff = [];
                        course.academic_staff.push(newAcademic._id);
                        await course.save();

                        oldAcademic.courses.pull(course._id);
                        await oldAcademic.save();

                        if(newAcademic.courses.length == 0)
                            newAcademic.courses = [];
                        newAcademic.courses.push(course._id);
                        await newAcademic.save();
                    }
           }
           else 
                errorMessages.push(errorMessage);
    }
    if(errorMessages.length != 0)   
        return res.status(400).json(errorMessages);
    else
        return res.status(200).send("Operation done successfully!");
    /*else {
      return res.status(401).send('Access Denied!');
  }*/
});

app.post('/addCourse', async (req, res) => {
    const departmentName = req.body.departmentName;
    const department = await DepartmentModel.findOne({name: departmentName});

    const course = new CourseModel({
        id: "DMET502",
        name: "Computer Graphics",
        course_coordinator: "5fde354af9102b1b1467f1a9",
        department: department._id
    });
    await course.save();
});

app.post('/addLocation', async (req, res) => {
    const location = new LocationModel({
        id: "C7.203",
        type: "Office",
        maximum_capacity: 4
    });
    await location.save();
});

app.post('/addFaculty', async (req, res) => {
    const faculty = new FacultyModel({
        name: "Engineering"
    });
    await faculty.save();
});

app.post('/addDepartment', async (req, res) => {
    const department = new DepartmentModel({
        name: "DMET"
    });
    await department.save();
});

// Data hardcoded now but will put as endpoint params.
app.post('/addAcademicStaffMember', async (req, res) => {
    const doc = await CounterModel.findById('ac-');
    if(!doc) {
        const counterAcademic = new CounterModel({
            _id: 'ac-'
        });
        await counterAcademic.save();
    }
    // Search for location id.
    const location = await LocationModel.findOne({id: "C7.203"});
    
    // Add to StaffMemberModelFirst.
    const staffMemberTemp = new StaffMemberModel({
        name: "Maya Ahmed",
        email: "maya@gmail.com",
        salary: 6000,
        office: location._id,
        staff_type: "Academic Member",
    });
    await staffMemberTemp.save();

    // Then add to AcademicStaffModel.
    const staffMember = await StaffMemberModel.findOne({email: "maya@gmail.com"}); // Find the id JavaScript added to the tuple we inserted.
    const faculty = await FacultyModel.findOne({name: "Engineering"}); // Find the id JavaScript added to the tuple we inserted.
    const department = await DepartmentModel.findOne({name: "DMET"}); // Find the id JavaScript added to the tuple we inserted.
    const academicMember = new AcademicStaffModel({
        member: staffMember._id,
        faculty: faculty._id,
        department: department._id,
        type: "Course Instructor",
        day_off: "Friday"
    });
    await academicMember.save();
    
});

app.post('/changeDayOff', async(req,res)=>{
    //input will be new day off (req.body.newDayOff , (OPTIONAL) req.user.reason)
    const staff = await StaffMemberModel.findOne({id: 'ac-11'});
    const type=staff.staff_type
    if(type=="HR"){
        return res.json("HR are not permitted to send this request.Only academic members are allowed.")
    }

    const academic=await AcademicStaffModel.findOne({member:staff._id})
    const schedule=academic.schedule

    if(req.body.newDayOff=="Friday"){
        return res.json("Friday is already a day off.Please submit a new day")
    }
    for(var i=0;i<schedule.length;i++){
        const slotDay=schedule[i].day
        if(slotDay==req.body.newDayOff){
            return res.json("Cannot request for a day off on a day with teaching activities")
        }
    }
     //getting department of this user to get head of department to send request to
     const departmentID=academic.department
     const department=await DepartmentModel.findById(departmentID)
     const hodID=department.HOD
     const hodAcademic=await AcademicStaffModel.findById(hodID)
    

    //make a request
    const reason=""
    if(req.body.request)
    reason=req.body.reason

    var req=new RequestModel({
        reqType:"Change Day off",
        newDayOff:req.body.newDayOff,
        sentBy:staff._id,
        sentTo:hodAcademic.member,
        state:"Pending",
        reason:reason,
        submission_date:new moment()
    })
    try{
     res.json("Request successfully submitted")
    await req.save()
    }
    catch(err){
        res.json(err)
    }

    //sending notification to hod
    const notification=(await StaffMemberModel.findById(hodAcademic.member)).notifications
    const notNew=notification
    notNew[notNew.length]="You received a new slot linking request"
    const staffReplacement= await StaffMemberModel.findByIdAndUpdate(hodAcademic.member,{notifications:notNew})
});

app.post('/sickLeave', async(req,res)=>{
    //input is sick day date and medical documents (req.body.sickDay , req.body.medicalDoc, OPTIONAL req.body.reason)
    const staff=await StaffMemberModel.findOne({id: "ac-13"});
    const type=staff.staff_type
    if(type=="HR"){
        return res.json("HR are not permitted to send slot slinking requests.Only academic members are allowed.")
    }
    const sickDay=req.body.sickDay
    //getting all days allowed to send request which is 3 days from today
    var diff3=moment().subtract(3, "days").format("YYYY-MM-DD");
   var diff2=moment().subtract(2, "days").format("YYYY-MM-DD");
   var diff1=moment().subtract(1, "days").format("YYYY-MM-DD");
   var diff0=moment().format("YYYY-MM-DD");

   if(sickDay==diff0 ||sickDay==diff1 || sickDay==diff2 ||sickDay==diff3 ){
       //no medical documents submitted
        if(!req.body.medicalDoc){
            return res.json("Medical documents to prove medical condition must be submitted with the request.")
        }

        //medical documents submitted
        else{
    //getting hod
    const academic=await AcademicStaffModel.findOne({member:staff._id})
    const departmentID=academic.department
    const department=await DepartmentModel.findById(departmentID)
    const hodID=department.HOD
    const hodAcademic=await AcademicStaffModel.findById(hodID)
    
    //create request
    var reason=''
    if(req.body.reason)
    reason=req.body.reason
        var req=new RequestModel({
            reqType:"Sick Leave",
            sickDay:new Date(sickDay),
            sentBy:staff._id,
            sentTo:hodAcademic.member,
            medicalDoc:req.body.medicalDoc,
            state:"Pending",
            reason:reason,
            submission_date:new moment()
        })
        try{
        await req.save()
        res.json("Request successfully submitted")
        }
        catch(err){
            res.json(err)
        }


         //send notification to hod
    const notification=(await StaffMemberModel.findById(hodAcademic.member)).notifications
    const notNew=notification
    notNew[notNew.length]="You received a new accidental leave request"
    const staffReplacement= await StaffMemberModel.findByIdAndUpdate(hodAcademic.member,{notifications:notNew})
    }

   }


   //request sent after 3 days deadline has passed
   else {
       return res.json("Deadline for sending sick leave request has been exceeded.\n Cannot send request")
   }


})

app.post('/maternityLeave',async(req,res)=>{
    //(req.body.maternityDoc, OPTIONAL req.body.reason)
    const user=await StaffMemberModel.findOne({id: "ac-13"});
    const type=user.staff_type
    if(type=="HR"){
        return res.json("HR are not permitted to send slot slinking requests.Only academic members are allowed.")
    }
       // const user=await StaffMemberModel.findById(req.user.id)
        const gender= "Female"
        if(gender!="Female"){
            return res.json("Only female staff members are eligible to send this request.")
        }
        if(!req.body.maternityDoc){
            return res.json("Documents to prove the maternity condition must be submitted.")
        }
        const academic=await AcademicStaffModel.findOne({member:user._id})
        const departmentID=academic.department
        const department=await DepartmentModel.findById(departmentID)
        const hodID=department.HOD
        const hodAcademic=await AcademicStaffModel.findById(hodID)

         //create request
         var reason=''
         if(req.body.reason)
         reason=req.body.reason
         var req=new RequestModel({
            reqType:"Maternity Leave",
            sentBy:user._id,
            sentTo:hodAcademic.member,
            maternityDoc: req.body.maternityDoc,
            state:"Pending",
            reason:reason,
            submission_date:new moment()
        })
        try{
        await req.save()
        res.json("Request successfully submitted")
        }
        catch(err){
            res.json(err)
        }

        //send notification to hod
    const notification=(await StaffMemberModel.findById(hodAcademic.member)).notifications
    const notNew=notification
    notNew[notNew.length]="You received a new accidental leave request"
    const staffReplacement= await StaffMemberModel.findByIdAndUpdate(hodAcademic.member,{notifications:notNew})

})

app.post('/login',async(req,res,next)=>{
    console.log("here in login")
    try{
        const{email,password}=req.body;
        if(!email ){
            return res.status(400).json("Please enter valid email ");
        }
        if(!password)
        return res.status(400).json("Please enter valid  password");

        const existingUser=await StaffMemberModel.findOne({email:email})
        if(!existingUser){
            return res.status(400).json({msg:"This user is not registered"});
        }
        else{
            //user first login original pass='123456'
            // if(existingUser.newStaffMember===true){
            //     res.status(500).json("Please enter new password")
            // }
            
            
            const isMatched= await bcrypt.compare(password,existingUser.password);       //comparing password entered text with password of the user we got from the database            
            if(!existingUser.newStaffMember && !isMatched){
                 return res.status(400).json({msg:"Please enter correct password"});
             }
             
             else if(existingUser.staff_type=="HR"){
                const token=await jwt.sign({id:existingUser._id,role:existingUser.staff_type,academic_role:'',isHead:false,isCoordinator:false},process.env.TOKEN_SECRET);
               // res.header('auth-token', token).send(token);
               if(existingUser.newStaffMember===true){
                return res.status(500).json({error:"Please enter new password ",token:token})
                }
             return  res.json({token,existingUser});
            }
            else{
                
                const user=await AcademicStaffModel.findOne({member:existingUser._id});
                console.log("user= "+user)
                const token=await jwt.sign({id:existingUser._id,role:existingUser.staff_type,academic_role:user.type,isHead:user.isHOD,isCoordinator:user.isCoordinator},process.env.TOKEN_SECRET);
               // res.header('auth-token', token).send(token);
               if(existingUser.newStaffMember===true){
                return  res.status(500).json({err:"Please enter new password ",token:token})
            }
            return  (res.json({token}));

         }
        
    }
}
        catch(err){
          return  res.status(500).json({error:err.message});
        }
    
})

//user first login should change password hash it and update his account
app.put('/enterNewPass', authenticateToken, async(req,res)=>{

    
    const passNew=req.body.newPassword;
    const passCheck=req.body.passCheck;
    const user=await StaffMemberModel.findById(req.user.id)
    if(passNew!=passCheck){
        return res.status(400).json({msg:"Passwords should match"});
    }
    else{
        console.log("in else")
        console.log(req.user.id)
        const salt=await bcrypt.genSalt();     
        const hashedPassword=await bcrypt.hash(passNew,salt);
        console.log("hashed pass= "+hashedPassword)
        try{
      await  StaffMemberModel.findByIdAndUpdate(req.user.id,{password:hashedPassword,newStaffMember:false})
      return  res.json( await StaffMemberModel.findById(req.user.id))
        }
        catch(err){
           return res.json(err)
        }
      
    }

   
        
})

app.listen(process.env.PORT);



























