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
//const authenticateToken=require('../Routes/StaffMemberRoutes')

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
router.post('/sendReplacementRequest',authenticateToken,async(req,res)=>{
        console.log("req.user= "+req.user.id)
        const user=await StaffMemberModel.findById(req.user.id)
        const slotNum=req.body.slotNum
        const slotDate=req.body.slotDate
        const slotLoc=req.body.slotLoc
        var checkFin=false;
        const id=req.user.id
        // if(moment(slotDate).isBefore(new moment())){
        //     return res.json("Cannot replace a slot that has already passed")
        // }
        if(user.staff_type=="HR"){
            return (res.json({error:"HR cannot make replacement requests"}))
        }
        const academicUser=await AcademicStaffModel.findOne({member:req.user.id})
        var check=false
        const slots=academicUser.schedule
        var course=''
        var courseID=""
        


        //check if slot user is wanting to replace is available in his schedule
        for(var i=0;i<slots.length;i++){
            const locID=slots[i].location
            const loc=(await location.findById(locID)).id
            const date=slots[i].date
            const number=slots[i].number
            console.log(moment(date).format("YYYY-MM-DD")==moment(slotDate).format("YYYY-MM-DD"))
            if(loc==slotLoc && slotNum==number &&moment(date).format("YYYY-MM-DD")==moment(slotDate).format("YYYY-MM-DD")){
                check=true
                course=(await Course.findById(slots[i].course))
                 courseID=course.id
                 console.log(course.name)
            }

        }
        if(check==false)
        return res.send("This slot is not present in your schedule")

        //will loop on all slots of each member that teaches this course 
        //to make sure that they are free during this replacement slot
        const courseAcademic=course.academic_staff
        console.log(course.id)

        //looping on staff giving the course of replacement slot
        for(var j=0;j<courseAcademic.length;j++){
            console.log("in c1 "+courseAcademic[j])
            const replacement=await AcademicStaffModel.findById(courseAcademic[j])
            const staff= await StaffMemberModel.findById(replacement.member)
            console.log("l= "+staff.name)
            
            const replacementSchedule=replacement.schedule
            console.log("rep "+replacement.schedule)
            var check2=false;

            //looping on schedule of each member
            for(var k=0;k<replacementSchedule.length;k++){
            console.log("sched= "+replacementSchedule[k])
            const currLocID=replacementSchedule[k].location
            const currLoc=(await location.findById(currLocID)).id
            const currDate=replacementSchedule[k].date
            const currNumber=replacementSchedule[k].number

             console.log("loc "+currLocID)
            console.log("currLoc "+currLoc)
            console.log("slotLoc "+slotLoc)
            console.log("currdate "+currDate)
            console.log("slotNum "+currNumber)
            console.log("number "+slotNum)
            console.log(moment(currDate).format("YYYY-MM-DD")==moment(slotDate).format("YYYY-MM-DD"))
            //if finding same slot
            if(currLoc==slotLoc && currNumber==slotNum &&moment(currDate).format("YYYY-MM-DD")==moment(slotDate).format("YYYY-MM-DD")){
                    check2=true
                    console.log("check2"+check2)
            }
            }
           // var id=req.user.id
            console.log("teest ="+id)
            //if no such slot is found create a request for this member
            if(check2==false){
                //create new request
                console.log("checkk2 "+check2)
                console.log("req="+id)
                var req=new request({
                    reqType:"Replacement",
                    slotDate:slotDate,
                    slotNum:slotNum,
                    slotLoc:slotLoc,
                    sentBy:id,
                    sentTo:replacement.member,
                    state:"Pending",
                    submission_date:new moment()
                })
                //update notifications of person receiving request
                const notification=(await StaffMemberModel.findById(replacement.member)).notifications
                const notNew=notification
                notNew[notNew.length]="You received a new replacement request"
                const staffReplacement= await StaffMemberModel.findByIdAndUpdate(replacement.member,{notifications:notNew})
                

                //post request in requests table with sent to added
                try{
                    console.log("saved")
                    checkFin=true
                    const requ= await req.save()
                }
                catch(err){
                    res.json(err)
                }
            }

        }
        if(checkFin)
        return  res.json({success:"Requests successfully sent"})
        else
      return res.json({error:"Could not find any eligible candidate to replace with"})
        
})
router.get('/sentReplacementRequests',authenticateToken,async(req,res)=>{
    //get all requests where id of sender is this user
        const sent=await request.find({sentBy:req.user.id})
        for(var i=0;i<sent.length;i++){
            //get name of request receiver to print
                reqType=sent[i].reqType
                const sentTo=(await StaffMemberModel.findById(sent[i].sentTo))
                const name=sentTo.name
                if(reqType=="Replacement"){
                    res.write("request_type: "+sent[i].reqType+"\n")
                    res.write( "request_state: "+sent[i].state+"\n")
                    res.write( "sentTo: "+name+"\n")
                    res.write( "slot_number: "+sent[i].slotNum+"\n")
                    res.write( "slot_date: "+ sent[i].slotDate+"\n")
                    res.write( "slot_location: "+sent[i].slotLoc+"\n")
                    res.write( "submission_date "+sent[i].submission_date+"\n")
                    res.write("\n")
                }
                if(reqType=="Accidental Leave || Sick Leave|| Maternity Leave"){
                    res.write("request_type: "+sent[i].reqType+"\n")
                    res.write( "request_state: "+sent[i].state+"\n")
                    res.write( "sentTo: "+name+"\n")
                    res.write( "submission_date "+sent[i].submission_date+"\n")
                    res.write("\n")
                }
                
        }
        if(sent.length==0)
        res.write("There are no sent requests")

        res.end()
        return 
})

router.get('/receivedReplacementRequests',authenticateToken,async(req,res)=>{
    //get requests where sentTo is equal this user
    const sent=await request.find({sentTo:req.user.id})
    for(var i=0;i<sent.length;i++){
            reqType=sent[i].reqType
            const sentBy=(await StaffMemberModel.findById(sent[i].sentBy))
            const name=sentBy.name
            if(reqType=="Replacement"){
                
                res.write("request_type: "+sent[i].reqType+"\n")
                    res.write( "request_state: "+sent[i].state+"\n")
                    res.write( "sentBy: "+name+"\n")
                    res.write( "slot_number: "+sent[i].slotNum+"\n")
                    res.write( "slot_date: "+ sent[i].slotDate+"\n")
                    res.write( "slot_location: "+sent[i].slotLoc+"\n")
                    res.write( "submission_date "+sent[i].submission_date+"\n")
                    res.write("\n")
            }
            if(reqType=="Accidental Leave || Sick Leave|| Maternity Leave"){
                res.write("request_type: "+sent[i].reqType+"\n")
                res.write( "request_state: "+sent[i].state+"\n")
                res.write( "sentBy: "+name+"\n")
                res.write( "submission_date "+sent[i].submission_date+"\n")
                res.write("\n")
            }
           
    }
    if(sent.length==0)
    res.write("There are noe received requests")
    res.end()
    return 
})


router.post('/SlotLinkingRequest',authenticateToken,async(req,res)=>{
    //input course name slot number and slot day
    const courseName=await Course.findOne({id:req.body.courseID})
    const courseCoordinatorID=courseName.course_coordinator
    const courseCoordinator= await AcademicStaffModel.findById(courseCoordinatorID)
    const coordinatorName=courseCoordinator.name
    const slotNum=req.body.slotNum
    const slotDay=req.body.slotDay
    const academicUser=await AcademicStaffModel.findOne({member:req.user.id})
    const schedule=academicUser.schedule
    var check=false;
    for(var i=0;i<schedule.length;i++){
            if(schedule[i].day==slotDay && schedule[i].number==slotNum){
                return res.send("User already has teaching activities during this slot. Cannot send this request")
            }
    }
    var req=new request({
        reqType:"Slot Linking",
        slotDate:slotDate,
        slotNum:slotNum,
        slotLoc:slotLoc,
        sentBy:id,
        sentTo:replacement.member,
        state:"Pending",
        submission_date:new moment()
    })

})

module.exports=router;
