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
const slotSchema=require('../Models/SlotSchema')
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
    //input(req.body.slotNum , req.body.slotDate , req.body.slotLoc)

        console.log("req.user= "+req.user.id)
        const user=await StaffMemberModel.findById(req.user.id)
        const staff_type=user.staff_type
        if(staff_type=="HR"){
            return res.json("HR cannot submit this request.Only academic staff are permitted.")
        }
        const slotNum=req.body.slotNum
        const slotDate=req.body.slotDate
        const slotLoc=req.body.slotLoc
        var checkFin=false;
        const id=req.user.id
        if(moment(slotDate).format('YYYY-MM-DD')<(new moment().format("YYYY-MM-DD"))){
            return res.json("Cannot replace a slot that has already passed")
        }
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
        return  res.json({success:"Requests successfully submitted"})
        else
      return res.json({error:"Could not find any eligible candidate to replace with"})
        
})
router.get('/sentReplacementRequests',authenticateToken,async(req,res)=>{
    //get all requests where id of sender is this user
    const user=await StaffMemberModel.findById(req.user.id)
    const type=user.staff_type
    if(type=="HR"){
        return res.json("HR do not have replacement requests")
    }
    if(staff_type=="HR"){
        return res.json("HR cannot submit this request.Only academic staff are permitted.")
    }
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
    const user=await StaffMemberModel.findById(req.user.id)
    const type=user.staff_type
    if(type=="HR"){
        return res.json("HR do not have replacement requests")
    }
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
           if(reqType=="Accidental Leave" || reqType=="Sick Leave"||
             reqType== "Maternity Leave"||reqType=="Slot Linking"
             ||reqType=="Change Day off" || reqType=="Compensation Leave"){

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
    //input course name slot number and slot day (req.body.slotDay , req.body.slotNum,OPTIONAL req.body.reason)
    const staff=await StaffMemberModel.findById(req.user.id)
    const type=staff.staff_type
    if(type=="HR"){
        return res.json("HR are not permitted to send slot slinking requests.Only academic members are allowed.")
    }
    const courseName=await Course.findOne({id:req.body.courseID})
    const courseID=courseName.id
    const courseCoordinatorID=courseName.course_coordinator.member
    // const courseCoordinator= await AcademicStaffModel.findById(courseCoordinatorID)
    // const coordinatorName=courseCoordinator.
    
    //will compare slot timings with user schedule to make sure that he is free during this slot
    const slotNum=req.body.slotNum
    const slotDay=req.body.slotDay
    const academic=await AcademicStaffModel.findOne({member:req.user.id})
    const schedule=academic.schedule
    var check=false;



    //check if user already has a slot during the time he is requesting a slot linking for
    for(var i=0;i<schedule.length;i++){
            if(schedule[i].day==slotDay && schedule[i].number==slotNum){
                return res.json("User already has teaching activities during this slot. Cannot send this request")
            }
    }

    //check if user teaches this course
    //const academic=await AcademicStaffModel.find({member:req.user.id})
    const courses=academic.courses
    var teaches=false
    for(var i=0;i<courses.length;i++){
        if(courses[i].id==courseID)
            teaches=true
    }
    if(teaches==false)
    return res.json("Not permitted to send this request because user does not teach this course.")

    //creating new slot linking request
    var reason=''
    if(req.body.reason)
    reason=req.body.reason
    var req=new request({
        reqType:"Slot Linking",
        slotDay:slotDay,
        slotNum:slotNum,
        courseID:courseID,
        sentBy:req.user.id,
        sentTo:courseCoordinatorID,
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

    //sending notification to course coordinator
    const notification=(await StaffMemberModel.findById(courseCoordinatorID)).notifications
                const notNew=notification
                notNew[notNew.length]="You received a new slot linking request"
                const staffReplacement= await StaffMemberModel.findByIdAndUpdate(courseCoordinatorID,{notifications:notNew})

})

router.post('/changeDayOff',authenticateToken,async(req,res)=>{
    //input will be new day off (req.body.newDayOff , (OPTIONAL) req.user.reason)
    const staff=await StaffMemberModel.findById(req.user.id)
    const type=staff.staff_type
    if(type=="HR"){
        return res.json("HR are not permitted to send this request.Only academic members are allowed.")
    }

    const academic=await AcademicStaffModel.findOne({member:req.user.id})
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
     const department=await department.findById(departmentID)
     const hodID=department.HOD
     const hodAcademic=await AcademicStaffModel.findById(hodID)
    

    //make a request
    const reason=""
    if(req.user.request)
    reason=req.user.reason

    var req=new request({
        reqType:"Change Day off",
        newDayOff:req.body.newDayOff,
        sentBy:req.user.id,
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


})

router.post('/accidentalLeave',authenticateToken,async(req,res)=>{
    //input is (req.body.accidentDate , OPTIONAL req.body.reason)
    const staff=await StaffMemberModel.findById(req.user.id)
    const type=staff.staff_type
    if(type=="HR"){
        return res.json("HR are not permitted to send slot slinking requests.Only academic members are allowed.")
    }
    //get annual and accidental leave balance
    const academic=await AcademicStaffModel.findOne({member:req.user.id})
    //const staff=await StaffMemberModel.findById(req.user.id)
    const accidentalDaysLeft=staff.accidentalDaysLeft
    const annual_days=staff.annual_days

    //check of number of accidental days left or annual days is equal to 0
    if(accidentalDaysLeft==0){
        return res.json("Cannot submit request.Maximum number of accidental day leaves have been reached.")
    }
    if(annual_days==0){
        return res.json("Cannot submit request. Annual leave balance is currently empty")
    }

    //make request
    var reason=''
    if(req.body.reason)
    reason=req.body.reason
    const accidentDate=req.body.accidentDate
    //get hod
    const departmentID=academic.department
     const department=await department.findById(departmentID)
     const hodID=department.HOD
     const hodAcademic=await AcademicStaffModel.findById(hodID)
    var req=new request({
        reqType:"Accidental Leave",
        accidentDate:accidentDate,
        sentBy:req.user.id,
        sentTo:hodAcademic.member,
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
    
    //update annual and accidental leave balance of user after acceptance!!
    //const userUpdated=await StaffMemberModel.findByIdAndUpdate(req.user.id,{accidentalDaysLeft:(accidentalDaysLeft-1),annual_days:(annual_days-1)})

    //send notification to hod
    const notification=(await StaffMemberModel.findById(hodAcademic.member)).notifications
    const notNew=notification
    notNew[notNew.length]="You received a new accidental leave request"
    const staffReplacement= await StaffMemberModel.findByIdAndUpdate(hodAcademic.member,{notifications:notNew})
})

router.post('/sickLeave',authenticateToken,async(req,res)=>{
    //input is sick day date and medical documents (req.body.sickDay , req.body.medicalDoc, OPTIONAL req.body.reason)
    const staff=await StaffMemberModel.findById(req.user.id)
    const type=staff.staff_type
    if(type=="HR"){
        return res.json("HR are not permitted to send slot slinking requests.Only academic members are allowed.")
    }
    const sickDay=req.user.sickDay
    //getting all days allowed to send request which is 3 days from today
    var diff3=moment().subtract(3, "days").format("YYYY-MM-DD");
   var diff2=moment().subtract(2, "days").format("YYYY-MM-DD");
   var diff1=moment().subtract(1, "days").format("YYYY-MM-DD");
   var diff0=moment.format("YYYY-MM-DD");

   if(sickDay==diff0 ||sickDay==diff1 || sickDay==diff2 ||sickDay==diff3 ){
       //no medical documents submitted
        if(!req.body.medicalDoc){
            return res.json("Medical documents to prove medical condition must be submitted with the request.")
        }

        //medical documents submitted
        else{
    //getting hod
    const academic=await AcademicStaffModel.findOne({member:req.user.id})
    const departmentID=academic.department
    const department=await department.findById(departmentID)
    const hodID=department.HOD
    const hodAcademic=await AcademicStaffModel.findById(hodID)
    
    //create request
    var reason=''
    if(req.body.reason)
    reason=req.body.reason
        var req=new request({
            reqType:"Sick Leave",
            sickDay:moment(sickDay),
            sentBy:req.user.id,
            sentTo:hodAcademic.member,
            medicalDoc:req.user.medicalDoc,
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

router.post('/maternityLeave',authenticateToken,async(req,res)=>{
    //(req.body.maternityDoc, OPTIONAL req.body.reason)
    const user=await StaffMemberModel.findById(req.user.id)
    const type=user.staff_type
    if(type=="HR"){
        return res.json("HR are not permitted to send slot slinking requests.Only academic members are allowed.")
    }
       // const user=await StaffMemberModel.findById(req.user.id)
        const gender=user.gender
        if(gender!="Female"){
            return res.json("Only female staff members are eligible to send this request.")
        }
        if(!req.body.maternityDoc){
            return res.json("Documents to prove the maternity condition must be submitted.")
        }
        const academic=await AcademicStaffModel.findOne({member:req.user.id})
        const departmentID=academic.department
        const department=await department.findById(departmentID)
        const hodID=department.HOD
        const hodAcademic=await AcademicStaffModel.findById(hodID)

         //create request
         var reason=''
         if(req.body.reason)
         reason=req.body.reason
         var req=new request({
            reqType:"Maternity Leave",
            sentBy:req.user.id,
            sentTo:hodAcademic.member,
            maternityDoc:maternityDoc,
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

router.post('/compensationLeave',authenticateToken,async(req,res)=>{
    //enter absent day he wants to compensate for (req.body.missedDay,OPTIONAL req.body.reason)

    //check if user is HR
    const staff=await StaffMemberModel.findById(req.user.id)
    const type=staff.staff_type
    if(type=="HR"){
        return res.json("HR are not permitted to send slot slinking requests.Only academic members are allowed.")
    }

    //check if he is asking to compensate for a day off or friday
    const day=moment(req.body.missedDay).format('dddd')
    const academic=await AcademicStaffModel.findById({member:req.user.id})
    const day_off=academic.day_off
    if(day=="Friday"){
        return res.json("Cannot compensate for Friday.It is already a day off")
    }
    if(day==day_off){
        return res.json("Cannot compensate for a day off.")
    }

    //check is missedDay entered is actually a day which the user attended
    const missedDay=req.body.missedDay
    //const reason=req.body.reason
    const userAttendance=staff.attendance
    if(!reason)
    return res.json("Must submit a reason for compensation leave request.")
    var check=false
    for(var i=0;i<userAttendance.length;i++){
            if(moment(userAttendance[i].date.format("YYYY-MM-DD")==moment(missedDay).format("YYYY-MM-DD"))){
                return res.json("You already attended this day.Cannot send a compensation request for it.")
            }
    }

     //create request
    //  const academic=await AcademicStaffModel.findOne({member:req.user.id})
     const departmentID=academic.department
     const department=await department.findById(departmentID)
     const hodID=department.HOD
     const hodAcademic=await AcademicStaffModel.findById(hodID)

     var reason=''
     if(req.body.reason)
     reason=req.body.reason

     var req=new request({
        reqType:"Compensation Leave",
        sentBy:req.user.id,
        sentTo:hodAcademic.member,
        missedDay:moment(req.body.missedDay),
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

router.get('/requestStatus',authenticateToken,async(req,res)=>{
    const sent=await request.find({sentBy:req.user.id})
    if(sent.length==0){
        return res.json("There are no submitted requests to display.")
    }
    for(var i=0;i<sent.length;i++){
        const hodID=sent[i].sentTo
        const hod=await StaffMemberModel.findById(hodID)
        const hodName=hod.name
        const type=sent[i].type
        if(reqType=="Replacement"){
            res.write("Request type: "+sent[i].reqType+"\n")
            res.write( "Sent to academic staff member: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Slot number: "+sent[i].slotNum+"\n")
            res.write( "Slot date: "+ sent[i].slotDate+"\n")
            res.write( "Slot location: "+sent[i].slotLoc+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Change Day off"){
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "New DayOff "+sent[i].newDayOff+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Accidental Leave"){
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Accident Date "+sent[i].accidentDate+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Sick Leave"){
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Sick Day: "+sent[i].sickDay+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Maternity Leave"){
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Compensation Leave"){
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Missed Day: "+sent[i].missedDay+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
    }
    res.end();
})

router.get('/acceptedRequests',authenticateToken,async(req,res)=>{
    const sent=await request.find({sentBy:req.user.id,state:"Accepted"})
    if(sent.length==0){
        return res.json("There are no accepted requests to display.")
    }
    for(var i=0;i<sent.length;i++){
        const hodID=sent[i].sentTo
        const hod=await StaffMemberModel.findById(hodID)
        const hodName=hod.name
        const type=sent[i].type
        if(reqType=="Replacement"){
            res.write("Request type: "+sent[i].reqType+"\n")
            res.write( "Sent to academic staff member: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Slot number: "+sent[i].slotNum+"\n")
            res.write( "Slot date: "+ sent[i].slotDate+"\n")
            res.write( "Slot location: "+sent[i].slotLoc+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Change Day off"){
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "New DayOff "+sent[i].newDayOff+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Accidental Leave"){
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Accident Date "+sent[i].accidentDate+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Sick Leave"){
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Sick Day: "+sent[i].sickDay+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Maternity Leave"){
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Compensation Leave"){
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Missed Day: "+sent[i].missedDay+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
    }
    res.end();
})

router.get('/pendingRequests',authenticateToken,async(req,res)=>{
    const sent=await request.find({sentBy:req.user.id,state:"Pending"})
    if(sent.length==0){
        return res.json("There are no accepted requests to display.")
    }
    for(var i=0;i<sent.length;i++){
        const hodID=sent[i].sentTo
        const hod=await StaffMemberModel.findById(hodID)
        const hodName=hod.name
        const type=sent[i].type
        if(reqType=="Replacement"){
            res.write("Request type: "+sent[i].reqType+"\n")
            res.write( "Sent to academic staff member: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Slot number: "+sent[i].slotNum+"\n")
            res.write( "Slot date: "+ sent[i].slotDate+"\n")
            res.write( "Slot location: "+sent[i].slotLoc+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Change Day off"){
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "New DayOff "+sent[i].newDayOff+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Accidental Leave"){
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Accident Date "+sent[i].accidentDate+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Sick Leave"){
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Sick Day: "+sent[i].sickDay+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Maternity Leave"){
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Compensation Leave"){
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Missed Day: "+sent[i].missedDay+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
    }
    res.end();
})

router.get('/rejectedRequests',authenticateToken,async(req,res)=>{
    const sent=await request.find({sentBy:req.user.id,state:"Rejected"})
    if(sent.length==0){
        return res.json("There are no accepted requests to display.")
    }
    for(var i=0;i<sent.length;i++){
        const hodID=sent[i].sentTo
        const hod=await StaffMemberModel.findById(hodID)
        const hodName=hod.name
        const type=sent[i].type
        if(reqType=="Replacement"){
            res.write("Request type: "+sent[i].reqType+"\n")
            res.write( "Sent to academic staff member: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Slot number: "+sent[i].slotNum+"\n")
            res.write( "Slot date: "+ sent[i].slotDate+"\n")
            res.write( "Slot location: "+sent[i].slotLoc+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Change Day off"){
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "New DayOff "+sent[i].newDayOff+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Accidental Leave"){
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Accident Date "+sent[i].accidentDate+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Sick Leave"){
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Sick Day: "+sent[i].sickDay+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Maternity Leave"){
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Compensation Leave"){
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Missed Day: "+sent[i].missedDay+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
    }
    res.end();
})


//---------------------------------------RECHECK ON BELOW CODEEEEEEEEEEEEEEE---------------------------------------------------
//---------------------------------------DO I NEED TO REMOVE NOTIFICATION AT HOD IF REQUEST IS CANCELLED--------------------
router.put('/cancelRequest',authenticateToken,async(req,res)=>{
    //input req type, sentTo(if replacement) , submissionDate
    //for replacement(req.body.reqType, slotNum,slotLoc,slotDate,replacementID)

    //all other requests except replacement 
    const reqType=req.body.reqType
    const submission_date=req.body.submission_date
    if(reqType=="Accidental Leave" || reqType=="Sick Leave"|| reqType== "Maternity Leave"||reqType=="Slot Linking"
       ||reqType=="Change Day off" || reqType=="Compensation Leave"){
    
    //get request
    const currReq=request.findOne({reqType:reqType,submission_date:submission_date,sentBy:req.user.id})
    const requestState=currReq.state
    //if it is not pending
    if(requestState!="Pending"){
        return res.json("This request has already been responded to. It cannot be cancelled.")
    }

    const reqRemoved=request.findOneAndDelete({reqType:reqType,submission_date:submission_date,sentBy:req.user.id})

    //get hod 
    // const academic=await AcademicStaffModel.findOne({member:req.user.id})
    // const department=await DepartmentModel.findById(academic.department)
    // const hodID=department.HOD
    // const hod=await AcademicStaffModel.findById(hodID)
    //  //send notification to hod
    //  const notification=(await StaffMemberModel.findById(hodAcademic.member)).notifications
    //  const notNew=notification
    //  notNew[notNew.length]="You received a new accidental leave request"
    //  const staffReplacement= await StaffMemberModel.findByIdAndUpdate(hodAcademic.member,{notifications:notNew})
    }
    else if(reqType=="Replacement"){
        const currRequest=request.findOne({reqType:reqType,submission_date:submission_date,slotDate:req.body.slotDate,
            slotNum:req.body.slotNum,slotLoc:req.body.slotLoc,sentBy:req.user.id,sentTo:req.body.replacementID})
        const requestState=currRequest.state
        const reqDate=currRequest.slotDate

        if( requestState=="Pending"){
            const reqRemoved=request.findOneAndDelete({reqType:reqType,submission_date:submission_date,slotDate:req.body.slotDate,
                slotNum:req.body.slotNum,slotLoc:req.body.slotLoc,sentBy:req.user.id,sentTo:req.body.replacementID})
            res.json("Request successfully removed")
        }

        //if day is yet to come and it is accepted then we 
        //must go remove this slot from other member's schedule
        if(moment().format('YYYY-MM-DD')<(moment(reqDate).format("YYYY-MM-DD"))){
            const reqRemoved=request.findOneAndDelete({reqType:reqType,submission_date:submission_date,slotDate:req.body.slotDate,
            slotNum:req.body.slotNum,slotLoc:req.body.slotLoc,sentBy:req.user.id,sentTo:req.body.replacementID})
            
            if(requestState=="Accepted"){
            const rep=await AcademicStaffModel.findById(req.body.sentTo)
            const schedule=rep.schedule
            var newSchedule=new Array()
            var k=0;

            //looping on other member's schedule to remove replacement slot 
            for(var i=0;i<schedule.length;i++){
                const slotDate=schedule[i].date
                const slotNum=schedule[i].number
                const slotLoc=schedule[i].location

                if(!(moment(slotDate).format("YYYY-MM-DD")==moment(reqDate)&&
                    slotNum==req.body.slotNum&&slotLoc==req.body.slotLoc)){
                        newSchedule[k++]=schedule[i]
                    }    
            }
            const updatedAcademic=await AcademicStaffModel.findByIdAndUpdate(req.body.sentTo,{schedule:newSchedule})
        }
        }

        //it is not accepted so we simply delete it
        else if(moment().format("YYYY-MM-DD")<moment(reqDate).format("YYYY-MM-DD")){
                return res.json("This request was for a replacement and its date has already passed")
        }

    }
})

router.put('/acceptReplacementRequest',authenticateToken,async(req,res)=>{
    //input will be sender type,submission date,sentBy (email or can change to normal id)
    const reqType=req.body.reqType
    const submission_date=req.body.submission_date
    const sentByEmail=req.body.sentByEmail
    const sentBy=(await StaffMemberModel.findOne({email:sentByEmail}))._id

    //check if this request actually exists
    const currRequest=await request.findOne({reqType:reqType,submission_date:submission_date,sentBy:sentBy,sentTo:req.user.id})
    if(!req)
    return res.json("This request does not exist")
    const reqID=currRequest._id
    const reqUpdated=await request.findByIdAndUpdate(reqID,{state:"Accepted"})

    //delete other requests sent to other academic members since one is already accepted
    const otherRepReq=await request.findOne({reqType:reqType,submission_date:submission_date,sentBy:sentBy})
    for(var i=0;i<otherRepReq.length;i++){
        if(otherRepReq[i].sentTo!=req.user.id){
           const delID= otherRepReq[i]._id
            const delReq=await request.findByIdAndDelete(delID)
        }
    }

    //update academic member's schedule since he accepted replacement request
    const academicRep=await AcademicStaffModel.findOne({memeber:req.user.id})
    const schedule=academicRep.schedule
    
    repSlot={
    date: slotDate,
    day: moment(slotDate).format('ddddd'),
    number: slotNum, 
    location: currRequest.slotLoc,
    academic_member_id:academicRep._id,
    course: ,
    isReplaced: true
}






})
module.exports=router;
