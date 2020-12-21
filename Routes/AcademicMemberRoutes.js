const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt=require('bcrypt');
const router = express.Router();
const AcademicStaff = require('../Models/AcademicStaffModel.js');
const HR = require('../Models/HRModel.js');
const StaffMemberModel = require('../Models/StaffMemberModel.js');
const HRModel = require('../Models/HRModel.js');
const AcademicStaffModel = require('../Models/AcademicStaffModel.js');
const Course=require('../Models/CourseModel.js')
const location=require('../Models/LocationModel.js')
const department=require('../Models/DepartmentModel.js')
const faculty=require('../Models/FacultyModel.js')
const AttendanceSchema=StaffMemberModel.attendanceSchema
const monthlyHoursSchema=StaffMemberModel.monthlyHoursSchema
var moment = require('moment');
const request=require('../Models/RequestSchema.js')
const authenticateToken=require('../Routes/StaffMemberRoutes')

// router.post('sendReplacementRequest',authenticateToken,async(req,res)=>{
//         const user=await StaffMemberModel.findById(req.user.id)
//         const slotNum=req.body.slotNum
//         const slotDate=req.body.slotDate
//         const slotLoc=req.body.slotLoc
//         //const repID=req.body.id
//         if(moment(slotDate).isBefore(new moment())){

//         }
//         if(user.staff_type=="HR"){
//             return (res.json({error:"HR cannot make replacement requests"}))
//         }
//         const academicUser=await AcademicStaffModel.findOne({member:req.user.id})
//         var check=false
//         const slots=cademicUser.schedule
//         var course=''
//         var courseID=""
//         if(moment(slotDate).isBefore(new moment())){
//             return res.json("Cannot replace a slot that has already passed")
//         }


//         //check if slot user is wanting to replace is available in his schedule
//         for(var i=0;i<slots.length;i++){
//             const locID=slots[i].location
//             const loc=await location.findById(locID).id
//             const date=slots[i].date
//             const number=slots[i].number
//             if(loc==slotLoc && slotNum==number &&moment(date).format("YYYY-MM-DD")==moment(slotDate).format("YYYY-MM-DD")){
//                 check=true
//                 course=(await Course.findById(slots[i].course))
//                  courseID=course.id
//             }

//         }
//         if(check==false)
//         return res.send("This slot is not present in your schedule")

//         //will loop on all slots of each member that teaches this course 
//         //to make sure that they are free during this replacement slot
//         const courseAcademic=course.academic_staff
//         //looping on staff giving the course of replacement slot
//         for(var j=0;j<courseAcademic.length;j++){
//             const replacement=await AcademicStaffModel.findById(courseAcademic[j])
//             const replacementSchedule=replacement.schedule
//             var check2=false;
//             //looping on schedule of each member
//             for(var k=0;k<replacementSchedule.length;k++){
//             const currLocID=replacementSchedule[i].location
//             const currLoc=await location.findById(currLocID).id
//             const currDate=replacementSchedule[i].date
//             const currNumber=replacementSchedule[i].number
//             //if finding same slot
//             if(currLoc==slotLoc && currNumber==number &&moment(currDate).format("YYYY-MM-DD")==moment(slotDate).format("YYYY-MM-DD")){
//                     check2=true
//             }
//             }
//             //if no such slot is found create a request for this member
//             if(check2==false){
//                 var req=new request({
//                     reqType:"Replacement",
//                     slotDate:slotDate,
//                     slotNum:slotNum,
//                     slotLoc:slotLoc,
//                     sentTo:replacement.member,
//                     state:"Pending",
//                     submission_date:new moment()
//                 })
//               await req.save()
//             }
//         }
        
// })

module.exports=router;
