// Models.
const StaffMemberModel = require('./Models/StaffMemberModel.js');
const HRModel = require('./Models/HRModel.js');
const AcademicStaffModel = require('./Models/AcademicStaffModel.js');
const LocationModel = require('./Models/LocationModel.js');
const FacultyModel = require('./Models/FacultyModel.js');
const DepartmentModel = require('./Models/DepartmentModel.js');
const CourseModel = require('./Models/CourseModel.js');
const CounterModel = require('./Models/CounterModel.js');

// For environmental variables.
require('dotenv').config();

// For database instance.
const mongoose = require('mongoose');

// For app singleton instance.
const {app} = require('./app.js');
const slotSchema = require('./Models/SlotSchema.js');

// Database connection parameters.
const databaseParameters = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(process.env.DB_URL, databaseParameters)
.then(console.log('Successfully Connected to The Database'));

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
        return res.send(returnArray);         
 // }
  /*else {
      res.status(401).send('Access Denied!');
  }*/
});

app.post('/viewDepartmentStaffMemberDayOff', async (req, res) => {
    //  if(req.user.isHod) {
        const {memberID} = req.body;
        const HODStaffModel = await StaffMemberModel.findOne({id: "ac-11"}); // Delete later.
        const HODAcademicModel = await AcademicStaffModel.findOne({member: HODStaffModel._id}); // member: req.user.id or member: req.user._id.
        const HODDepartment = HODAcademicModel.department;

        const staffMemberModel = await StaffMemberModel.findOne({id: memberID});
        const academicMemberModel = await AcademicStaffModel.findOne({member: staffMemberModel._id});

        if(academicMemberModel.department.equals(HODDepartment)) {
            const returnObject = {
            academicStaffMemberName: staffMemberModel.name,
            dayOff: academicMemberModel.day_off
          };
          return res.send(returnObject);
        }
        else {
            res.status(401).send("Staff member not in your department!");
        }

                
 // }
  /*else {
      res.status(401).send('Access Denied!');
  }*/
});

app.post('/addCourseSlot', async (req, res) => {
    //  if(req.user.isCourseCoordinator) {
    const {courseID, details} = req.body;
    const course = await CourseModel.findOne({id: courseID});
    if(!course) return res.status(400).send("Course not found!");

    const CCStaffModel = await StaffMemberModel.findOne({id: "ac-11"}); // Delete later.
    const CCAcademicModel = await AcademicStaffModel.findOne({member: CCStaffModel._id}); // member: req.user.id or member: req.user._id.
    if(!course.course_coordinator.equals(CCAcademicModel._id)) {
        return res.status(401).send("You are not a course coordinator for this course!");
    }
    const errorMessage = {locationsNotFound: [], unprocessedSlots: []};

    for(let index = 0; index < details.length; index++) {
        const {number, day, locationID} = details[index];
        const location = await LocationModel.findOne({id: locationID});
        if(!location) {
            errorMessage.locationsNotFound.push(locationID);
            errorMessage.unprocessedSlots.push(details[index]);
        }
        else {
            const newCourseSlot = {
                day: day,
                number: number,
                location: location._id
            };
            course.schedule.push(newCourseSlot);
            course.slots_needed++;
            await course.save();
    }
}
      return res.status(400).json(errorMessage);

      // }
    /*else {
      res.status(401).send('Access Denied!');
  }*/
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
// Route 1.
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
        res.status(401).send('Access Denied!');
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
      res.status(401).send('Access Denied!');
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
app.listen(process.env.PORT);



























/*const express = require('express');
const app =express();
const mongoose =require('mongoose');

//for testing-----------------------------------------
const StaffMemberRoutes=require('./Routes/StaffMemberRoutes')
const department=require('./Models/DepartmentModel')
const AcademicStaffModel=require('./Models/AcademicStaffModel')
const faculty=require('./Models/FacultyModel')
const location=require('./Models/LocationModel');
const StaffMemberModel = require('./Models/StaffMemberModel');
//----------------------------------------------
require('dotenv').config()

//app.use(express.json())
var bodyParser = require('body-parser')
app.use(bodyParser.json())
//app.use(bodyParser.urlencoded({ extended: false}));
//app.use(express.urlencoded({extended: false}));
const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}
//process.env.db_test_URL
mongoose.connect(process.env.db_URL, connectionParams).then(()=>{
    console.log("db successfully connected");
}).catch(()=>{
    console.log("db is not connected");
});


app.listen(3000);
app.use(StaffMemberRoutes);


//for testin only------------------------------------REMOVE AFTERRRRRRRRRRR TESTINGGGGGGGGGGGGGGGGGGGGG--
//---------------------------------------------------INSERTING IN TABLES DEPARTMENT ,FACULTY ,STAFF MEMBER ,ACADEMIC MEMBER
app.post('/addFaculty',async(req,res)=>{
    const fac=new faculty({name:req.body.name})
   await fac.save();
   res.json(fac)

   //"name":"met"
})

app.post('/addDepart',async(req,res)=>{
    // fac=faculty.find({name:"met"})
    const fac=(await faculty.find({name:req.body.facName}))[0]._id
    const dep=new department({name:req.body.name,faculty:fac})
    await dep.save();
    res.json(dep)
   // console.log(dep)
    //"name":"engineering",
    //"facName":"met"

})

app.post('/addLoc',async(req,res)=>{
    const loc=new location(req.body)
    await loc.save()
    res.json(loc)

    //   "id":"c7.101",
    // "type":"Tutorial Room",
    // "maximum_capacity":"15"
})



app.post('/Member',async(req,res)=>{
    // const office3=(await location.find({id:req.body.office}))[0]._id
    // console.log(office3)
    // const fac=(await faculty.find({name:"met"}))[0]._id;
    // console.log(fac)
//     //res.json(req.body)
//     // if(!req.body.id){
//     //     res.json("please enter id")
//     // }
//     // else res.json(req.body.id)
//    // console.log("lala")
//     //else{
//     const name2=req.body.name
//     const id2=req.body.id
//     const email2=req.body.email
//     const salary2=req.body.salary
//     const office2=(await location.find({id:req.body.office}))[0]._id
//     const staff_type2=req.body.staff_type
//     console.log(name2)
//     console.log(id2)
//     console.log(email2)
//     console.log(salary2)
//     console.log(office2)
//     console.log(staff_type2)
//     const mem=new StaffMemberModel({name:name2},{id:id2},{email:email2},{salary:salary2},{office:office2},{staff_type:staff_type2});
//     try{
//     await mem.save();
//     res.json(mem)
//         }
//     catch(err){
//         res.json(err)
//        }
    // //}
    
//    "name":"nada"
//    ,"id":"ac-2"
//    ,"email":"nada99@gmail.com"
//    ,"salary":"2000"
//    ,"office":"c7.101"
//    ,"staff_type":"Assistant"
})

const  memeee=new StaffMemberModel({
    name:"asdad",
    id:1,
    email:"dasdasd",
    salary:22,
    office:"5fda77733d34934a248e3e08",
    staff_type:"HR"

})
memeee.save();
console.log(memeee)


app.post('/addAc',async(req,res)=>{
   // res.json(req.body)
    
    if(!req.body.faculty || !req.body.type){
        res.json("need faculty and type")
    }
    else{
     const memb=StaffMemberModel.find({id:req.body.id})._id;
    const dep=department.find({name:req.body.dep})._id;
    const fac=faculty.find({name:req.body.faculty})._id;
    const type=req.body.type;
    
    try{
        const user=new AcademicStaffModel({member:memb},{department:dep},{faculty:fac},{type:req.body.type});
        await user.save();
        res.json(user)
    }
    catch(err){
        res.json(err)
    }
    }
//    ,"id":"ac-3"
//    ,"dep":"engineering"
//    ,"faculty":"met"
//    ,"type":"Academic Member"
})
*/
