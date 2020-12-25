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
const request=require('../Models/RequestModel.js')
const slotSchema=require('../Models/SlotSchema')
//const authenticateToken=require('../Routes/StaffMemberRoutes')
const CounterModel=require('../Models/CounterModel')
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
        if(!slotNum){
            return res.json("Must submit slot number with the request.")
        }
        if(!slotDate){
            return res.json("Must submit slot date with the request.")
        }
        if(!slotLoc){
            return res.json("Must submit slot location with the request.")
        }
        var checkFin=false;
        const id=req.user.id
        if(moment(slotDate).format('YYYY-MM-DD')<(new moment().format("YYYY-MM-DD"))){
            return res.json("Cannot replace a slot that has already passed.")
        }
        // if(user.staff_type=="HR"){
        //     return (res.json({error:"HR cannot make replacement requests"}))
        // }
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
            console.log("num= "+number)
            console.log("date= "+date)
            console.log("loc"+loc)
            console.log(moment(date).format("YYYY-MM-DD")==moment(slotDate).format("YYYY-MM-DD"))
            if(loc==slotLoc && slotNum==number &&moment(date).format("YYYY-MM-DD")==moment(slotDate).format("YYYY-MM-DD")){
                check=true
                course=(await Course.findById(slots[i].course))
                 courseID=course.id
                 console.log("COURSE NAME===="+course.name)
                 console.log("check="+check)
            }

        }
        if(check==false)
        return res.send("This slot is not present in your schedule.")

        //will loop on all slots of each member that teaches this course 
        //to make sure that they are free during this replacement slot
        const courseAcademic=course.academic_staff
        console.log(course.id)

        if(courseAcademic.length==1){
            return res.json("No other academic staff member who teach this course are available to send a replacement request to.")
        }

        //looping on staff giving the course of replacement slot
        for(var j=0;j<courseAcademic.length;j++){
            // console.log("in c1 "+courseAcademic[j])
            // console.log("courseid= "+course._id)
            // console.log("ca= "+courseAcademic[j])
            const replacement=await AcademicStaffModel.findById(courseAcademic[j])
          // console.log('bslsbizo= '+replacement)
            const staff= await StaffMemberModel.findById(replacement.member)
           
            const staffID=staff._id
            console.log("l= "+staff.name)
            
            const replacementSchedule=replacement.schedule
            //console.log("rep "+replacement.schedule)
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
            if(check2==false && staffID!=id){

                const doc = await CounterModel.findById('Replacement-');
                if(!doc) {
                    console.log("NOTTTTTTTTTTTTTTTTTT DOCCCCCCCCCC")
                const counterAcademic = new CounterModel({
                _id: 'Replacement-'
                });
                try{
                await counterAcademic.save();
                console.log("successsssssssssssssssssss")
                }
                catch(err){
                        console.log("errooooooooooooooooooooooooooooooooor")
                }
                }
                //create new request
                console.log("checkk2 "+check2)
                console.log("req="+id)
                var newRequest=new request({
                    reqType:"Replacement",
                    slotDate:slotDate,
                    slotNum:slotNum,
                    slotLoc:slotLoc,
                    sentBy:id,
                    sentTo:replacement.member,
                    state:"Pending",
                    submission_date:new moment().format("YYYY-MM-DD")
                })
                //update notifications of person receiving request
                const notification=(await StaffMemberModel.findById(replacement.member)).notifications
                const notNew=notification
                notNew[notNew.length]="You received a new replacement request"
                const staffReplacement= await StaffMemberModel.findByIdAndUpdate(replacement.member,{notifications:notNew})
                console.log("new req=========="+newRequest)

                //post request in requests table with sent to added
                try{
                    console.log("saved")
                    checkFin=true
                    const requ= await newRequest.save()
                }
                catch(err){
                    console.log("hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
                   return res.json("Cannot save new request")
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
    // if(type=="HR"){
    //     return res.json("HR do not have replacement requests")
    // }
    if(type=="HR"){
        return res.json("HR cannot submit this request.Only academic staff are permitted.")
    }
        const sent=await request.find({reqType:"Replacement",sentBy:req.user.id})
        for(var i=0;i<sent.length;i++){
            //get name of request receiver to print
                reqType=sent[i].reqType
                const sentTo=(await StaffMemberModel.findById(sent[i].sentTo))
                const hodName=sentTo.name
                 
            if(reqType=="Replacement"){
                res.write("Request ID: "+sent[i].requestID)
                res.write("Request type: "+sent[i].reqType+"\n")
                res.write( "Sent to academic staff member: "+hodName+"\n")
                res.write( "Request state: "+sent[i].state+"\n")
                res.write( "Slot number: "+sent[i].slotNum+"\n")
                res.write( "Slot date: "+ sent[i].slotDate+"\n")
                res.write( "Slot location: "+sent[i].slotLoc+"\n")
                res.write( "Submission date "+sent[i].submission_date+"\n")
                res.write("\n")
            }
            
           
                
        }
        if(sent.length==0)
        res.write("There are no sent requests available to display.")

        res.end()
        return 
})

router.get('/receivedReplacementRequests',authenticateToken,async(req,res)=>{
    //get requests where sentTo is equal this user
    const user=await StaffMemberModel.findById(req.user.id)
    const type=user.staff_type
    if(type=="HR"){
        return res.json("HR do not have replacement requests.")
    }
    const sent=await request.find({reqType:"Replacement",sentTo:req.user.id})
    for(var i=0;i<sent.length;i++){
            reqType=sent[i].reqType
            const sentBy=(await StaffMemberModel.findById(sent[i].sentBy))
            const name=sentBy.name
            
            if(reqType=="Replacement"){
                res.write("Request ID: "+sent[i].requestID)
                res.write("Request type: "+sent[i].reqType+"\n")
                res.write( "Sent to academic staff member: "+hodName+"\n")
                res.write( "Request state: "+sent[i].state+"\n")
                res.write( "Slot number: "+sent[i].slotNum+"\n")
                res.write( "Slot date: "+ sent[i].slotDate+"\n")
                res.write( "Slot location: "+sent[i].slotLoc+"\n")
                res.write( "Submission date "+sent[i].submission_date+"\n")
                res.write("\n")
            }
            
           
    }
    if(sent.length==0)
    res.write("There are no received requests.")
    res.end()
    return 
})


router.post('/slotLinkingRequest',authenticateToken,async(req,res)=>{
    //input course name slot number and slot day (req.body.courseID,req.body.slotDay , req.body.slotNum,OPTIONAL req.body.reason)
    const staff=await StaffMemberModel.findById(req.user.id)
    const type=staff.staff_type
    if(type=="HR"){
        return res.json("HR are not permitted to send slot linking requests.Only academic members are allowed.")
    }
    if(!req.body.slotDay){
        return res.json("Must submit slot day with the request.")
    }
    if(!(req.body.slotDay=="Saturday" || req.body.slotDay=="Sunday"||req.body.slotDay=="Monday"
    ||req.body.slotDay=="Tuesday"||req.body.slotDay=="Wednesday"||req.body.slotDay=="Thursday" || req.body.slotDay=="Thursday")){
        return res.json("Please enter a day with correct format (eg.Saturday).")
    }

    if(!req.body.slotNum){
        return res.json("Must submit slot number with the request.")
    }
    if(!req.body.courseID){
        return res.json("Must submit course ID with the request.")
    }

    const courseName=await Course.findOne({id:req.body.courseID})
    if(!courseName)
    return res.json("No such course exists. Please enter correct course ID.")
    const courseID=courseName.id
    const courseCoordinatorID=courseName.course_coordinator
     const courseCoordinator= await AcademicStaffModel.findById(courseCoordinatorID)
  //  const coordinatorID=courseCoordinator.member
     if(!courseCoordinator){
         return res.json("Currently there is not an assigned course coorinator to this course send this request to.")
     }
    const coordinatorID=courseCoordinator.member
    console.log("coorindatorID= "+coordinatorID)
    //will compare slot timings with user schedule to make sure that he is free during this slot
    const slotNum=req.body.slotNum
    const slotDay=req.body.slotDay
    const academic=await AcademicStaffModel.findOne({member:req.user.id})
    const schedule=academic.schedule
    var check=false;



    //check if user already has a slot during the time he is requesting a slot linking for
    for(var i=0;i<schedule.length;i++){
            if(schedule[i].day==slotDay && schedule[i].number==slotNum){
                return res.json("User already has teaching activities during this slot. Cannot send this request.")
            }
    }

    //check if user teaches this course
    //const academic=await AcademicStaffModel.find({member:req.user.id})
    const coursesIDs=academic.courses
    var teaches=false
    console.log(coursesIDs)
    for(var i=0;i< coursesIDs.length;i++){
       // console.log(coursesIDs[i])
        var courses=await Course.findById(coursesIDs[i])
        // console.log(courses)
        // console.log(courses.id)
        if(courses.id==courseID)
            teaches=true
    }
    if(teaches==false)
    return res.json("Not permitted to send this request because user does not teach this course.")

    //creating new slot linking request
    var reason=''
    if(req.body.reason)
    reason=req.body.reason
    var newRequest=new request({
        reqType:"Slot Linking",
        slotDay:slotDay,
        slotNum:slotNum,
        courseID:courseID,
        sentBy:req.user.id,
        sentTo:coordinatorID,
        state:"Pending",
        reason:reason,
        submission_date:new moment().format("YYYY-MM-DD")
    })
    try{
    res.json("Request successfully submitted.")    
    await newRequest.save()
    }
    catch(err){
        res.json(err)
    }

    //sending notification to course coordinator
    const notification=(await StaffMemberModel.findById(coordinatorID)).notifications
    console.log("not= "+notification)
                const notNew=notification
                notNew[notNew.length]="You received a new slot linking request."
                const staffReplacement= await StaffMemberModel.findByIdAndUpdate(coordinatorID,{notifications:notNew})

})

router.post('/changeDayOff',authenticateToken,async(req,res)=>{
    //input will be new day off (req.body.newDayOff , (OPTIONAL) req.user.reason)
    const staff=await StaffMemberModel.findById(req.user.id)
    const type=staff.staff_type
    if(type=="HR"){
        return res.json("HR are not permitted to send this request.Only academic members are allowed.")
    }
    if(!req.body.newDayOff ){
        return res.json("Must submit new day-off with request.")
    }
// console.log("dayyyyyyyyyyyy= "+req.body.day_off)
    if(!(req.body.newDayOff =="Saturday" || req.body.newDayOff =="Sunday"||req.body.newDayOff =="Monday"
    ||req.body.newDayOff =="Tuesday"||req.body.newDayOff =="Wednesday"||req.body.newDayOff =="Thursday" || req.body.newDayOff =="Thursday")){
        return res.json("Please enter a day with correct format (eg.Saturday).")
    }


    const academic=await AcademicStaffModel.findOne({member:req.user.id})
    const schedule=academic.schedule
    const day_off=academic.day_off
    if(day_off==req.body.newDayOff){
        return res.json("This day is already your day-off. Please enter a new day.")
    }

    if(req.body.newDayOff=="Friday"){
        return res.json("Friday is already a day off.Please submit a new day.")
    }
    for(var i=0;i<schedule.length;i++){
        const slotDay=schedule[i].day
        if(slotDay==req.body.newDayOff){
            return res.json("Cannot request for a day off on a day with teaching activities.")
        }
    }
     //getting department of this user to get head of department to send request to
     const departmentID=academic.department
     const departmentName=await department.findById(departmentID)
     const hodID=departmentName.HOD
     if(!hodID){
         return res.json("There is currently no head of this department to send this request to.")
     }
     const hodAcademic=await AcademicStaffModel.findById(hodID)
    

    //make a request
    var reason=""
    if(req.body.reason)
    reason=req.body.reason

    var newRequest=new request({
        reqType:"Change Day off",
        newDayOff:req.body.newDayOff,
        sentBy:req.user.id,
        sentTo:hodAcademic.member,
        state:"Pending",
        reason:reason,
        submission_date:new moment().format("YYYY-MM-DD")
    })
    try{
     res.json("Request successfully submitted.")
    await newRequest.save()
    }
    catch(err){
        res.json(err)
    }

    //sending notification to hod
    const notification=(await StaffMemberModel.findById(hodAcademic.member)).notifications
    const notNew=notification
    notNew[notNew.length]="You received a new change day-off request."
    const staffReplacement= await StaffMemberModel.findByIdAndUpdate(hodAcademic.member,{notifications:notNew})


})

router.post('/accidentalLeave',authenticateToken,async(req,res)=>{
    //input is (req.body.accidentDate , OPTIONAL req.body.reason)
    const staff=await StaffMemberModel.findById(req.user.id)
    const type=staff.staff_type
    if(type=="HR"){
        return res.json("HR are not permitted to send leave requests.Only academic members are allowed.")
    }
    if(!req.body.accidentDate){
        return res.json("Must submit accident date with the request.")
    }
    //get annual and accidental leave balance
    const academic=await AcademicStaffModel.findOne({member:req.user.id})
    //const staff=await StaffMemberModel.findById(req.user.id)
    const accidentalDaysLeft=staff.accidentalDaysLeft
    const annual_days=staff.annual_days

      //get hod
      const departmentID=academic.department
      const departmentRec=await department.findById(departmentID)
      const hodID=departmentRec.HOD
      if(!hodID){
          return res.json("There is currently no head of this department to send this request to.")
      }
      const hodAcademic=await AcademicStaffModel.findById(hodID)

    //check of number of accidental days left or annual days is equal to 0
    if(accidentalDaysLeft==0){
        return res.json("Cannot submit request.Maximum number of accidental day leaves have been reached.")
    }
    if(annual_days==0){
        return res.json("Cannot submit request. Annual leave balance is currently empty.")
    }

    //make request
    var reason=''
    if(req.body.reason)
    reason=req.body.reason
    // if(!req.body.accidentDate){
    //     return res.json("Must submit accident date with request")
    // }
    const accidentDate=req.body.accidentDate
  

    //create request
    var newRequest=new request({
        reqType:"Accidental Leave",
        accidentDate:accidentDate,
        sentBy:req.user.id,
        sentTo:hodAcademic.member,
        state:"Pending",
        reason:reason,
        submission_date:new moment().format("YYYY-MM-DD")
    })
    try{
    await newRequest.save()
    res.json("Request successfully submitted.")
    }
    catch(err){
        res.json(err)
    }
    
    //update annual and accidental leave balance of user after acceptance!!
    //const userUpdated=await StaffMemberModel.findByIdAndUpdate(req.user.id,{accidentalDaysLeft:(accidentalDaysLeft-1),annual_days:(annual_days-1)})

    //send notification to hod
    const notification=(await StaffMemberModel.findById(hodAcademic.member)).notifications
    const notNew=notification
    notNew[notNew.length]="You received a new accidental leave request."
    const staffReplacement= await StaffMemberModel.findByIdAndUpdate(hodAcademic.member,{notifications:notNew})
})

router.post('/sickLeave',authenticateToken,async(req,res)=>{
    //input is sick day date and medical documents (req.body.sickDay , req.body.medicalDoc, OPTIONAL req.body.reason)
    const staff=await StaffMemberModel.findById(req.user.id)
    const type=staff.staff_type
    if(type=="HR"){
        return res.json("HR are not permitted to send leave requests.Only academic members are allowed.")
    }
    if(!req.body.sickDay){
        return res.json("Must submit sick day date with the request.")
    }
    const sickDay=req.body.sickDay
     //getting hod
     const academic=await AcademicStaffModel.findOne({member:req.user.id})
     const departmentID=academic.department
     const departmentRec=await department.findById(departmentID)
     const hodID=departmentRec.HOD
     if(!hodID){
         return res.json("There is currently no head of this department to send this request to.")
     }
    //getting all days allowed to send request which is 3 days from today
    var diff3=moment().subtract(3, "days").format("YYYY-MM-DD");
   var diff2=moment().subtract(2, "days").format("YYYY-MM-DD");
   var diff1=moment().subtract(1, "days").format("YYYY-MM-DD");
   var diff0=moment().format("YYYY-MM-DD");
    // console.log("diff0= "+diff0)
    // console.log("diff1= "+diff1)
    // console.log("diff2= "+diff2)
    // console.log("diff3= "+diff3)
   if(sickDay==diff0 ||sickDay==diff1 || sickDay==diff2 ||sickDay==diff3 ){
       //no medical documents submitted
        if(!req.body.medicalDoc){
            return res.json("Medical documents to prove medical condition must be submitted with the request.")
        }

        //medical documents submitted
        else{
   
    const hodAcademic=await AcademicStaffModel.findById(hodID)
    
    //create request
    var reason=''
    if(req.body.reason)
    reason=req.body.reason
        var newRequest=new request({
            reqType:"Sick Leave",
            sickDay:moment(sickDay),
            sentBy:req.user.id,
            sentTo:hodAcademic.member,
            medicalDoc:req.body.medicalDoc,
            state:"Pending",
            reason:reason,
            submission_date:new moment().format("YYYY-MM-DD")
        })
        try{
        await newRequest.save()
        res.json("Request successfully submitted.")
        }
        catch(err){
            res.json(err)
        }


         //send notification to hod
    const notification=(await StaffMemberModel.findById(hodAcademic.member)).notifications
    const notNew=notification
    notNew[notNew.length]="You received a new sick leave request."
    const staffReplacement= await StaffMemberModel.findByIdAndUpdate(hodAcademic.member,{notifications:notNew})
    }

   }


   //request sent after 3 days deadline has passed
   else if(moment(req.body.sickDay).format("YYYY-MM-DD")<moment().format("YYYY-MM-DD")){
       return res.json("Deadline for sending sick leave request has been exceeded.\n Cannot send request")
   }
   else if(moment(req.body.sickDay).format("YYYY-MM-DD")>moment().format("YYYY-MM-DD")){
    return res.json("Sick day leave request must be submitted by a maximum of 3 days after sick day date.")
}


})

router.post('/maternityLeave',authenticateToken,async(req,res)=>{
    //(req.body.maternityDoc, OPTIONAL req.body.reason)
    const user=await StaffMemberModel.findById(req.user.id)
    const type=user.staff_type
    if(type=="HR"){
        return res.json("HR are not permitted to send leave requests.Only academic members are allowed.")
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
        const departmentRec=await department.findById(departmentID)
        const hodID=departmentRec.HOD
        if(!hodID){
            return res.json("There is currently no head of this department to send this request to.")
        }
        const hodAcademic=await AcademicStaffModel.findById(hodID)
        const maternityDoc=req.body.maternityDoc
         //create request
         var reason=''
         if(req.body.reason)
         reason=req.body.reason
         var newRequest=new request({
            reqType:"Maternity Leave",
            sentBy:req.user.id,
            sentTo:hodAcademic.member,
            maternityDoc:maternityDoc,
            state:"Pending",
            reason:reason,
            submission_date:new moment().format("YYYY-MM-DD")
        })
        try{
        await newRequest.save()
        res.json("Request successfully submitted.")
        }
        catch(err){
            res.json(err)
        }

        //send notification to hod
    const notification=(await StaffMemberModel.findById(hodAcademic.member)).notifications
    const notNew=notification
    notNew[notNew.length]="You received a new maternity leave request."
    const staffReplacement= await StaffMemberModel.findByIdAndUpdate(hodAcademic.member,{notifications:notNew})

})

router.post('/compensationLeave',authenticateToken,async(req,res)=>{
    //enter absent day he wants to compensate for (req.body.missedDay, req.body.reason)

    //check if user is HR
    const staff=await StaffMemberModel.findById(req.user.id)
    const type=staff.staff_type
    if(type=="HR"){
        return res.json("HR are not permitted to send leave requests.Only academic members are allowed.")
    }
    if(!req.body.missedDay){
        return res.json("Must submit the missed day date with the request.")
    }

    //check if he is asking to compensate for a day off or friday
    const day=moment(req.body.missedDay).format('dddd')
    const academic=await AcademicStaffModel.findOne({member:req.user.id})
    console.log("aca=" +academic)
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
    
    var check=false
    for(var i=0;i<userAttendance.length;i++){
            if(moment(userAttendance[i].date).format("YYYY-MM-DD")==moment(missedDay).format("YYYY-MM-DD")){
                return res.json("You already attended this day.Cannot send a compensation request for it.")
            }
    }
    const reason=req.body.reason
    if(!reason)
    return res.json("Must submit a reason for compensation leave request.")

     //create request
    //  const academic=await AcademicStaffModel.findOne({member:req.user.id})
     const departmentID=academic.department
     const departmentRec=await department.findById(departmentID)
     const hodID=departmentRec.HOD
     const hodAcademic=await AcademicStaffModel.findById(hodID)

    //  var reason=''
    //  if(req.body.reason)
    //  reason=req.body.reason

     var newRequest=new request({
        reqType:"Compensation Leave",
        sentBy:req.user.id,
        sentTo:hodAcademic.member,
        missedDay:moment(req.body.missedDay),
        state:"Pending",
        reason:reason,
        submission_date:new moment().format("YYYY-MM-DD")
    })
    try{
    await newRequest.save()
    res.json("Request successfully submitted.")
    }
    catch(err){
        res.json(err)
    }

      //send notification to hod
      const notification=(await StaffMemberModel.findById(hodAcademic.member)).notifications
      const notNew=notification
      notNew[notNew.length]="You received a new compensation leave request."
      const staffReplacement= await StaffMemberModel.findByIdAndUpdate(hodAcademic.member,{notifications:notNew})


})

router.get('/requestStatus',authenticateToken,async(req,res)=>{
    //check if user is HR
    const staff=await StaffMemberModel.findById(req.user.id)
    const type=staff.staff_type
    if(type=="HR"){
        return res.json("HR do not have any leave requests.")
    }

    const sent=await request.find({sentBy:req.user.id})
    if(sent.length==0){
        return res.json("There are no submitted requests to display.")
    }
    for(var i=0;i<sent.length;i++){
        const hodID=sent[i].sentTo
        const hod=await StaffMemberModel.findById(hodID)
        const hodName=hod.name
        const type=sent[i].type
        var reqType=sent[i].reqType
        var repl=""
        if (sent[i].replacementStaff)
        repl=(await StaffMemberModel.findById(sent[i].replacementStaff)).id
        if(reqType=="Annual"){
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n")
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Slot number: "+sent[i].slotNum+"\n")
            res.write( "Slot date: "+ sent[i].slotDate+"\n")
            res.write( "Slot location: "+sent[i].slotLoc+"\n")
            res.write( "Replacement academic staff member: "+repl+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Replacement"){
            res.write("Request ID: "+sent[i].requestID+"\n")
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
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "New DayOff: "+sent[i].newDayOff+"\n")
            res.write( "Reason: "+sent[i].reason+"\n")
            res.write( "Submission date: "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Accidental Leave"){
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Accident Date "+sent[i].accidentDate+"\n")
            res.write( "Reason: "+sent[i].reason+"\n")
            res.write( "Submission date: "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Sick Leave"){
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Sick Day: "+sent[i].sickDay+"\n")
            res.write( "Reason: "+sent[i].reason+"\n")
            res.write( "Submission date: "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Maternity Leave"){
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Reason: "+sent[i].reason+"\n")
            res.write( "Submission date: "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Compensation Leave"){
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Missed Day: "+sent[i].missedDay+"\n")
            res.write( "Reason: "+sent[i].reason+"\n")
            res.write( "Submission date: "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Slot Linking"){
            const coordinatorID=sent[i].sentTo
        const coordinator=await StaffMemberModel.findById(coordinatorID)
        const coordinatorName=coordinator.name
        res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to course coordinator: "+coordinatorName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Slot Day: "+sent[i].slotDay+"\n")
            res.write( "Slot Number: "+sent[i].slotNum+"\n")
            res.write( "Course ID: "+sent[i].courseID+"\n")
            res.write( "Reason: "+sent[i].reason+"\n")
            res.write( "Submission date: "+sent[i].submission_date+"\n")
            res.write("\n")
        }
    }
    res.end();
})

//sent requests that got accepted
router.get('/acceptedRequests',authenticateToken,async(req,res)=>{
    const staff=await StaffMemberModel.findById(req.user.id)
    const type=staff.staff_type
    if(type=="HR"){
        return res.json("HR do not have any leave requests.")
    }
    const sent=await request.find({sentBy:req.user.id,state:"Accepted"})
    console.log("sent= "+sent)
    if(sent.length==0){
        return res.json("There are no accepted requests to display.")
    }
    for(var i=0;i<sent.length;i++){
        const hodID=sent[i].sentTo
        const hod=await StaffMemberModel.findById(hodID)
        const hodName=hod.name
        const type=sent[i].type
        var reqType=sent[i].reqType

        //replacement
        // const academicMemberID=sent[i].sentTo
        // const academicMember=await StaffMemberModel.findById(academicMemberID)
        // const coordinatorName=coordinator.name
        var repl=""
        if (sent[i].replacementStaff)
        repl=(await StaffMemberModel.findById(sent[i].replacementStaff)).id
        if(reqType=="Annual"){
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n")
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Slot number: "+sent[i].slotNum+"\n")
            res.write( "Slot date: "+ sent[i].slotDate+"\n")
            res.write( "Slot location: "+sent[i].slotLoc+"\n")
            res.write( "Replacement academic staff member: "+repl+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Replacement"){
            res.write("Request ID: "+sent[i].requestID+"\n")
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
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "New DayOff "+sent[i].newDayOff+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Accidental Leave"){
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Accident Date "+sent[i].accidentDate+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Sick Leave"){
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Sick Day: "+sent[i].sickDay+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Maternity Leave"){
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Compensation Leave"){
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Missed Day: "+sent[i].missedDay+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Slot Linking"){
            const coordinatorID=sent[i].sentTo
        const coordinator=await StaffMemberModel.findById(coordinatorID)
        const coordinatorName=coordinator.name
        res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to course coordinator: "+coordinatorName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Slot Day: "+sent[i].slotDay+"\n")
            res.write( "Slot Number: "+sent[i].slotNum+"\n")
            res.write( "Course ID: "+sent[i].courseID+"\n")
            res.write( "Reason: "+sent[i].reason+"\n")
            res.write( "Submission date: "+sent[i].submission_date+"\n")
            res.write("\n")
        }
    }
    res.end();
})

//received requests that got accepted
router.get('/acceptedReceivedRequests',authenticateToken,async(req,res)=>{
    const staff=await StaffMemberModel.findById(req.user.id)
    const type=staff.staff_type
    if(type=="HR"){
        return res.json("HR do not have any leave requests.")
    }
    const sent=await request.find({sentTo:req.user.id,state:"Accepted"})
    console.log("sent= "+sent)
    if(sent.length==0){
        return res.json("There are no received accepted requests to display.")
    }
    for(var i=0;i<sent.length;i++){
        const hodID=sent[i].sentTo
        const hod=await StaffMemberModel.findById(hodID)
        const hodName=hod.name
        const type=sent[i].type
        var reqType=sent[i].reqType
        var repl=""
        if (sent[i].replacementStaff)
        repl=(await StaffMemberModel.findById(sent[i].replacementStaff)).id
        if(reqType=="Annual"){
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n")
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Slot number: "+sent[i].slotNum+"\n")
            res.write( "Slot date: "+ sent[i].slotDate+"\n")
            res.write( "Slot location: "+sent[i].slotLoc+"\n")
            res.write( "Replacement academic staff member: "+repl+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }

        if(reqType=="Replacement"){
            res.write("Request ID: "+sent[i].requestID+"\n")
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
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "New DayOff "+sent[i].newDayOff+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Accidental Leave"){
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Accident Date "+sent[i].accidentDate+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Sick Leave"){
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Sick Day: "+sent[i].sickDay+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Maternity Leave"){
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Compensation Leave"){
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Missed Day: "+sent[i].missedDay+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Slot Linking"){
            const coordinatorID=sent[i].sentTo
        const coordinator=await StaffMemberModel.findById(coordinatorID)
        const coordinatorName=coordinator.name
        res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to course coordinator: "+coordinatorName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Slot Day: "+sent[i].slotDay+"\n")
            res.write( "Slot Number: "+sent[i].slotNum+"\n")
            res.write( "Course ID: "+sent[i].courseID+"\n")
            res.write( "Reason: "+sent[i].reason+"\n")
            res.write( "Submission date: "+sent[i].submission_date+"\n")
            res.write("\n")
        }
    }
    res.end();
})


//sent requests that are pending
router.get('/pendingRequests',authenticateToken,async(req,res)=>{
    const staff=await StaffMemberModel.findById(req.user.id)
    const type=staff.staff_type
    if(type=="HR"){
        return res.json("HR do not have any leave requests.")
    }
    const sent=await request.find({sentBy:req.user.id,state:"Pending"})
    if(sent.length==0){
        return res.json("There are no pending requests to display.")
    }
    for(var i=0;i<sent.length;i++){
        const hodID=sent[i].sentTo
        const hod=await StaffMemberModel.findById(hodID)
        const hodName=hod.name
        const type=sent[i].type
        var reqType=sent[i].reqType
        var repl=""
        if (sent[i].replacementStaff)
        repl=(await StaffMemberModel.findById(sent[i].replacementStaff)).id
        if(reqType=="Annual"){
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n")
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Slot number: "+sent[i].slotNum+"\n")
            res.write( "Slot date: "+ sent[i].slotDate+"\n")
            res.write( "Slot location: "+sent[i].slotLoc+"\n")
            res.write( "Replacement academic staff member: "+repl+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Replacement"){
            res.write("Request ID: "+sent[i].requestID+"\n")
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
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "New DayOff "+sent[i].newDayOff+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Accidental Leave"){
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Accident Date "+sent[i].accidentDate+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Sick Leave"){
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Sick Day: "+sent[i].sickDay+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Maternity Leave"){
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Compensation Leave"){
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Missed Day: "+sent[i].missedDay+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Slot Linking"){
            const coordinatorID=sent[i].sentTo
        const coordinator=await StaffMemberModel.findById(coordinatorID)
        const coordinatorName=coordinator.name
        res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to course coordinator: "+coordinatorName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Slot Day: "+sent[i].slotDay+"\n")
            res.write( "Slot Number: "+sent[i].slotNum+"\n")
            res.write( "Course ID: "+sent[i].courseID+"\n")
            res.write( "Reason: "+sent[i].reason+"\n")
            res.write( "Submission date: "+sent[i].submission_date+"\n")
            res.write("\n")
        }
    }
    res.end();
})
//received requests that are pending
router.get('/pendingReceivedRequests',authenticateToken,async(req,res)=>{
    const staff=await StaffMemberModel.findById(req.user.id)
    const type=staff.staff_type
    if(type=="HR"){
        return res.json("HR do not have any leave requests.")
    }
    const sent=await request.find({sentTo:req.user.id,state:"Pending"})
    if(sent.length==0){
        return res.json("There are no pending requests to display.")
    }
    for(var i=0;i<sent.length;i++){
        const hodID=sent[i].sentTo
        const hod=await StaffMemberModel.findById(hodID)
        const hodName=hod.name
        const type=sent[i].type
        var reqType=sent[i].reqType
        var repl=""
        if (sent[i].replacementStaff)
        repl=(await StaffMemberModel.findById(sent[i].replacementStaff)).id
        if(reqType=="Annual"){
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n")
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Slot number: "+sent[i].slotNum+"\n")
            res.write( "Slot date: "+ sent[i].slotDate+"\n")
            res.write( "Slot location: "+sent[i].slotLoc+"\n")
            res.write( "Replacement academic staff member: "+repl+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Replacement"){
            res.write("Request ID: "+sent[i].requestID+"\n")
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
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "New DayOff "+sent[i].newDayOff+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Accidental Leave"){
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Accident Date "+sent[i].accidentDate+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Sick Leave"){
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Sick Day: "+sent[i].sickDay+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Maternity Leave"){
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Compensation Leave"){
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Missed Day: "+sent[i].missedDay+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Slot Linking"){
            const coordinatorID=sent[i].sentTo
        const coordinator=await StaffMemberModel.findById(coordinatorID)
        const coordinatorName=coordinator.name
        res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to course coordinator: "+coordinatorName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Slot Day: "+sent[i].slotDay+"\n")
            res.write( "Slot Number: "+sent[i].slotNum+"\n")
            res.write( "Course ID: "+sent[i].courseID+"\n")
            res.write( "Reason: "+sent[i].reason+"\n")
            res.write( "Submission date: "+sent[i].submission_date+"\n")
            res.write("\n")
        }
    }
    res.end();
})


//sent requests that are rejected
router.get('/rejectedRequests',authenticateToken,async(req,res)=>{
    const staff=await StaffMemberModel.findById(req.user.id)
    const type=staff.staff_type
    if(type=="HR"){
        return res.json("HR do not have any leave requests.")
    }
    const sent=await request.find({sentBy:req.user.id,state:"Rejected"})
    if(sent.length==0){
        return res.json("There are no rejected requests to display.")
    }
    for(var i=0;i<sent.length;i++){
        const hodID=sent[i].sentTo
        const hod=await StaffMemberModel.findById(hodID)
        const hodName=hod.name
        const type=sent[i].type
        var reqType=sent[i].reqType
        var repl=""
        if (sent[i].replacementStaff)
        repl=(await StaffMemberModel.findById(sent[i].replacementStaff)).id
        if(reqType=="Annual"){
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n")
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Slot number: "+sent[i].slotNum+"\n")
            res.write( "Slot date: "+ sent[i].slotDate+"\n")
            res.write( "Slot location: "+sent[i].slotLoc+"\n")
            res.write( "Replacement academic staff member: "+repl+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Replacement"){
            res.write("Request ID: "+sent[i].requestID+"\n")
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
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "New DayOff "+sent[i].newDayOff+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Accidental Leave"){
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Accident Date "+sent[i].accidentDate+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Sick Leave"){
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Sick Day: "+sent[i].sickDay+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Maternity Leave"){
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Compensation Leave"){
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Missed Day: "+sent[i].missedDay+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Slot Linking"){
            const coordinatorID=sent[i].sentTo
        const coordinator=await StaffMemberModel.findById(coordinatorID)
        const coordinatorName=coordinator.name
        res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to course coordinator: "+coordinatorName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Slot Day: "+sent[i].slotDay+"\n")
            res.write( "Slot Number: "+sent[i].slotNum+"\n")
            res.write( "Course ID: "+sent[i].courseID+"\n")
            res.write( "Reason: "+sent[i].reason+"\n")
            res.write( "Submission date: "+sent[i].submission_date+"\n")
            res.write("\n")
        }
    }
    res.end();
})

//received requests that are rejected
router.get('/rejectedReceivedRequests',authenticateToken,async(req,res)=>{
    const staff=await StaffMemberModel.findById(req.user.id)
    const type=staff.staff_type
    if(type=="HR"){
        return res.json("HR do not have any leave requests.")
    }
    const sent=await request.find({sentTo:req.user.id,state:"Rejected"})
    if(sent.length==0){
        return res.json("There are no rejected requests to display.")
    }
    for(var i=0;i<sent.length;i++){
        const hodID=sent[i].sentTo
        const hod=await StaffMemberModel.findById(hodID)
        const hodName=hod.name
        const type=sent[i].type
        var reqType=sent[i].reqType
        var repl=""
        if (sent[i].replacementStaff)
        repl=(await StaffMemberModel.findById(sent[i].replacementStaff)).id
        if(reqType=="Annual"){
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n")
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Slot number: "+sent[i].slotNum+"\n")
            res.write( "Slot date: "+ sent[i].slotDate+"\n")
            res.write( "Slot location: "+sent[i].slotLoc+"\n")
            res.write( "Replacement academic staff member: "+repl+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Replacement"){
            res.write("Request ID: "+sent[i].requestID+"\n")
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
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "New DayOff "+sent[i].newDayOff+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Accidental Leave"){
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Accident Date "+sent[i].accidentDate+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Sick Leave"){
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Sick Day: "+sent[i].sickDay+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Maternity Leave"){
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Compensation Leave"){
            res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to head of department: "+hodName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Missed Day: "+sent[i].missedDay+"\n")
            res.write( "Reason "+sent[i].reason+"\n")
            res.write( "Submission date "+sent[i].submission_date+"\n")
            res.write("\n")
        }
        if(reqType=="Slot Linking"){
            const coordinatorID=sent[i].sentTo
        const coordinator=await StaffMemberModel.findById(coordinatorID)
        const coordinatorName=coordinator.name
        res.write("Request ID: "+sent[i].requestID+"\n")
            res.write("Request type: "+sent[i].reqType+"\n"),
            res.write( "Sent to course coordinator: "+coordinatorName+"\n")
            res.write( "Request state: "+sent[i].state+"\n")
            res.write( "Slot Day: "+sent[i].slotDay+"\n")
            res.write( "Slot Number: "+sent[i].slotNum+"\n")
            res.write( "Course ID: "+sent[i].courseID+"\n")
            res.write( "Reason: "+sent[i].reason+"\n")
            res.write( "Submission date: "+sent[i].submission_date+"\n")
            res.write("\n")
        }
    }
    res.end();
})


//---------------------------------------RECHECK ON BELOW CODEEEEEEEEEEEEEEE---------------------------------------------------
//---------------------------------------DO I NEED TO REMOVE NOTIFICATION AT HOD IF REQUEST IS CANCELLED--------------------
// router.delete('/cancelRequest',authenticateToken,async(req,res)=>{
//     //input req type, sentTo(if replacement) , submissionDate
//     //for replacement(req.body.reqType, slotNum,slotLoc,slotDate,replacementID)
//     const staff=await StaffMemberModel.findById(req.user.id)
//     const type=staff.staff_type
//     if(type=="HR"){
//         return res.json("HR do not have any leave requests.")
//     }
//     //all other requests except replacement 
//     const reqType=req.body.reqType
//     const submission_date=req.body.submission_date
//     if(reqType=="Accidental Leave" || reqType=="Sick Leave"|| reqType== "Maternity Leave"||reqType=="Slot Linking"
//        ||reqType=="Change Day off" || reqType=="Compensation Leave"){
    
//     //get request
//     console.log("here")
//     const date=moment(submission_date)
//     console.log("ss "+moment(submission_date).format())
//     const currReq=await request.findOne({reqType:reqType,submission_date:submission_date,sentBy:req.user.id})
//     if(!currReq){
//         return res.json("This request does not exist. Please enter correct request type and date.")
//     }
//     console.log(currReq)
//     const requestState=currReq.state
//     //if it is not pending
//     if(requestState!="Pending"){
//         console.log("state= "+requestState)
//         return res.json("This request has already been responded to. It cannot be cancelled.")
//     }

//     const reqRemoved=await request.findOneAndDelete({reqType:reqType,submission_date:submission_date,sentBy:req.user.id})
//     return res.json("Request cancelled successfully.")
//     //get hod 
//     // const academic=await AcademicStaffModel.findOne({member:req.user.id})
//     // const department=await DepartmentModel.findById(academic.department)
//     // const hodID=department.HOD
//     // const hod=await AcademicStaffModel.findById(hodID)
//     //  //send notification to hod
//     //  const notification=(await StaffMemberModel.findById(hodAcademic.member)).notifications
//     //  const notNew=notification
//     //  notNew[notNew.length]="You received a new accidental leave request"
//     //  const staffReplacement= await StaffMemberModel.findByIdAndUpdate(hodAcademic.member,{notifications:notNew})
//     }
//     else if(reqType=="Replacement"){
//         const replace=await StaffMemberModel.findOne({id:req.body.replacementID})
//         const currRequest=await request.findOne({reqType:reqType,submission_date:submission_date,slotDate:req.body.slotDate,
//             slotNum:req.body.slotNum,slotLoc:req.body.slotLoc,sentBy:req.user.id,sentTo:replace._id})
//             if(!currRequest){
//                 return res.json("This request does not exist. Please enter correct request details.")
//             }
//         const requestState=currRequest.state
//         const reqDate=currRequest.slotDate

//         if( requestState=="Pending"){
//             const reqRemoved=await request.findOneAndDelete({reqType:reqType,submission_date:submission_date,slotDate:req.body.slotDate,
//                 slotNum:req.body.slotNum,slotLoc:req.body.slotLoc,sentBy:req.user.id,sentTo:replace._id})
//             res.json("Request successfully removed")
//         }

//         //if day is yet to come and it is accepted then we 
//         //must go remove this slot from other member's schedule
//         if(moment().format('YYYY-MM-DD')<(moment(reqDate).format("YYYY-MM-DD"))){
//             const reqRemoved=await request.findOneAndDelete({reqType:reqType,submission_date:submission_date,slotDate:req.body.slotDate,
//             slotNum:req.body.slotNum,slotLoc:req.body.slotLoc,sentBy:req.user.id,sentTo:replace._id})
            
//             if(requestState=="Accepted"){
//             const rep=await AcademicStaffModel.findOne({member:replace._id})
//             const schedule=rep.schedule
//             var newSchedule=new Array()
//             var k=0;

//             //looping on other member's schedule to remove replacement slot 
//             for(var i=0;i<schedule.length;i++){
//                 const slotDate=schedule[i].date
//                 const slotNum=schedule[i].number
//                 const slotLoc=schedule[i].location

//                 if(!(moment(slotDate).format("YYYY-MM-DD")==moment(reqDate)&&
//                     slotNum==req.body.slotNum&&slotLoc==req.body.slotLoc)){
//                         newSchedule[k++]=schedule[i]
//                     }    
//             }
//             const updatedAcademic=await AcademicStaffModel.findByIdAndUpdate(req.body.sentTo,{schedule:newSchedule})
//         }
//         }

//         //it is not accepted so we simply delete it
//         else if(moment().format("YYYY-MM-DD")<moment(reqDate).format("YYYY-MM-DD")){
//                 return res.json("This request was for a replacement and its date has already passed")
//         }

//     }
// })
//////////////////////////////////////END OF OLD CANCEL REQUESTTTTTTTTTTTTTTTTTTTTT

router.put('/acceptReplacementRequest',authenticateToken,async(req,res)=>{
    //input will be sender type,submission date,sentBy (email or can change to normal id ,requestID)
    const requestID=req.body.requestID
    userAcademic=await AcademicStaffModel.findOne({member:req.user.id})
    if(!userAcademic) return res.status(401).send('You are not an academic member!');

    //check if this request actually exists
    const currRequest = await request.findOne({requestID:req.body.requestID})
    console.log("currRes= "+currRequest)
    if(!currRequest){
        return res.json("This request does not exist. Please enter correct request ID")
    }
    //check if this person is the sender of this request
    if(!currRequest.sentTo.equals(req.user.id)) 
    return res.status(401).send('This request was not sent to you.Cannot accept or reject.');
    if(currRequest.state=="Accepted"){
        return res.json("This request has already been accepted before.")
    }

    // const sentBy=(await StaffMemberModel.findOne({email:sentByEmail}))._id
    const reqType=currRequest.reqType
    const submission_date=currRequest.submission_date
    const sentBy=currRequest.sentBy
    const slotNum=currRequest.slotNum
    const slotDate=currRequest.slotDate
    const slotLoc=currRequest.slotLoc
    
    
    // const reqID=currRequest._id
    const reqUpdated=await request.findOneAndUpdate({requestID:requestID},{state:"Accepted"})

    //delete other requests sent to other academic members since one is already accepted
    const otherRepReq=await request.find({reqType:reqType,submission_date:submission_date,sentBy:sentBy,
        slotNum:slotNum,slotDate:slotDate,slotLoc:slotLoc})
    for(var i=0;i<otherRepReq.length;i++){
        if(otherRepReq[i].sentTo!=req.user.id){
           const delID= otherRepReq[i]._id
            const delReq=await request.findByIdAndDelete(delID)
        }
    }

    return res.json("Request successfully accepted.")


 })

 router.put('/rejectReplacementRequest',authenticateToken,async(req,res)=>{
    //input will be sender type,submission date,sentBy (email or can change to normal id ,requestID)
    const requestID=req.body.requestID
    userAcademic=await AcademicStaffModel.findOne({member:req.user.id})
    if(!userAcademic) return res.status(401).send('You are not an academic member!');

    //check if this request actually exists
    const currRequest = await request.findOne({requestID:req.body.requestID})
    console.log("currRes= "+currRequest)
    if(!currRequest){
        return res.json("This request does not exist. Please enter correct request ID")
    }
    //check if this person is the sender of this request
    if(!currRequest.sentTo.equals(req.user.id)) 
    return res.status(401).send('This request was not sent to you.Cannot accept or reject.');
    if(currRequest.state=="Rejected"){
        return res.json("This request has already been rejected before.")
    }

    // const sentBy=(await StaffMemberModel.findOne({email:sentByEmail}))._id
    const reqType=currRequest.reqType
    const submission_date=currRequest.submission_date
    const sentBy=currRequest.sentBy
    const slotNum=currRequest.slotNum
    const slotDate=currRequest.slotDate
    const slotLoc=currRequest.slotLoc
    
    
    // const reqID=currRequest._id
    const reqUpdated=await request.findOneAndUpdate({requestID:requestID},{state:"Rejected"})

    //delete other requests sent to other academic members since one is already accepted
    const otherRepReq=await request.find({reqType:reqType,submission_date:submission_date,sentBy:sentBy,
        slotNum:slotNum,slotDate:slotDate,slotLoc:slotLoc})
    for(var i=0;i<otherRepReq.length;i++){
        if(otherRepReq[i].sentTo!=req.user.id){
           const delID= otherRepReq[i]._id
            const delReq=await request.findByIdAndDelete(delID)
        }
    }

    return res.json("Request successfully rejected.")


 })



//-----------------------------------MARIA CANCEL REQUESTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT
//MARIAAAAAAAAAAAAAAAAAAAAAAAAAAA REJECT
router.get('/viewScheduleAllSemester', authenticateToken, async (req, res) => {
    const userAcademic = await AcademicStaffModel.findOne({member: req.user.id});

    if(!userAcademic) return res.status(401).send('You are not an academic member!');
    const schedule = userAcademic.schedule;
    const normalSlots = [];
    const replacementSlots = [];

    for(let index = 0; index < schedule.length; index++) {
        const slot = schedule[index];
        const courseTemp = await CourseModel.findById(slot.course);
        const locationTemp = await LocationModel.findById(slot.location);
        const returnedSlot = {
            day: slot.day,
            locationID: locationTemp.id,
            courseID: courseTemp.id,
            date: moment(slot.date).format('YYYY-MM-DD'),
            number: slot.number
        }
        if(slot.isReplaced) replacementSlots.push(returnedSlot);
        else normalSlots.push(returnedSlot);
    }
    const returnObject = {
        replacementSlots: replacementSlots,
        normalSlots: normalSlots
    }
    return res.status(200).json(returnObject);
});

router.get('/viewScheduleThisWeek', authenticateToken, async (req, res) => {
    const userAcademic = await AcademicStaffModel.findOne({member: req.user.id});

    if(!userAcademic) return res.status(401).send('You are not an academic member!');
    const schedule = userAcademic.schedule;
    const normalSlots = [];
    const replacementSlots = [];

    for(let index = 0; index < schedule.length; index++) {
        const slot = schedule[index];
        var flag = false;
        for(let i = 1; i < 8; i++) {
            const diff = moment().add(i, "days").format('YYYY-MM-DD');
            if(moment(slot.date).format('YYYY-MM-DD').toString() == diff.toString()) {
                flag = true;
                break;
            }
        }
        if(flag) {
        const courseTemp = await CourseModel.findById(slot.course);
        const locationTemp = await LocationModel.findById(slot.location);
        const returnedSlot = {
            day: slot.day,
            locationID: locationTemp.id,
            courseID: courseTemp.id,
            date: moment(slot.date).format('YYYY-MM-DD'),
            number: slot.number
        }
        if(slot.isReplaced) replacementSlots.push(returnedSlot);
        else normalSlots.push(returnedSlot);
    }
}
    const returnObject = {
        replacementSlots: replacementSlots,
        normalSlots: normalSlots
    }
    return res.status(200).json(returnObject);
});

router.post('/cancelRequest', authenticateToken, async (req, res) => {
    const userAcademic = await AcademicStaffModel.findOne({member: req.user.id});

    if(!userAcademic) return res.status(401).send('You are not an academic member!');
    const {requestID} = req.body;

    const request = await RequestModel.findOne({requestID: requestID});
    if(!request) res.status(400).send('Request not found!');
    if(!request.sentBy.equals(req.user.id)) return res.status(401).send('You are not the one who sent this request!');

    if(request.reqType != 'Replacement' && request.reqType != 'Annual Leave') {
        if(request.state != 'Pending') return res.status(400).send('Cannot cancel a non-pending request!');
        else {
            await RequestModel.findOneAndDelete({requestID: requestID});
            return res.status(200).send('Request cancelled successfully!');
        }
    }
    else {
        if(moment(request.slotDate).format('YYYY-MM-DD').toString() <= moment().format('YYYY-MM-DD').toString()) return res.status(400).send('Cannot cancel a replacement/annual request whose target day has passed!');
        else {
            if(request.reqType == 'Annual Leave' && request.state == 'Accepted') {
                const sentToAcademic = await AcademicStaffModel.findOne({member: request.replacementStaff});
                const location = await LocationModel.findOne({id: request.slotLoc});

                var position = -1;
                sentToAcademic.schedule.some(function(assignedSlot, ind) {
                    var flag = assignedSlot.number == request.slotNum 
                    && assignedSlot.location.equals(location._id)
                    && moment(assignedSlot.date).format('YYYY-MM-DD').toString() == moment(request.slotDate).format('YYYY-MM-DD').toString();

                    if(flag) {
                        position = ind;
                        return flag;
                    }
                });

                console.log(position);
                const slot = sentToAcademic.schedule[position];
                sentToAcademic.schedule.splice(position, 1);
                await sentToAcademic.save();

                slot.isReplaced = false;

                userAcademic.schedule.push(slot);
                await userAcademic.save();

                const courses = await CourseModel.find({});
                for(let i = 0; i < courses.length; i++) {
                    const course = courses[i];
                    
                    var pos = - 1;
                    var SlotExists = course.schedule.some(function(courseSlot, ind) {
                        var flag = moment(courseSlot.date).format('YYYY-MM-DD').toString() == moment(request.slotDate).format('YYYY-MM-DD').toString()
                        && courseSlot.number == slot.number
                        && courseSlot.location.equals(slot.location);
    
                        if(flag) {
                            pos = ind;
                            return flag;
                        }
                    });
    
                    if(SlotExists) {
                        course.schedule[pos].isReplaced = false;
                        course.academic_member_id = userAcademic._id;
                        await course.save();
                    }
                }
            }
            await RequestModel.findOneAndDelete({requestID: requestID});
            return res.status(200).send('Request deleted successfully!');
        }
    }
});







module.exports=router;
