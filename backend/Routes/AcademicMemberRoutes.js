const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const AcademicStaff = require('../Models/AcademicStaffModel.js');
const HR = require('../Models/HRModel.js');
const StaffMemberModel = require('../Models/StaffMemberModel.js');
const HRModel = require('../Models/HRModel.js');
const AcademicStaffModel = require('../Models/AcademicStaffModel.js');
const Course = require('../Models/CourseModel.js')
const location = require('../Models/LocationModel.js')
const department = require('../Models/DepartmentModel.js')
const faculty = require('../Models/FacultyModel.js')
const AttendanceSchema = StaffMemberModel.attendanceSchema
const monthlyHoursSchema = StaffMemberModel.monthlyHoursSchema
var moment = require('moment');
const request = require('../Models/RequestModel.js')
const slotSchema = require('../Models/SlotSchema')
//const authenticateToken=require('../Routes/StaffMemberRoutes')
const CounterModel = require('../Models/CounterModel')
const reqSchema = require('../Models/RequestModel').reqSchema
function authenticateToken(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.sendStatus(401).status('Access deined please log in first')

    }
    const verified = jwt.verify(token, process.env.TOKEN_SECRET)
    req.user = verified
    console.log("in auth " + req.user)
    next();
}

router.get('/teachingLocations', async (req, res) => {
    const locations = await location.find({
        $or: [
            { type: 'Tutorial Room' },
            { type: 'Lecture Hall' }
        ]
    });

    const locationIDs = Array.prototype.map.call(locations, location => { return location.id });
    return res.status(200).json(locationIDs);
});

router.post('/sendReplacementRequest', authenticateToken, async (req, res) => {
    //input(req.body.slotNum , req.body.slotDate , req.body.slotLoc)

    // console.log("req.user= "+req.user.id)
    const user = await StaffMemberModel.findById(req.user.id)
    const staff_type = user.staff_type
    if (staff_type == "HR") {
        return res.status(401).json("HR cannot submit this request.Only academic staff are permitted.")
    }
    const slotNum = req.body.slotNum
    const slotDate = req.body.slotDate
    const slotLoc = req.body.slotLoc
    if (!slotNum) {
        return res.status(400).json("Must submit slot number with the request.")
    }
    if (!slotDate) {
        return res.status(400).json("Must submit slot date with the request.")
    }
    if (!slotLoc) {
        return res.status(400).json("Must submit slot location with the request.")
    }
    var checkFin = false;
    const id = req.user.id
    if (moment(slotDate).format('YYYY-MM-DD') < (new moment().format("YYYY-MM-DD"))) {
        return res.status(400).json("Cannot replace a slot that has already passed.")
    }

    if (!(slotNum >= 1 && slotNum <= 5))
        return res.status(400).json("Please enter a valid slot number!")

    const slotLocation = await location.findOne({ id: req.body.slotLoc })
    if (!slotLocation)
        return res.status(400).json("Please enter a valid slot location!")


    const academicUser = await AcademicStaffModel.findOne({ member: req.user.id })
    var check = false
    const slots = academicUser.schedule
    var course = ''
    var courseID = ""



    //check if slot user is wanting to replace is available in his schedule
    for (var i = 0; i < slots.length; i++) {
        const locID = slots[i].location
        const loc = (await location.findById(locID)).id
        const date = slots[i].date
        const number = slots[i].number
        // console.log("num= "+number)
        // console.log("date= "+date)
        // console.log("loc"+loc)
        // console.log(moment(date).format("YYYY-MM-DD")==moment(slotDate).format("YYYY-MM-DD"))
        if (loc == slotLoc && slotNum == number && moment(date).format("YYYY-MM-DD") == moment(slotDate).format("YYYY-MM-DD")) {
            check = true
            course = (await Course.findById(slots[i].course))
            courseID = course.id
            //  console.log("COURSE NAME===="+course.name)
            //  console.log("check="+check)
        }

    }
    if (check == false)
        return res.status(400).send("This slot is not present in your schedule.")

    //will loop on all slots of each member that teaches this course 
    //to make sure that they are free during this replacement slot
    const courseAcademic = course.academic_staff
    // console.log(course.id)

    if (courseAcademic.length == 1) {
        return res.status(400).json("No other academic staff member who teach this course are available to send a replacement request to.")
    }

    //looping on staff giving the course of replacement slot
    for (var j = 0; j < courseAcademic.length; j++) {
        // console.log("in c1 "+courseAcademic[j])
        // console.log("courseid= "+course._id)
        // console.log("ca= "+courseAcademic[j])
        const replacement = await AcademicStaffModel.findById(courseAcademic[j])
        // console.log('bslsbizo= '+replacement)
        const staff = await StaffMemberModel.findById(replacement.member)

        const staffID = staff._id
        console.log("l= " + staff.name)

        const replacementSchedule = replacement.schedule
        //console.log("rep "+replacement.schedule)
        var check2 = false;

        //looping on schedule of each member
        for (var k = 0; k < replacementSchedule.length; k++) {
            console.log("sched= " + replacementSchedule[k])
            const currLocID = replacementSchedule[k].location
            const currLoc = (await location.findById(currLocID)).id
            const currDate = replacementSchedule[k].date
            const currNumber = replacementSchedule[k].number

            console.log("loc " + currLocID)
            console.log("currLoc " + currLoc)
            console.log("slotLoc " + slotLoc)
            console.log("currdate " + currDate)
            console.log("slotNum " + currNumber)
            console.log("number " + slotNum)
            console.log(moment(currDate).format("YYYY-MM-DD") == moment(slotDate).format("YYYY-MM-DD"))
            //if finding same slot
            if (currLoc == slotLoc && currNumber == slotNum && moment(currDate).format("YYYY-MM-DD") == moment(slotDate).format("YYYY-MM-DD")) {
                check2 = true
                console.log("check2" + check2)
            }
        }
        // var id=req.user.id
        console.log("teest =" + id)
        //if no such slot is found create a request for this member
        if (check2 == false && staffID != id) {

            const doc = await CounterModel.findById('Replacement-');
            if (!doc) {
                console.log("NOTTTTTTTTTTTTTTTTTT DOCCCCCCCCCC")
                const counterAcademic = new CounterModel({
                    _id: 'Replacement-'
                });
                try {
                    await counterAcademic.save();
                    console.log("successsssssssssssssssssss")
                }
                catch (err) {
                    console.log("errooooooooooooooooooooooooooooooooor")
                }
            }
            //create new request
            console.log("checkk2 " + check2)
            console.log("req=" + id)
            var newRequest = new request({
                reqType: "Replacement",
                slotDate: slotDate,
                slotNum: slotNum,
                slotLoc: slotLoc,
                sentBy: id,
                sentTo: replacement.member,
                state: "Pending",
                submission_date: new moment().format("YYYY-MM-DD")
            })

            //update notifications of person receiving request
            const notification = (await StaffMemberModel.findById(replacement.member)).notifications
            const notNew = notification
            notNew[notNew.length] = "You received a new replacement request"
            const test = (await StaffMemberModel.findById(replacement.member)).name
            console.log("notttt=============== " + replacement.member)
            const staffReplacement = (await StaffMemberModel.findByIdAndUpdate(replacement.member, { notifications: notNew }))
            console.log("new req==========" + newRequest)
            console.log("hereeeeeee")
            //post request in requests table with sent to added
            try {
                console.log("saved")
                checkFin = true
                const requ = await newRequest.save()
            }
            catch (err) {
                console.log("hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
                return res.status(400).json("Cannot save new request")
            }
        }

    }
    if (checkFin)
        return res.json({ success: "Requests successfully submitted" })
    else
        return res.status(400).json({ error: "Could not find any eligible candidate to replace with" })

})
router.get('/submittedRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }


    const sent = await request.find({ sentBy: req.user.id })
    // const received=await request.find({sentTo:req.user.id})
    // const sent = [...sent1, ...received];
    console.log("sent= " + sent)

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hodName = await StaffMemberModel.findById(hodID).name
        const senderID = await StaffMemberModel.findById(req.user.id)
        const sender = senderID.name
        const type = sent[i].type
        var reqType = sent[i].reqType
        var reqNew;
        //replacement
        // const academicMemberID=sent[i].sentTo
        // const academicMember=await StaffMemberModel.findById(academicMemberID)
        // const coordinatorName=coordinator.name
        if (sent[i].replacementStaff)
            var repl = (await StaffMemberModel.findById(sent[i].replacementStaff)).id

        if (reqType == "Annual Leave") {
            var rep = new Array()
            var a = 0
            for (var k = 0; k < sent[i].acceptedReplacement.length; k++) {

                console.log("iddddddddddddd= " + sent[i].acceptedReplacement[k].replacementID)
                const repID = (await StaffMemberModel.findById(sent[i].acceptedReplacement[k].replacementID)).id
                console.log("repIDDDDDDDDDDDDDDD=" + repID)
                rep[a++] = { realReplacementID: repID, realSlotNum: sent[i].acceptedReplacement[k].slotNum }
            }
            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: hodName, state: sent[i].state, slotNum: sent[i].slotNum, slotDate: moment(sent[i].slotDate).format("YYYY-MM-DD"),
                slotLoc: sent[i].slotLoc, replacementStaff: repl, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
                , RejectionReason: sent[i].RejectionReason, acceptedReplacement: rep
            }
            arr[k++] = reqNew
        }
        if (reqType == "Replacement") {
            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: hodName, state: sent[i].state, slotNum: sent[i].slotNum, slotDate: moment(sent[i].slotDate).format("YYYY-MM-DD"),
                slotLoc: sent[i].slotLoc, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
                , RejectionReason: sent[i].RejectionReason
            }
            arr[k++] = reqNew
        }
        if (reqType == "Change Day off") {
            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: hodName, state: sent[i].state, newDayOff: sent[i].newDayOff,
                reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
                , RejectionReason: sent[i].RejectionReason
            }
            arr[k++] = reqNew
        }
        if (reqType == "Accidental Leave") {
            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: hodName, state: sent[i].state, accidentDate: moment(sent[i].accidentDate).format("YYYY-MM-DD"),
                reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
                , RejectionReason: sent[i].RejectionReason
            }
            arr[k++] = reqNew

            // console.log("reqNewAccidenta= "+reqNew.accidentDate)

        }
        if (reqType == "Sick Leave") {
            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: hodName, state: sent[i].state,
                sickDay: moment(sent[i].sickDay).format("YYYY-MM-DD"), medicalDoc: sent[i].medicalDoc,
                reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD"),
                RejectionReason: sent[i].RejectionReason
            }
            arr[k++] = reqNew

        }
        if (reqType == "Maternity Leave") {
            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: hodName, state: sent[i].state, maternityDoc: sent[i].maternityDoc,
                reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD"),
                RejectionReason: sent[i].RejectionReason, startDate: moment(sent[i].startDate).format("YYYY-MM-DD"),
                endDate: moment(sent[i].endDate).format("YYYY-MM-DD")
            }
            arr[k++] = reqNew
        }
        if (reqType == "Compensation Leave") {
            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: hodName, state: sent[i].state, missedDay: moment(sent[i].missedDay).format("YYYY-MM-DD"),
                reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD"),
                compensatedDay: moment(sent[i].compensatedDay).format("YYYY-MM-DD")
                , RejectionReason: sent[i].RejectionReason
            }
            arr[k++] = reqNew
        }
        if (reqType == "Slot Linking") {
            const coordinatorID = sent[i].sentTo
            const coordinator = await StaffMemberModel.findById(coordinatorID)
            const coordinatorName = coordinator.name
            // res.write("Request ID: "+sent[i].requestID+"\n")

            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: coordinatorName, state: sent[i].state, slotDay: sent[i].slotDay,
                slotNum: sent[i].slotNum, courseID: sent[i].courseID,
                reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
                , RejectionReason: sent[i].RejectionReason
            }
            arr[k++] = reqNew
        }

    }
    res.json({ arr: arr, warning: "" });
    return
})


router.get('/receivedRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    console.log("in received requests")
    const user = await StaffMemberModel.findById(req.user.id)
    console.log("user=" + user)
    const type = user.staff_type
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }

    console.log("here before sent")
    const sent = await request.find({ sentTo: req.user.id })
    // const received=await request.find({sentTo:req.user.id})
    // const sent = [...sent1, ...received];
    console.log("sent= " + sent)

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hodName = await StaffMemberModel.findById(hodID).name
        const senderID = await StaffMemberModel.findById(req.user.id)
        const sender = senderID.name
        const type = sent[i].type
        var reqType = sent[i].reqType
        var reqNew;
        //replacement
        // const academicMemberID=sent[i].sentTo
        // const academicMember=await StaffMemberModel.findById(academicMemberID)
        // const coordinatorName=coordinator.name
        if (sent[i].replacementStaff)
            var repl = (await StaffMemberModel.findById(sent[i].replacementStaff)).id

        if (reqType == "Annual Leave") {
            var rep = new Array()
            var a = 0
            console.log("lengthhhhhhhhhh= " + sent[i].acceptedReplacement.length)
            console.log("reqIDDDDDDDDDDDDDDDDDDDD= " + sent[i].requestID)
            for (var k = 0; k < sent[i].acceptedReplacement.length; k++) {

                console.log("iddddddddddddd= " + sent[i].acceptedReplacement[k].replacementID)
                const repID = (await StaffMemberModel.findById(sent[i].acceptedReplacement[k].replacementID)).id
                console.log("repIDDDDDDDDDDDDDDD=" + repID)
                rep[a++] = { realReplacementID: repID, realSlotNum: sent[i].acceptedReplacement[k].slotNum }
            }
            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: hodName, state: sent[i].state, slotNum: sent[i].slotNum, slotDate: moment(sent[i].slotDate).format("YYYY-MM-DD"),
                slotLoc: sent[i].slotLoc, replacementStaff: repl, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD"),
                acceptedReplacement: rep
            }
            arr[k++] = reqNew
        }
        if (reqType == "Replacement") {
            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: hodName, state: sent[i].state, slotNum: sent[i].slotNum, slotDate: moment(sent[i].slotDate).format("YYYY-MM-DD"),
                slotLoc: sent[i].slotLoc, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
            }
            arr[k++] = reqNew
        }
        if (reqType == "Change Day off") {
            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: hodName, state: sent[i].state, newDayOff: sent[i].newDayOff,
                reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
            }
            arr[k++] = reqNew
        }
        if (reqType == "Accidental Leave") {
            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: hodName, state: sent[i].state, accidentDate: moment(sent[i].accidentDate).format("YYYY-MM-DD"),
                reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
            }
            arr[k++] = reqNew

        }
        if (reqType == "Sick Leave") {
            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: hodName, state: sent[i].state,
                sickDay: moment(sent[i].sickDay).format("YYYY-MM-DD"), medicalDoc: sent[i].medicalDoc,
                reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
            }
            arr[k++] = reqNew

        }
        if (reqType == "Maternity Leave") {
            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: hodName, state: sent[i].state, maternityDoc: sent[i].maternityDoc,
                reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
                , startDate: moment(sent[i].startDate).format("YYYY-MM-DD"),
                endDate: moment(sent[i].endDate).format("YYYY-MM-DD")
            }
            arr[k++] = reqNew
        }
        if (reqType == "Compensation Leave") {
            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: hodName, state: sent[i].state, missedDay: moment(sent[i].missedDay).format("YYYY-MM-DD"),
                reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD"),
                compensatedDay: moment(sent[i].compensatedDay).format("YYYY-MM-DD")
            }
            arr[k++] = reqNew
        }
        if (reqType == "Slot Linking") {
            const coordinatorID = sent[i].sentTo
            const coordinator = await StaffMemberModel.findById(coordinatorID)
            const coordinatorName = coordinator.name
            // res.write("Request ID: "+sent[i].requestID+"\n")

            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: coordinatorName, state: sent[i].state, slotDay: sent[i].slotDay,
                slotNum: sent[i].slotNum, courseID: sent[i].courseID,
                reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
            }
            arr[k++] = reqNew
        }

    }
    res.json({ arr: arr, warning: "" });
    return
})




//to get all types of sent replacment requests
router.get('/sentReplacementRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }


    const sent = await request.find({ sentBy: req.user.id, reqType: "Replacement" })
    // const received=await request.find({sentTo:req.user.id})
    // const sent = [...sent1, ...received];
    console.log("sent= " + sent)

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hodName = await StaffMemberModel.findById(hodID).name
        const senderID = await StaffMemberModel.findById(req.user.id)
        const sender = senderID.name
        const type = sent[i].type
        var reqType = sent[i].reqType

        //replacement
        // const academicMemberID=sent[i].sentTo
        // const academicMember=await StaffMemberModel.findById(academicMemberID)
        // const coordinatorName=coordinator.name

        const reqNew = {
            counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
            sentTo: hodName, state: sent[i].state, sentBy: sender,
            slotNum: sent[i].slotNum, slotDate: moment(sent[i].slotDate).format("YYYY-MM-DD"), slotLoc: sent[i].slotLoc,
            submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
        }
        arr[k++] = reqNew

    }
    res.json({ arr: arr, warning: "" });
    return
})

router.get('/sentAcceptedReplacementRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }


    const sent = await request.find({ state: "Accepted", sentBy: req.user.id, reqType: "Replacement" })
    // const received=await request.find({sentTo:req.user.id})
    // const sent = [...sent1, ...received];
    console.log("sent= " + sent)

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType
        const senderID = await StaffMemberModel.findById(req.user.id)
        const sender = senderID.name
        //replacement
        // const academicMemberID=sent[i].sentTo
        // const academicMember=await StaffMemberModel.findById(academicMemberID)
        // const coordinatorName=coordinator.name

        const reqNew = {
            counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
            sentTo: hodName, state: sent[i].state, sentBy: sender,
            slotNum: sent[i].slotNum, slotDate: moment(sent[i].slotDate).format("YYYY-MM-DD"), slotLoc: sent[i].slotLoc,
            submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
        }
        arr[k++] = reqNew

    }
    res.json({ arr: arr, warning: "" });
    return
})

router.get('/sentRejectedReplacementRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    // if(type=="HR"){
    //     return res.json("HR do not have replacement requests")
    // }
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }


    const sent = await request.find({ state: "Rejected", sentBy: req.user.id, reqType: "Replacement" })
    // const received=await request.find({sentTo:req.user.id})
    // const sent = [...sent1, ...received];
    console.log("sent= " + sent)

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType
        const senderID = await StaffMemberModel.findById(req.user.id)
        const sender = senderID.name
        //replacement
        // const academicMemberID=sent[i].sentTo
        // const academicMember=await StaffMemberModel.findById(academicMemberID)
        // const coordinatorName=coordinator.name

        const reqNew = {
            counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
            sentTo: hodName, state: sent[i].state, sentBy: sender,
            slotNum: sent[i].slotNum, slotDate: moment(sent[i].slotDate).format("YYYY-MM-DD"), slotLoc: sent[i].slotLoc,
            submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
        }
        arr[k++] = reqNew

    }
    res.json({ arr: arr, warning: "" });
    return
})

router.get('/sentPendingReplacementRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    // if(type=="HR"){
    //     return res.json("HR do not have replacement requests")
    // }
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }


    const sent = await request.find({ state: "Pending", sentBy: req.user.id, reqType: "Replacement" })
    // const received=await request.find({sentTo:req.user.id})
    // const sent = [...sent1, ...received];
    console.log("sent= " + sent)

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType
        const senderID = await StaffMemberModel.findById(req.user.id)
        const sender = senderID.name
        //replacement
        // const academicMemberID=sent[i].sentTo
        // const academicMember=await StaffMemberModel.findById(academicMemberID)
        // const coordinatorName=coordinator.name

        const reqNew = {
            counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
            sentTo: hodName, state: sent[i].state, sentBy: sender,
            slotNum: sent[i].slotNum, slotDate: moment(sent[i].slotDate).format("YYYY-MM-DD"), slotLoc: sent[i].slotLoc,
            submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
        }
        arr[k++] = reqNew

    }
    res.json({ arr: arr, warning: "" });
    return
})
/////////////////////////////////////////// RECEIVED REQUESTS
router.get('/receivedSickRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    // if(type=="HR"){
    //     return res.json("HR do not have replacement requests")
    // }
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }


    const sent = await request.find({ reqType: "Sick Leave", sentTo: req.user.id })
    // const received=await request.find({reqType:"Sick Leave",sentTo:req.user.id})
    // const sent = [...sent1, ...received];
    console.log("sent= " + sent)

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const sender = await StaffMemberModel.findById(sent[i].sentBy)
        const senderName = sender.name
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType

        const reqNew = {
            counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
            sentBy: senderName, sentTo: hodName, state: sent[i].state,
            sickDay: moment(sent[i].sickDay).format("YYYY-MM-DD"),
            reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
        }
        arr[k++] = reqNew



    }
    res.json({ arr: arr, warning: "" });
    return
})

router.get('/receivedCompensationRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    // if(type=="HR"){
    //     return res.json("HR do not have replacement requests")
    // }
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }


    const sent = await request.find({ reqType: "Compensation Leave", sentTo: req.user.id })
    // const received=await request.find({reqType:"Compensation Leave",sentTo:req.user.id})
    // const sent = [...sent1, ...received];
    console.log("l= " + sent.length)
    for (var k = 0; k < sent.length; k++)
        console.log("sent   mtrenityyyyyyyyyyyy = " + moment(sent[k].missedDay).format("YYYY-MM-DD"))

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        console.log(sent[i]._id)
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const sender = await StaffMemberModel.findById(sent[i].sentBy)
        const senderName = sender.name
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType

        const reqNew = {
            counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
            sentBy: senderName, sentTo: hodName, state: sent[i].state,
            missedDay: moment(sent[i].missedDay).format("YYYY-MM-DD"),
            reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
        }
        arr[k++] = reqNew



    }
    // console.log("arr= "+arr[1].missedDay)
    res.json({ arr: arr, warning: "" });
    return
})

router.get('/receivedChangeDayOffRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    // if(type=="HR"){
    //     return res.json("HR do not have replacement requests")
    // }
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }


    const sent = await request.find({ reqType: "Change Day Off", sentTo: req.user.id })
    // const received=await request.find({reqType:"Change Day Off",sentTo:req.user.id})
    // const sent = [...sent1, ...received];
    console.log("sent= " + sent)

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const sender = await StaffMemberModel.findById(sent[i].sentBy)
        const senderName = sender.name
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType

        const reqNew = {
            counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
            sentBy: senderName, sentTo: hodName, state: sent[i].state,
            newDayOff: moment(sent[i].newDayOff).format("YYYY-MM-DD"),
            reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
        }
        arr[k++] = reqNew



    }
    res.json({ arr: arr, warning: "" });
    return
})


router.get('/receivedMaternityRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    console.log("in maternity monica")
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    // if(type=="HR"){
    //     return res.json("HR do not have replacement requests")
    // }
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }


    const sent = await request.find({ reqType: "Maternity Leave", sentTo: req.user.id })
    // const received=await request.find({reqType:"Maternity Leave",sentTo:req.user.id})
    // const sent = [...sent1, ...received];
    // console.log("sent= "+sent)

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const sender = await StaffMemberModel.findById(sent[i].sentBy)
        const senderName = sender.name
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType

        const reqNew = {
            counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
            sentBy: senderName, sentTo: hodName, state: sent[i].state,
            maternityDoc: sent[i].maternityDoc,
            reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
        }
        arr[k++] = reqNew



    }
    // console.log("arr= "+arr)
    res.json({ arr: arr, warning: "" });
    return
})

router.get('/receivedSlotLinkingRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    console.log("in slot linkning")
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }


    const sent = await request.find({ reqType: "Slot Linking", sentTo: req.user.id })
    // const received=await request.find({reqType:"Slot Linking",sentTo:req.user.id})
    // const sent = [...sent1, ...received];
    // console.log("sent= "+sent)

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const sender = await StaffMemberModel.findById(sent[i].sentBy)
        const senderName = sender.name
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType

        const reqNew = {
            counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
            sentBy: senderName, sentTo: hodName, state: sent[i].state,
            slotDay: sent[i].slotDay, slotNum: sent[i].slotNum, courseID: sent[i].courseID,
            reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
        }
        arr[k++] = reqNew



    }
    res.json({ arr: arr, warning: "" });
    return
})
//to get all types of received replacement requests
router.get('/receivedReplacementRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    // if(type=="HR"){
    //     return res.json("HR do not have replacement requests")
    // }
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }


    const sent = await request.find({ sentTo: req.user.id, reqType: "Replacement" })
    // const received=await request.find({sentTo:req.user.id})
    // const sent = [...sent1, ...received];
    console.log("sent= " + sent)

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const receiverID = await StaffMemberModel.findById(req.user.id)
        const receiver = receiverID.name
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType

        //replacement
        // const academicMemberID=sent[i].sentTo
        // const academicMember=await StaffMemberModel.findById(academicMemberID)
        // const coordinatorName=coordinator.name

        const reqNew = {
            counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
            sentTo: hodName, state: sent[i].state, sentBy: receiver,
            slotNum: sent[i].slotNum, slotDate: moment(sent[i].slotDate).format("YYYY-MM-DD"), slotLoc: sent[i].slotLoc,
            submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
        }
        arr[k++] = reqNew

    }
    res.json({ arr: arr, warning: "" });
    return
})

router.get('/receivedAcceptedReplacementRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    // if(type=="HR"){
    //     return res.json("HR do not have replacement requests")
    // }
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }


    const sent = await request.find({ state: "Accepted", sentTo: req.user.id, reqType: "Replacement" })
    // const received=await request.find({sentTo:req.user.id})
    // const sent = [...sent1, ...received];
    console.log("sent= " + sent)

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType
        const receiverID = await StaffMemberModel.findById(req.user.id)
        const receiver = receiverID.name
        //replacement
        // const academicMemberID=sent[i].sentTo
        // const academicMember=await StaffMemberModel.findById(academicMemberID)
        // const coordinatorName=coordinator.name

        const reqNew = {
            counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
            sentTo: hodName, state: sent[i].state, sentBy: receiver,
            slotNum: sent[i].slotNum, slotDate: moment(sent[i].slotDate).format("YYYY-MM-DD"), slotLoc: sent[i].slotLoc,
            submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
        }
        arr[k++] = reqNew

    }
    res.json({ arr: arr, warning: "" });
    return
})
router.get('/receivedRejectedReplacementRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    // if(type=="HR"){
    //     return res.json("HR do not have replacement requests")
    // }
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }


    const sent = await request.find({ state: "Rejected", sentTo: req.user.id, reqType: "Replacement" })
    // const received=await request.find({sentTo:req.user.id})
    // const sent = [...sent1, ...received];
    console.log("sent= " + sent)

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType
        const receiverID = await StaffMemberModel.findById(req.user.id)
        const receiver = receiverID.name
        //replacement
        // const academicMemberID=sent[i].sentTo
        // const academicMember=await StaffMemberModel.findById(academicMemberID)
        // const coordinatorName=coordinator.name

        const reqNew = {
            counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
            sentTo: hodName, state: sent[i].state, sentBy: receiver,
            slotNum: sent[i].slotNum, slotDate: moment(sent[i].slotDate).format("YYYY-MM-DD"), slotLoc: sent[i].slotLoc,
            submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
        }
        arr[k++] = reqNew

    }
    res.json({ arr: arr, warning: "" });
    return
})
router.get('/receivedPendingReplacementRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    // if(type=="HR"){
    //     return res.json("HR do not have replacement requests")
    // }
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }


    const sent = await request.find({ state: "Pending", sentTo: req.user.id, reqType: "Replacement" })
    // const received=await request.find({sentTo:req.user.id})
    // const sent = [...sent1, ...received];
    console.log("sent= " + sent)

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType
        const receiverID = await StaffMemberModel.findById(req.user.id)
        const receiver = receiverID.name
        //replacement
        // const academicMemberID=sent[i].sentTo
        // const academicMember=await StaffMemberModel.findById(academicMemberID)
        // const coordinatorName=coordinator.name

        const reqNew = {
            counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
            sentTo: hodName, state: sent[i].state, sentBy: receiver,
            slotNum: sent[i].slotNum, slotDate: moment(sent[i].slotDate).format("YYYY-MM-DD"), slotLoc: sent[i].slotLoc,
            submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
        }
        arr[k++] = reqNew

    }
    res.json({ arr: arr, warning: "" });
    return
})
///////////////////////////////////////////////////////////////////
router.get('/sickRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    // if(type=="HR"){
    //     return res.json("HR do not have replacement requests")
    // }
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }


    const sent = await request.find({ reqType: "Sick Leave", sentBy: req.user.id })
    // const received=await request.find({reqType:"Sick Leave",sentTo:req.user.id})
    // const sent = [...sent1, ...received];
    console.log("sent= " + sent)

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const sender = await StaffMemberModel.findById(sent[i].sentBy)
        const senderName = sender.name
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType

        const reqNew = {
            counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
            sentBy: senderName, sentTo: hodName, state: sent[i].state,
            sickDay: moment(sent[i].sickDay).format("YYYY-MM-DD"),
            reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
        }
        arr[k++] = reqNew



    }
    res.json({ arr: arr, warning: "" });
    return
})
router.get('/acceptedSickRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    // if(type=="HR"){
    //     return res.json("HR do not have replacement requests")
    // }
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }


    const sent = await request.find({ reqType: "Sick Leave", sentBy: req.user.id, state: "Accepted" })
    // const received=await request.find({reqType:"Sick Leave",sentTo:req.user.id,state:"Accepted"})
    // const sent = [...sent1, ...received];
    console.log("sent= " + sent)

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const sender = await StaffMemberModel.findById(sent[i].sentBy)
        const senderName = sender.name
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType

        const reqNew = {
            counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
            sentBy: senderName, sentTo: hodName, state: sent[i].state,
            sickDay: moment(sent[i].sickDay).format("YYYY-MM-DD"),
            reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
        }
        arr[k++] = reqNew



    }
    res.json({ arr: arr, warning: "" });
    return
})
router.get('/rejectedSickRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    // if(type=="HR"){
    //     return res.json("HR do not have replacement requests")
    // }
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }


    const sent = await request.find({ reqType: "Sick Leave", sentBy: req.user.id, state: "Rejected" })
    // const received=await request.find({reqType:"Sick Leave",sentTo:req.user.id,state:"Rejected"})
    // const sent = [...sent1, ...received];
    console.log("sent= " + sent)

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const sender = await StaffMemberModel.findById(sent[i].sentBy)
        const senderName = sender.name
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType

        const reqNew = {
            counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
            sentBy: senderName, sentTo: hodName, state: sent[i].state,
            sickDay: moment(sent[i].sickDay).format("YYYY-MM-DD"),
            reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
        }
        arr[k++] = reqNew



    }
    res.json({ arr: arr, warning: "" });
    return
})

router.get('/pendingSickRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    // if(type=="HR"){
    //     return res.json("HR do not have replacement requests")
    // }
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }


    const sent = await request.find({ reqType: "Sick Leave", sentBy: req.user.id, state: "Pending" })
    // const received=await request.find({reqType:"Sick Leave",sentTo:req.user.id,state:"Pending"})
    // const sent = [...sent1, ...received];
    console.log("sent= " + sent)

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const sender = await StaffMemberModel.findById(sent[i].sentBy)
        const senderName = sender.name
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType

        const reqNew = {
            counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
            sentBy: senderName, sentTo: hodName, state: sent[i].state,
            sickDay: moment(sent[i].sickDay).format("YYYY-MM-DD"),
            reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
        }
        arr[k++] = reqNew



    }
    res.json({ arr: arr, warning: "" });
    return
})//////////////////////////////////////////////////////////////
router.get('/compensationRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    // if(type=="HR"){
    //     return res.json("HR do not have replacement requests")
    // }
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }


    const sent = await request.find({ reqType: "Compensation Leave", sentBy: req.user.id })
    // const received=await request.find({reqType:"Compensation Leave",sentTo:req.user.id})
    // const sent = [...sent1, ...received];
    console.log("sent   mtrenityyyyyyyyyyyy = " + sent)

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const sender = await StaffMemberModel.findById(sent[i].sentBy)
        const senderName = sender.name
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType

        const reqNew = {
            counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
            sentBy: senderName, sentTo: hodName, state: sent[i].state,
            missedDay: moment(sent[i].missedDay).format("YYYY-MM-DD"),
            reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
        }
        arr[k++] = reqNew



    }
    // console.log("arr= "+arr[1].missedDay)
    res.json({ arr: arr, warning: "" });
    return
})
router.get('/acceptedCompensationRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    // if(type=="HR"){
    //     return res.json("HR do not have replacement requests")
    // }
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }


    const sent = await request.find({ reqType: "Compensation Leave", sentBy: req.user.id, state: "Accepted" })
    // const received=await request.find({reqType:"Compensation Leave",sentTo:req.user.id,state:"Accepted"})
    // const sent = [...sent1, ...received];
    console.log("sent= " + sent)

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const sender = await StaffMemberModel.findById(sent[i].sentBy)
        const senderName = sender.name
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType

        const reqNew = {
            counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
            sentBy: senderName, sentTo: hodName, state: sent[i].state,
            missedDay: moment(sent[i].missedDay).format("YYYY-MM-DD"),
            reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
        }
        arr[k++] = reqNew



    }
    res.json({ arr: arr, warning: "" });
    return
})
router.get('/rejectedCompensationRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    // if(type=="HR"){
    //     return res.json("HR do not have replacement requests")
    // }
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }


    const sent = await request.find({ reqType: "Compensation Leave", sentBy: req.user.id, state: "Rejected" })
    // const received=await request.find({reqType:"Compensation Leave",sentTo:req.user.id,state:"Rejected"})
    // const sent = [...sent1, ...received];
    console.log("sent= " + sent)

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const sender = await StaffMemberModel.findById(sent[i].sentBy)
        const senderName = sender.name
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType

        const reqNew = {
            counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
            sentBy: senderName, sentTo: hodName, state: sent[i].state,
            missedDay: moment(sent[i].missedDay).format("YYYY-MM-DD"),
            reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
        }
        arr[k++] = reqNew



    }
    res.json({ arr: arr, warning: "" });
    return
})
router.get('/pendingCompensationRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    // if(type=="HR"){
    //     return res.json("HR do not have replacement requests")
    // }
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }


    const sent = await request.find({ reqType: "Compensation Leave", sentBy: req.user.id, state: "Pending" })
    // const received=await request.find({reqType:"Compensation Leave",sentTo:req.user.id,state:"Pending"})
    // const sent = [...sent1, ...received];
    console.log("sent= " + sent)

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const sender = await StaffMemberModel.findById(sent[i].sentBy)
        const senderName = sender.name
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType

        const reqNew = {
            counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
            sentBy: senderName, sentTo: hodName, state: sent[i].state,
            missedDay: moment(sent[i].missedDay).format("YYYY-MM-DD"),
            reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
        }
        arr[k++] = reqNew



    }
    res.json({ arr: arr, warning: "" });
    return
})
router.get('/changeDayOffRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    // if(type=="HR"){
    //     return res.json("HR do not have replacement requests")
    // }
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }


    const sent = await request.find({ reqType: "Change Day Off", sentBy: req.user.id })
    // const received=await request.find({reqType:"Change Day Off",sentTo:req.user.id})
    // const sent = [...sent1, ...received];
    console.log("sent= " + sent)

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const sender = await StaffMemberModel.findById(sent[i].sentBy)
        const senderName = sender.name
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType

        const reqNew = {
            counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
            sentBy: senderName, sentTo: hodName, state: sent[i].state,
            newDayOff: moment(sent[i].newDayOff).format("YYYY-MM-DD"),
            reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
        }
        arr[k++] = reqNew



    }
    res.json({ arr: arr, warning: "" });
    return
})
router.get('/acceptedchangeDayOffRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    // if(type=="HR"){
    //     return res.json("HR do not have replacement requests")
    // }
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }


    const sent = await request.find({ reqType: "Change Day Off", sentBy: req.user.id, state: "Accepted" })
    // const received=await request.find({reqType:"Change Day Off",sentTo:req.user.id,state:"Accepted"})
    // const sent = [...sent1, ...received];
    console.log("sent= " + sent)

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const sender = await StaffMemberModel.findById(sent[i].sentBy)
        const senderName = sender.name
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType

        const reqNew = {
            counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
            sentBy: senderName, sentTo: hodName, state: sent[i].state,
            newDayOff: moment(sent[i].newDayOff).format("YYYY-MM-DD"),
            reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
        }
        arr[k++] = reqNew



    }
    res.json({ arr: arr, warning: "" });
    return
})
router.get('/rejectedchangeDayOffRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    // if(type=="HR"){
    //     return res.json("HR do not have replacement requests")
    // }
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }


    const sent = await request.find({ reqType: "Change Day Off", sentBy: req.user.id, state: "Rejected" })
    // const received=await request.find({reqType:"Change Day Off",sentTo:req.user.id,state:"Rejected"})
    // const sent = [...sent1, ...received];
    console.log("sent= " + sent)

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const sender = await StaffMemberModel.findById(sent[i].sentBy)
        const senderName = sender.name
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType

        const reqNew = {
            counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
            sentBy: senderName, sentTo: hodName, state: sent[i].state,
            newDayOff: moment(sent[i].newDayOff).format("YYYY-MM-DD"),
            reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
        }
        arr[k++] = reqNew



    }
    res.json({ arr: arr, warning: "" });
    return
})

router.get('/pendingchangeDayOffRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    // if(type=="HR"){
    //     return res.json("HR do not have replacement requests")
    // }
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }


    const sent = await request.find({ reqType: "Change Day Off", sentBy: req.user.id, state: "Pending" })
    // const received=await request.find({reqType:"Change Day Off",sentTo:req.user.id,state:"Pending"})
    // const sent = [...sent1, ...received];
    console.log("sent= " + sent)

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const sender = await StaffMemberModel.findById(sent[i].sentBy)
        const senderName = sender.name
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType

        const reqNew = {
            counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
            sentBy: senderName, sentTo: hodName, state: sent[i].state,
            newDayOff: moment(sent[i].newDayOff).format("YYYY-MM-DD"),
            reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
        }
        arr[k++] = reqNew



    }
    res.json({ arr: arr, warning: "" });
    return
})
router.get('/compensationRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    // if(type=="HR"){
    //     return res.json("HR do not have replacement requests")
    // }
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }


    const sent = await request.find({ reqType: "Compensation Leave", sentBy: req.user.id })
    // const received=await request.find({reqType:"Compensation Leave",sentTo:req.user.id})
    // const sent = [...sent1, ...received];
    console.log("sent= " + sent)

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const sender = await StaffMemberModel.findById(sent[i].sentBy)
        const senderName = sender.name
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType

        const reqNew = {
            counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
            sentBy: senderName, sentTo: hodName, state: sent[i].state,
            missedDay: moment(sent[i].missedDay).format("YYYY-MM-DD"),
            reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
        }
        arr[k++] = reqNew



    }
    res.json({ arr: arr, warning: "" });
    return
})
router.get('/acceptedCompensationRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    // if(type=="HR"){
    //     return res.json("HR do not have replacement requests")
    // }
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }


    const sent = await request.find({ reqType: "Compensation Leave", sentBy: req.user.id, state: "Accepted" })
    // const received=await request.find({reqType:"Compensation Leave",sentTo:req.user.id,state:"Accepted"})
    // const sent = [...sent1, ...received];
    console.log("sent= " + sent)

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const sender = await StaffMemberModel.findById(sent[i].sentBy)
        const senderName = sender.name
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType

        const reqNew = {
            counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
            sentBy: senderName, sentTo: hodName, state: sent[i].state,
            missedDay: moment(sent[i].missedDay).format("YYYY-MM-DD"),
            reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
        }
        arr[k++] = reqNew



    }
    res.json({ arr: arr, warning: "" });
    return
})
router.get('/rejectedCompensationRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    // if(type=="HR"){
    //     return res.json("HR do not have replacement requests")
    // }
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }


    const sent = await request.find({ reqType: "Compensation Leave", sentBy: req.user.id, state: "Rejected" })
    // const received=await request.find({reqType:"Compensation Leave",sentTo:req.user.id,state:"Rejected"})
    // const sent = [...sent1, ...received];
    console.log("sent= " + sent)

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const sender = await StaffMemberModel.findById(sent[i].sentBy)
        const senderName = sender.name
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType

        const reqNew = {
            counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
            sentBy: senderName, sentTo: hodName, state: sent[i].state,
            missedDay: moment(sent[i].missedDay).format("YYYY-MM-DD"),
            reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
        }
        arr[k++] = reqNew



    }
    res.json({ arr: arr, warning: "" });
    return
})
router.get('/pendingCompensationRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    // if(type=="HR"){
    //     return res.json("HR do not have replacement requests")
    // }
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }


    const sent = await request.find({ reqType: "Compensation Leave", sentBy: req.user.id, state: "Pending" })
    // const received=await request.find({reqType:"Compensation Leave",sentTo:req.user.id,state:"Pending"})
    // const sent = [...sent1, ...received];
    console.log("sent= " + sent)

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const sender = await StaffMemberModel.findById(sent[i].sentBy)
        const senderName = sender.name
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType

        const reqNew = {
            counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
            sentBy: senderName, sentTo: hodName, state: sent[i].state,
            missedDay: moment(sent[i].missedDay).format("YYYY-MM-DD"),
            reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
        }
        arr[k++] = reqNew



    }
    res.json({ arr: arr, warning: "" });
    return
})
router.get('/maternityRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    console.log("in maternity")
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    // if(type=="HR"){
    //     return res.json("HR do not have replacement requests")
    // }
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }


    const sent = await request.find({ reqType: "Maternity Leave", sentBy: req.user.id })
    // const received=await request.find({reqType:"Maternity Leave",sentTo:req.user.id})
    // const sent = [...sent1, ...received];
    // console.log("sent= "+sent)

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const sender = await StaffMemberModel.findById(sent[i].sentBy)
        const senderName = sender.name
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType

        const reqNew = {
            counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
            sentBy: senderName, sentTo: hodName, state: sent[i].state,
            maternityDoc: sent[i].maternityDoc,
            reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
        }
        arr[k++] = reqNew



    }
    console.log("arr= " + arr)
    res.json({ arr: arr, warning: "" });
    return
})
router.get('/acceptedMaternityRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    // if(type=="HR"){
    //     return res.json("HR do not have replacement requests")
    // }
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }


    const sent = await request.find({ reqType: "Maternity Leave", sentBy: req.user.id, state: "Accepted" })
    // const received=await request.find({reqType:"Maternity Leave",sentTo:req.user.id,state:"Accepted"})
    // const sent = [...sent1, ...received];
    // console.log("sent= "+sent)

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const sender = await StaffMemberModel.findById(sent[i].sentBy)
        const senderName = sender.name
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType

        const reqNew = {
            counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
            sentBy: senderName, sentTo: hodName, state: sent[i].state,
            maternityDoc: sent[i].maternityDoc,
            reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
        }
        arr[k++] = reqNew



    }
    res.json({ arr: arr, warning: "" });
    return
})
router.get('/rejectedMaternityRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    // if(type=="HR"){
    //     return res.json("HR do not have replacement requests")
    // }
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }


    const sent = await request.find({ reqType: "Maternity Leave", sentBy: req.user.id, state: "Rejected" })
    // const received=await request.find({reqType:"Maternity Leave",sentTo:req.user.id,state:"Rejected"})
    // const sent = [...sent1, ...received];
    // console.log("sent= "+sent)

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const sender = await StaffMemberModel.findById(sent[i].sentBy)
        const senderName = sender.name
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType

        const reqNew = {
            counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
            sentBy: senderName, sentTo: hodName, state: sent[i].state,
            maternityDoc: sent[i].maternityDoc,
            reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
        }
        arr[k++] = reqNew



    }
    res.json({ arr: arr, warning: "" });
    return
})
router.get('/pendingMaternityRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    // if(type=="HR"){
    //     return res.json("HR do not have replacement requests")
    // }
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }


    const sent = await request.find({ reqType: "Maternity Leave", sentBy: req.user.id, state: "Pending" })
    // const received=await request.find({reqType:"Maternity Leave",sentTo:req.user.id,state:"Pending"})
    // const sent = [...sent1, ...received];
    // console.log("sent= "+sent)

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const sender = await StaffMemberModel.findById(sent[i].sentBy)
        const senderName = sender.name
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType

        const reqNew = {
            counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
            sentBy: senderName, sentTo: hodName, state: sent[i].state,
            maternityDoc: sent[i].maternityDoc,
            reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
        }
        arr[k++] = reqNew



    }
    res.json({ arr: arr, warning: "" });
    return
})

////////////////////////// NEW SLOT LINKING
/////////////////////////////////////////////////////////////
router.get('/slotLinkingRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    console.log("in slot linkning")
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }


    const sent = await request.find({ reqType: "Slot Linking", sentBy: req.user.id })
    // const received=await request.find({reqType:"Slot Linking",sentTo:req.user.id})
    // const sent = [...sent1, ...received];
    // console.log("sent= "+sent)

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const sender = await StaffMemberModel.findById(sent[i].sentBy)
        const senderName = sender.name
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType

        const reqNew = {
            counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
            sentBy: senderName, sentTo: hodName, state: sent[i].state,
            slotDay: sent[i].slotDay, slotNum: sent[i].slotNum, courseID: sent[i].courseID,
            reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
        }
        arr[k++] = reqNew



    }
    res.json({ arr: arr, warning: "" });
    return
})
router.get('/acceptedSlotLinkingRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    // if(type=="HR"){
    //     return res.json("HR do not have replacement requests")
    // }
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }


    const sent = await request.find({ reqType: "Slot Linking", sentBy: req.user.id, state: "Accepted" })
    // const received=await request.find({reqType:"Slot Linking",sentTo:req.user.id,state:"Accepted"})
    // const sent = [...sent1, ...received];
    // console.log("sent= "+sent)

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const sender = await StaffMemberModel.findById(sent[i].sentBy)
        const senderName = sender.name
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType

        const reqNew = {
            counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
            sentBy: senderName, sentTo: hodName, state: sent[i].state,
            slotDay: sent[i].slotDay, slotNum: sent[i].slotNum, courseID: sent[i].courseID,
            reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
        }
        arr[k++] = reqNew



    }
    res.json({ arr: arr, warning: "" });
    return
})
router.get('/rejectedSlotLinkingRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    // if(type=="HR"){
    //     return res.json("HR do not have replacement requests")
    // }
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }


    const sent = await request.find({ reqType: "Slot Linking", sentBy: req.user.id, state: "Rejected" })
    // const received=await request.find({reqType:"Slot Linking",sentTo:req.user.id,state:"Rejected"})
    // const sent = [...sent1, ...received];
    // console.log("sent= "+sent)

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const sender = await StaffMemberModel.findById(sent[i].sentBy)
        const senderName = sender.name
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType

        const reqNew = {
            counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
            sentBy: senderName, sentTo: hodName, state: sent[i].state,
            slotDay: sent[i].slotDay, slotNum: sent[i].slotNum, courseID: sent[i].courseID,
            reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
        }
        arr[k++] = reqNew



    }
    res.json({ arr: arr, warning: "" });
    return
})
router.get('/pendingSlotLinkingRequest', authenticateToken, async (req, res) => {
    //get all requests where id of sender is this user
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    // if(type=="HR"){
    //     return res.json("HR do not have replacement requests")
    // }
    if (type == "HR") {
        return res.json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }


    const sent = await request.find({ reqType: "Slot Linking", sentBy: req.user.id, state: "Pending" })
    // const received=await request.find({reqType:"Slot Linking",sentTo:req.user.id,state:"Pending"})
    // const sent = [...sent1, ...received];
    // console.log("sent= "+sent)

    const arr = []
    var k = 0
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const sender = await StaffMemberModel.findById(sent[i].sentBy)
        const senderName = sender.name
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType

        const reqNew = {
            counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
            sentBy: senderName, sentTo: hodName, state: sent[i].state,
            slotDay: sent[i].slotDay, slotNum: sent[i].slotNum, courseID: sent[i].courseID,
            reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
        }
        arr[k++] = reqNew



    }
    res.json({ arr: arr, warning: "" });
    return
})



router.post('/slotLinkingRequest', authenticateToken, async (req, res) => {
    //input course name slot number and slot day (req.body.courseID,req.body.slotDay , req.body.slotNum,OPTIONAL req.body.reason)
    const staff = await StaffMemberModel.findById(req.user.id)
    const type = staff.staff_type
    if (type == "HR") {
        return res.status(401).json({ arr: [], warning: "HR cannot submit this request.Only academic staff are permitted." })
    }
    if (!req.body.slotDay) {
        return res.status(400).json("Must submit slot day with the request.")
    }
    if (!(req.body.slotDay == "Saturday" || req.body.slotDay == "Sunday" || req.body.slotDay == "Monday"
        || req.body.slotDay == "Tuesday" || req.body.slotDay == "Wednesday" || req.body.slotDay == "Thursday" || req.body.slotDay == "Thursday")) {
        return res.status(400).json("Please enter a day with correct format (eg.Saturday).")
    }

    if (!req.body.slotNum) {
        return res.status(400).json("Must submit slot number with the request.")
    }
    if (!req.body.courseID) {
        return res.status(400).json("Must submit course ID with the request.")
    }
    if (!(req.body.slotNum >= 1 && req.body.slotNum <= 5))
        return res.status(400).json("Please enter correct slot number.")

    const academic = await AcademicStaffModel.findOne({ member: req.user.id })
    //check if this slot day is his day off
    const day_off = academic.day_off
    const slotDayEntered = req.body.slotDay
    if (day_off == slotDayEntered || slotDayEntered == "Friday")
        return res.status(400).json("Cannot make an slot linking request for a day that is your day-off!")



    const courseName = await Course.findOne({ id: req.body.courseID })
    console.log("coursenAME= " + courseName)
    if (!courseName) {
        return res.status(400).json("No such course exists. Please enter correct course ID.")
    }
    const courseID = courseName.id
    const courseCoordinatorID = courseName.course_coordinator
    const courseCoordinator = await AcademicStaffModel.findById(courseCoordinatorID)
    //  const coordinatorID=courseCoordinator.member
    if (!courseCoordinator) {
        return res.status(400).json("Currently there is not an assigned course coorinator to this course send this request to.")
    }
    const coordinatorID = courseCoordinator.member
    //will compare slot timings with user schedule to make sure that he is free during this slot
    const slotNum = req.body.slotNum
    const slotDay = req.body.slotDay

    const schedule = academic.schedule
    var check = false;

    //check if this slot on this day for this course actually exists
    const currCourse = await Course.findOne({ id: req.body.courseID })
    const courseSchedule = currCourse.schedule
    var boolSlot = false
    for (var j = 0; j < courseSchedule.length; j++) {
        if (courseSchedule[j].number == slotNum && courseSchedule[j].day == slotDay)
            boolSlot = true
    }
    if (!boolSlot)
        return res.status(400).json("This slot does not exist.Please enter valid slot details.")




    //check if user already has a slot during the time he is requesting a slot linking for
    for (var i = 0; i < schedule.length; i++) {
        if (schedule[i].day == slotDay && schedule[i].number == slotNum) {
            return res.json("User already has teaching activities during this slot. Cannot send this request.")
        }
    }

    //check if user teaches this course
    //const academic=await AcademicStaffModel.find({member:req.user.id})
    // const coursesIDs=academic.courses
    // var teaches=false
    // // console.log(coursesIDs)
    // for(var i=0;i< coursesIDs.length;i++){
    //    // console.log(coursesIDs[i])
    //     var courses=await Course.findById(coursesIDs[i])
    //     // console.log(courses)
    //     // console.log(courses.id)
    //     if(courses.id==courseID)
    //         teaches=true
    // }
    // if(teaches==false)
    // return res.json("Not permitted to send this request because user does not teach this course.")

    //more time efficient for above code
    //to only get ._id of entered course and compare it with other course ids so ot to waste time searching
    const coursesIDs = academic.courses
    var teaches = false
    const enteredCourseID = (await Course.findOne({ id: courseID }))._id
    // console.log(enteredCourseID)
    for (var i = 0; i < coursesIDs.length; i++) {
        // console.log("ccccccccccccc= "+coursesIDs[i])
        const check = (coursesIDs[i].toString() == enteredCourseID)
        // console.log("ccccccchhhhhhhhhhhhhheeeeeeeeee= "+check)
        if (coursesIDs[i].toString() == enteredCourseID) {
            teaches = true
            console.log("hereetttttttttttttttttttttttttttt")
        }
    }
    if (teaches == false)
        return res.status(400).json("Not permitted to send this request because user does not teach this course.")




    //creating new slot linking request
    var reason = ''
    if (req.body.reason)
        reason = req.body.reason
    const doc = await CounterModel.findById('SlotLinking-');
    if (!doc) {
        // console.log("NOTTTTTTTTTTTTTTTTTT DOCCCCCCCCCC")
        const counterAcademic = new CounterModel({
            _id: 'SlotLinking-'
        });
        try {
            await counterAcademic.save();
            // console.log("successsssssssssssssssssss")
        }
        catch (err) {
            // console.log("errooooooooooooooooooooooooooooooooor")
        }
    }
    var newRequest = new request({
        reqType: "Slot Linking",
        slotDay: slotDay,
        slotNum: slotNum,
        courseID: courseID,
        sentBy: req.user.id,
        sentTo: coordinatorID,
        state: "Pending",
        reason: reason,
        submission_date: new moment().format("YYYY-MM-DD")
    })
    try {
        res.json("Request successfully submitted.")
        await newRequest.save()
    }
    catch (err) {
        res.status(400).json(err)
    }

    //sending notification to course coordinator
    const notification = (await StaffMemberModel.findById(coordinatorID)).notifications
    // console.log("not= "+notification)
    const notNew = notification
    notNew[notNew.length] = "You received a new slot linking request."
    const staffReplacement = await StaffMemberModel.findByIdAndUpdate(coordinatorID, { notifications: notNew })

})

router.post('/changeDayOff', authenticateToken, async (req, res) => {
    //input will be new day off (req.body.newDayOff , (OPTIONAL) req.user.reason)
    const staff = await StaffMemberModel.findById(req.user.id)
    const type = staff.staff_type
    if (type == "HR") {
        return res.json("HR are not permitted to send this request.Only academic members are allowed.")
    }
    if (!req.body.newDayOff) {
        return res.json("Must submit new day-off with request.")
    }
    // console.log("dayyyyyyyyyyyy= "+req.body.day_off)
    if (!(req.body.newDayOff == "Saturday" || req.body.newDayOff == "Sunday" || req.body.newDayOff == "Monday"
        || req.body.newDayOff == "Tuesday" || req.body.newDayOff == "Wednesday" || req.body.newDayOff == "Thursday" || req.body.newDayOff == "Friday")) {
        return res.json("Please enter a day with correct format (eg.Saturday).")
    }


    const academic = await AcademicStaffModel.findOne({ member: req.user.id })
    const schedule = academic.schedule
    const day_off = academic.day_off
    if (day_off == req.body.newDayOff) {
        return res.status(400).json("This day is already your day-off! Please enter a new day.")
    }

    if (req.body.newDayOff == "Friday") {
        return res.status(400).json("Friday is already a day off!Please submit a new day.")
    }
    for (var i = 0; i < schedule.length; i++) {
        const slotDay = schedule[i].day
        if (slotDay == req.body.newDayOff) {
            return res.status(400).json("Cannot request for a day off on a day with teaching activities!")
        }
    }
    //getting department of this user to get head of department to send request to
    const departmentID = academic.department
    const departmentName = await department.findById(departmentID)
    const hodID = departmentName.HOD
    if (!hodID) {
        return res.json("There is currently no head of this department to send this request to!")
    }
    const hodAcademic = await AcademicStaffModel.findById(hodID)


    //make a request
    var reason = ""
    if (req.body.reason)
        reason = req.body.reason

    const doc = await CounterModel.findById('ChangeDayOff-');
    if (!doc) {
        // console.log("NOTTTTTTTTTTTTTTTTTT DOCCCCCCCCCC")
        const counterAcademic = new CounterModel({
            _id: 'ChangeDayOff-'
        });
        try {
            await counterAcademic.save();
            // console.log("successsssssssssssssssssss")
        }
        catch (err) {
            // console.log("errooooooooooooooooooooooooooooooooor")
        }
    }
    var newRequest = new request({
        reqType: "Change Day off",
        newDayOff: req.body.newDayOff,
        sentBy: req.user.id,
        sentTo: hodAcademic.member,
        state: "Pending",
        reason: reason,
        submission_date: new moment().format("YYYY-MM-DD")
    })
    try {
        res.json("Request successfully submitted!")
        await newRequest.save()
    }
    catch (err) {
        res.json(err)
    }

    //sending notification to hod
    const notification = (await StaffMemberModel.findById(hodAcademic.member)).notifications
    const notNew = notification
    notNew[notNew.length] = "You received a new change day-off request."
    const staffReplacement = await StaffMemberModel.findByIdAndUpdate(hodAcademic.member, { notifications: notNew })


})
//Annual
router.post('/annualRequest', authenticateToken, async (req, res) => {
    //input will be new day off (req.body.newDayOff , (OPTIONAL) req.user.reason)
    const staff = await StaffMemberModel.findById(req.user.id)
    const type = staff.staff_type
    if (type == "HR") {
        return res.json("HR are not permitted to send this request.Only academic members are allowed.")
    }
    // console.log("dayyyyyyyyyyyy= "+req.body.day_off)


    //getting department of this user to get head of department to send request to
    const academic = await AcademicStaffModel.findOne({ member: req.user.id })
    const departmentID = academic.department
    const departmentName = await department.findById(departmentID)
    const hodID = departmentName.HOD
    if (!hodID) {
        return res.json("There is currently no head of this department to send this request to.")
    }
    const hodAcademic = await AcademicStaffModel.findById(hodID)
    if (!req.body.slotDate) {
        return res.json("Must enter day you are requesting a leave for.")
    }

    //make a request
    var reason = ""
    if (req.body.reason)
        reason = req.body.reason

    const doc = await CounterModel.findById('AnnualLeave-');
    if (!doc) {
        // console.log("NOTTTTTTTTTTTTTTTTTT DOCCCCCCCCCC")
        const counterAcademic = new CounterModel({
            _id: 'AnnualLeave-'
        });
        try {
            await counterAcademic.save();
            // console.log("successsssssssssssssssssss")
        }
        catch (err) {
            // console.log("errooooooooooooooooooooooooooooooooor")
        }
    }
    var repl = ""
    if (req.body.replacementStaff) {
        repl = req.body.replacementStaff
    }

    var newRequest = new request({
        reqType: "Annual Leave",
        sentBy: req.user.id,
        sentTo: hodAcademic.member,
        replacementStaff: repl,
        slotDate: moment(req.body.slotDate).format("YYYY-MM-DD"),
        state: "Pending",
        reason: reason,
        submission_date: new moment().format("YYYY-MM-DD")
    })
    try {
        res.json("Request successfully submitted.")
        await newRequest.save()
    }
    catch (err) {
        res.json(err)
    }

    //sending notification to hod
    const notification = (await StaffMemberModel.findById(hodAcademic.member)).notifications
    const notNew = notification
    notNew[notNew.length] = "You received a new Annual request."
    const staffReplacement = await StaffMemberModel.findByIdAndUpdate(hodAcademic.member, { notifications: notNew })


})
///////
router.post('/accidentalLeave', authenticateToken, async (req, res) => {
    //input is (req.body.accidentDate , OPTIONAL req.body.reason)
    // const check=(moment(req.body.accidentDate).format("YYYY-MM-DD")<(new moment().format("YYYY-MM-DD")))
    // console.log("in accidental req"+check)
    const staff = await StaffMemberModel.findById(req.user.id)
    const type = staff.staff_type
    if (type == "HR") {
        return res.status(401).json("HR are not permitted to send leave requests.Only academic members are allowed.")
    }
    if (!req.body.accidentDate) {
        return res.status(400).json("Must submit accident date with the request.")
    }

    //check if the accident day is a day where the user didnt actually attend
    const attendance = staff.attendance
    if (attendance) {
        console.log("att= " + attendance)
        for (var i = 0; i < attendance.length; i++) {
            console.log("i= " + i)
            console.log(" " + moment(attendance[i].date).format("YYYY-MM-DD"))
            if (moment(attendance[i].date).format("YYYY-MM-DD") == req.body.accidentDate) {
                // console.log("i= "+i)
                // console.log(" "+moment(attendance[i]).format("YYYY-MM-DD"))
                console.log("sickDay= " + req.body.accidentDate)
                return res.status(400).json("Cannot make an accidental leave request for a day that was attended!")
            }
        }
    }
    const academic = await AcademicStaffModel.findOne({ member: req.user.id })

    //check if this sick day is his day off
    const day_off = academic.day_off
    const accidentDateEntered = moment(req.body.accidentDate).format("dddd")
    if (day_off == accidentDateEntered || accidentDateEntered == "Friday")
        return res.status(400).json("Cannot make an accidental leave request for a day that is your day-off!")

    if (moment(req.body.accidentDate).format("YYYY-MM-DD") > new moment().format("YYYY-MM-DD"))
        return res.status(400).json("Cannot submit an accidental leave request for an accident that has not already happened!")



    //get annual and accidental leave balance
    // const academic=await AcademicStaffModel.findOne({member:req.user.id})
    //const staff=await StaffMemberModel.findById(req.user.id)
    const accidentalDaysLeft = staff.accidentalDaysLeft
    const annual_days = staff.annual_days

    //get hod
    const departmentID = academic.department
    const departmentRec = await department.findById(departmentID)
    const hodID = departmentRec.HOD
    if (!hodID) {
        return res.status(401).json("There is currently no head of this department to send this request to.")
    }
    const hodAcademic = await AcademicStaffModel.findById(hodID)

    //check of number of accidental days left or annual days is equal to 0
    if (accidentalDaysLeft == 0) {
        return res.status(401).json("Cannot submit request.Maximum number of accidental day leaves have been reached!")
    }
    if (annual_days == 0) {
        return res.status(401).json("Cannot submit request. Annual leave balance is currently empty!")
    }
    if (!(moment(req.body.accidentDate).format("YYYY-MM-DD") < (new moment().format("YYYY-MM-DD")))) {
        console.log("beforeeeeeeeeeeee")
        return res.status(400).json("Must only submit requests for accidents that already happened!")

    }
    //make request
    var reason = ''
    if (req.body.reason)
        reason = req.body.reason
    // if(!req.body.accidentDate){
    //     return res.json("Must submit accident date with request")
    // }
    const accidentDate = req.body.accidentDate
    const doc = await CounterModel.findById('AccidentalLeave-');
    if (!doc) {
        // console.log("NOTTTTTTTTTTTTTTTTTT DOCCCCCCCCCC")
        const counterAcademic = new CounterModel({
            _id: 'AccidentalLeave-'
        });
        try {
            await counterAcademic.save();
            // console.log("successsssssssssssssssssss")
        }
        catch (err) {
            // console.log("errooooooooooooooooooooooooooooooooor")
        }
    }

    //create request
    var newRequest = new request({
        reqType: "Accidental Leave",
        accidentDate: accidentDate,
        sentBy: req.user.id,
        sentTo: hodAcademic.member,
        state: "Pending",
        reason: reason,
        submission_date: new moment().format("YYYY-MM-DD")
    })
    try {
        await newRequest.save()
        res.status(200).json("Request successfully submitted.")
    }
    catch (err) {
        res.status(400).json(err)
    }

    //update annual and accidental leave balance of user after acceptance!!
    //const userUpdated=await StaffMemberModel.findByIdAndUpdate(req.user.id,{accidentalDaysLeft:(accidentalDaysLeft-1),annual_days:(annual_days-1)})

    //send notification to hod
    const notification = (await StaffMemberModel.findById(hodAcademic.member)).notifications
    const notNew = notification
    notNew[notNew.length] = "You received a new accidental leave request."
    const staffReplacement = await StaffMemberModel.findByIdAndUpdate(hodAcademic.member, { notifications: notNew })
})

router.post('/sickLeave', authenticateToken, async (req, res) => {
    //input is sick day date and medical documents (req.body.sickDay , req.body.medicalDoc, OPTIONAL req.body.reason)
    const staff = await StaffMemberModel.findById(req.user.id)
    const type = staff.staff_type
    if (type == "HR") {
        return res.status(401).json("HR are not permitted to send leave requests.Only academic members are allowed.")
    }
    if (!req.body.sickDay) {
        return res.status(400).json("Must submit sick day date with the request.")
    }
    const sickDay = req.body.sickDay
    //getting hod
    const academic = await AcademicStaffModel.findOne({ member: req.user.id })
    const departmentID = academic.department
    const departmentRec = await department.findById(departmentID)
    const hodID = departmentRec.HOD
    if (!hodID) {
        return res.status(400).json("There is currently no head of this department to send this request to.")
    }

    // ---------------------------------MILESTONE2---------------------------------
    //  //check if the sick day is a day where the user didnt actually attend
    //  const attendance=staff.attendance
    //  if(attendance){
    //      console.log("att= "+attendance)
    //  for(var i=0;i<attendance.length;i++){
    //     console.log("i= "+i)
    //     console.log(" "+moment(attendance[i].date).format("YYYY-MM-DD"))
    //     if(moment(attendance[i].date).format("YYYY-MM-DD")==req.body.sickDay){
    //         // console.log("i= "+i)
    //         // console.log(" "+moment(attendance[i]).format("YYYY-MM-DD"))
    //         console.log("sickDay= "+req.body.sickDay)
    //         return res.status(400).json("Cannot make a sick leave request for a day that was attended!")
    //     }
    //  }
    // }
    //  //check if this sick day is his day off
    //  const day_off=academic.day_off
    //  const sickDayEntered=moment(req.body.sickDay).format("dddd")
    //  if(day_off==sickDayEntered || sickDayEntered=="Friday")
    //  return res.status(400).json("Cannot make a sick leave request for a day that is your day-off!")
    // //  console.log(moment(req.body.sickDay).format("YYYY-MM-DD"))
    // //  console.log(new moment().format("YYYY-MM-DD"))
    //  if(!(moment(req.body.sickDay).format("YYYY-MM-DD")<(new moment().format("YYYY-MM-DD")))){
    //     console.log("beforeeeeeeeeeeee")
    //        return res.status(400).json("You are only allowed to submit a sick leave request for an absence that has happened by maximum 3 days ago!")

    //    }

    //getting all days allowed to send request which is 3 days from today
    var diff3 = moment().subtract(3, "days").format("YYYY-MM-DD");
    var diff2 = moment().subtract(2, "days").format("YYYY-MM-DD");
    var diff1 = moment().subtract(1, "days").format("YYYY-MM-DD");
    var diff0 = moment().format("YYYY-MM-DD");
    // console.log("diff0= "+diff0)
    // console.log("diff1= "+diff1)
    // console.log("diff2= "+diff2)
    // console.log("diff3= "+diff3)
    if (sickDay == diff0 || sickDay == diff1 || sickDay == diff2 || sickDay == diff3) {
        //no medical documents submitted
        if (!req.body.medicalDoc) {
            return res.status(400).json("Medical documents to prove medical condition must be submitted with the request.")
        }

        //medical documents submitted
        else {
            //check if the sick day is a day where the user didnt actually attend
            const attendance = staff.attendance
            if (attendance) {
                console.log("att= " + attendance)
                for (var i = 0; i < attendance.length; i++) {
                    console.log("i= " + i)
                    console.log(" " + moment(attendance[i].date).format("YYYY-MM-DD"))
                    if (moment(attendance[i].date).format("YYYY-MM-DD") == req.body.sickDay) {
                        console.log("sickDay= " + req.body.sickDay)
                        return res.status(400).json("Cannot make a sick leave request for a day that was attended!")
                    }
                }
            }
            //check if this sick day is his day off
            const day_off = academic.day_off
            const sickDayEntered = moment(req.body.sickDay).format("dddd")
            if (day_off == sickDayEntered || sickDayEntered == "Friday")
                return res.status(400).json("Cannot make a sick leave request for a day that is your day-off!")

            if (!(moment(req.body.sickDay).format("YYYY-MM-DD") < (new moment().format("YYYY-MM-DD")))) {
                console.log("beforeeeeeeeeeeee")
                return res.status(400).json("You are only allowed to submit a sick leave request for an absence that has happened by maximum 3 days ago!")

            }




            const hodAcademic = await AcademicStaffModel.findById(hodID)

            //create request
            var reason = ' '
            if (req.body.reason)
                reason = req.body.reason
            const doc = await CounterModel.findById('SickLeave-');
            if (!doc) {
                // console.log("NOTTTTTTTTTTTTTTTTTT DOCCCCCCCCCC")
                const counterAcademic = new CounterModel({
                    _id: 'SickLeave-'
                });
                try {
                    await counterAcademic.save();
                    // console.log("successsssssssssssssssssss")
                }
                catch (err) {
                    // console.log("errooooooooooooooooooooooooooooooooor")
                }
            }
            var newRequest = new request({
                reqType: "Sick Leave",
                sickDay: moment(sickDay),
                sentBy: req.user.id,
                sentTo: hodAcademic.member,
                medicalDoc: req.body.medicalDoc,
                state: "Pending",
                reason: reason,
                submission_date: new moment().format("YYYY-MM-DD")
            })
            try {
                await newRequest.save()
                res.json("Request successfully submitted.")
            }
            catch (err) {
                res.status(400).json(err)
            }


            //send notification to hod
            const notification = (await StaffMemberModel.findById(hodAcademic.member)).notifications
            const notNew = notification
            notNew[notNew.length] = "You received a new sick leave request."
            const staffReplacement = await StaffMemberModel.findByIdAndUpdate(hodAcademic.member, { notifications: notNew })
        }

    }


    //request sent after 3 days deadline has passed
    else if (moment(req.body.sickDay).format("YYYY-MM-DD") < moment().format("YYYY-MM-DD")) {
        console.log("late sickkkkkkkkkkkkkk")
        return res.status(400).json("Deadline for sending sick leave request has been exceeded.Cannot send request!")
    }
    else if (moment(req.body.sickDay).format("YYYY-MM-DD") > new moment().format("YYYY-MM-DD")) {
        return res.status(400).json("Sick day leave request must be submitted by a maximum of 3 days after sick day date.")
    }


})

router.post('/maternityLeave', authenticateToken, async (req, res) => {
    //(req.body.maternityDoc, OPTIONAL req.body.reason)
    const user = await StaffMemberModel.findById(req.user.id)
    const type = user.staff_type
    if (type == "HR") {
        return res.status(401).json("HR are not permitted to send leave requests.Only academic members are allowed.")
    }

    // const user=await StaffMemberModel.findById(req.user.id)
    const gender = user.gender
    if (gender != "Female") {
        return res.status(401).json("Only female staff members are eligible to send this request.")
    }
    if (!req.body.maternityDoc) {
        return res.status(400).json("Documents to prove the maternity condition must be submitted.")
    }
    if (!(req.body.startDate)) {
        return res.status(400).json("Must input start date!")
    }
    if (!(req.body.endDate)) {
        return res.status(400).json("Must input end date!")
    }
    if (req.body.startDate <= (new moment().format("YYYY-MM-DD")))
        return res.status(400).json("Start date must be a date after current day.")
    if (req.body.endDate <= req.body.startDate)
        return res.status(400).json("End date must be a date after start date.")

    const academic = await AcademicStaffModel.findOne({ member: req.user.id })
    const departmentID = academic.department
    const departmentRec = await department.findById(departmentID)
    const hodID = departmentRec.HOD
    if (!hodID) {
        return res.status(400).json("There is currently no head of this department to send this request to.")
    }
    const hodAcademic = await AcademicStaffModel.findById(hodID)
    const maternityDoc = req.body.maternityDoc
    //create request
    var reason = ''
    if (req.body.reason)
        reason = req.body.reason
    const doc = await CounterModel.findById('MaternityLeave-');
    if (!doc) {
        //  console.log("NOTTTTTTTTTTTTTTTTTT DOCCCCCCCCCC")
        const counterAcademic = new CounterModel({
            _id: 'MaternityLeave-'
        });
        try {
            await counterAcademic.save();
            //  console.log("successsssssssssssssssssss")
        }
        catch (err) {
            //  console.log("errooooooooooooooooooooooooooooooooor")
        }
    }
    var newRequest = new request({
        reqType: "Maternity Leave",
        sentBy: req.user.id,
        sentTo: hodAcademic.member,
        maternityDoc: maternityDoc,
        startDate: moment(req.body.startDate).format("YYYY-MM-DD"),
        endDate: moment(req.body.endDate).format("YYYY-MM-DD"),
        state: "Pending",
        reason: reason,
        submission_date: new moment().format("YYYY-MM-DD")
    })
    try {
        await newRequest.save()
        res.json("Request successfully submitted.")
    }
    catch (err) {
        res.status(400).json(err)
        // console.log(err)
    }

    //send notification to hod
    const notification = (await StaffMemberModel.findById(hodAcademic.member)).notifications
    const notNew = notification
    notNew[notNew.length] = "You received a new maternity leave request."
    // console.log("notiifaction")
    const staffReplacement = await StaffMemberModel.findByIdAndUpdate(hodAcademic.member, { notifications: notNew })

})

router.post('/compensationLeave', authenticateToken, async (req, res) => {
    //enter absent day he wants to compensate for (req.body.missedDay,req.body.compensatedDay, req.body.reason)
    console.log("in compenstion")
    //check if user is HR
    const staff = await StaffMemberModel.findById(req.user.id)
    const type = staff.staff_type
    if (type == "HR") {
        return res.status(400).json("HR are not permitted to send leave requests.Only academic members are allowed.")
    }
    if (!req.body.missedDay) {
        return res.status(400).json("Must submit the missed day date with the request.")
    }
    if (!req.body.compensatedDay) {
        return res.status(400).json("Must submit the compensation day date with the request.")
    }
    if (req.body.missedDay >= new moment().format("YYYY-MM-DD")) {
        return res.status(400).json("Missed day should have a date that has already passed.")

    }
    if (req.body.compensatedDay >= new moment().format("YYYY-MM-DD")) {
        return res.status(400).json("Compensation day should have a date that has already passed.")

    }
    console.log("missedDay= " + req.body.missedDay)
    console.log("compensation day" + req.body.compensatedDay)

    //--------------------------CHECK WITH MARIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    // if(req.body.compensatedDay<req.body.missedDay){
    //     return res.json("Compensation day should be after missed day!")

    // }
    if (req.body.compensatedDay == req.body.missedDay) {
        return res.status(400).json("Compensation day and missed day cannot have the dame date!")
    }


    //check if he is asking to compensate for a day off or friday
    const day = moment(req.body.missedDay).format('dddd')
    const compensationDay = moment(req.body.compensatedDay).format('dddd')
    const academic = await AcademicStaffModel.findOne({ member: req.user.id })
    // console.log("aca=" +academic)
    const day_off = academic.day_off
    if (day == "Friday") {
        return res.status(400).json("Cannot compensate for Friday.It is already a day off")
    }
    if (day == day_off) {
        return res.status(400).json("Cannot compensate for a day off.")
    }




    //checking that compensation day is in same month as missed day  
    //month starting from 11 to 10th
    var currMonth = moment(req.body.missedDay).format("M");
    var currYear = moment(req.body.missedDay).format("Y");
    var nextMonth = moment(req.body.missedDay).format("M");
    var nextYear = moment(req.body.missedDay).format("Y");
    var currDay = 11;
    var nextDay = 10;
    if (moment(req.body.missedDay).format("D") <= 10) {
        if (currMonth == 1) {
            currMonth = 12
            currYear = parseInt(currYear) - 1
        }
        else {
            nextMonth = parseInt(currMonth) + 1
            nextYear = currYear
        }

    }
    else {

        if (currMonth == 12) {
            nextMonth = 1
            nextYear = parseInt(currYear) + 1
            console.log("currrrr=" + nextYear)
        }
        else {
            nextMonth = parseInt(currMonth) + 1
            console.log("currMonthereeee= " + nextMonth)
            nextYear = currYear
        }
    }

    console.log("currYear= " + currYear + "\n" + "currMonth= " + currMonth + " currDay= " + currDay)
    console.log("nextYear= " + nextYear + "\n" + "nextMonth= " + nextMonth + " nextDay= " + nextDay)
    const end = new moment(nextYear + "-" + nextMonth + "-" + nextDay).format("YYYY-MM-DD")
    const begin = new moment(currYear + "-" + currMonth + "-" + currDay).format("YYYY-MM-DD")
    console.log("begin= " + begin)
    console.log("end= " + end)
    // const check=moment(compensationDay).isBetween(moment(begin).format("YYYY-MM-DD"), moment(end).format("YYYY-MM-DD"));
    const check1 = moment(begin).isSameOrBefore(moment(req.body.compensatedDay))
    const check2 = moment(req.body.compensatedDay).isSameOrBefore(moment(end))
    console.log("for c2= " + moment(req.body.compensatedDay) + " " + moment(end))
    const check3 = !(check1 && check2)
    console.log("c1= " + check1 + " C2= " + check2 + " c3= " + check3)
    if (!(moment(req.body.compensatedDay).format("YYYY-MM-DD") >= begin &&
        moment(req.body.compensatedDay).format("YYYY-MM-DD") <= end))
        return res.status(400).json("Compensation day should be in same month as missed day (*a month start from the 11th to the 10th)")

    ////////////////
    if (compensationDay == "Friday")
        return res.status(400).json("Cannot compensate on Friday!")
    if (compensationDay != day_off)
        return res.status(400).json("Compensation day should be a day off.")


    // //check if he actually attended this day_off    WILL ADD IT TO ACCEPT/REJECT COMPENSATION REQUEST
    // const attendace=staff.attendance
    // var attended=false
    // for(var h=0;h<attendance.length;h++){
    //     if(moment(attendance[h].date).format("YYYY-MM-DD")==moment(req.body.compensatedDay).format("YYYY-MM-DD"))
    //         attended=true;
    // }
    // if(attended==false){
    //     return res.json("This compensation day was not attended.")
    // }
    //check is missedDay entered is actually a day which the user attended
    const missedDay = req.body.missedDay
    //const reason=req.body.reason
    const userAttendance = staff.attendance

    var check = false
    for (var i = 0; i < userAttendance.length; i++) {
        if (moment(userAttendance[i].date).format("YYYY-MM-DD") == moment(missedDay).format("YYYY-MM-DD")) {
            return res.status(400).json("You already attended this day.Cannot send a compensation request for it.")
        }
    }

    //check that compensation day is his day off
    if (academic.day_off != moment(req.body.compensatedDay).format("dddd")) {
        console.log("offfffff= " + academic.day_off)
        console.log("comp offfffffffffffff= " + moment(req.body.compensatedDay).format("dddd"))
        return res.status(400).json("This compensation day is not on your day off.")
    }

    const reason = req.body.reason
    if (!reason)
        return res.status(400).json("Must submit a reason for compensation leave request.")

    //create request
    //  const academic=await AcademicStaffModel.findOne({member:req.user.id})
    const departmentID = academic.department
    const departmentRec = await department.findById(departmentID)
    const hodID = departmentRec.HOD
    const hodAcademic = await AcademicStaffModel.findById(hodID)

    //  var reason=''
    //  if(req.body.reason)
    //  reason=req.body.reason
    const doc = await CounterModel.findById('CompensationLeave-');
    if (!doc) {
        // console.log("NOTTTTTTTTTTTTTTTTTT DOCCCCCCCCCC")
        const counterAcademic = new CounterModel({
            _id: 'CompensationLeave-'
        });
        try {
            await counterAcademic.save();
            // console.log("successsssssssssssssssssss")
        }
        catch (err) {
            // console.log("errooooooooooooooooooooooooooooooooor")
        }
    }
    var newRequest = new request({
        reqType: "Compensation Leave",
        sentBy: req.user.id,
        sentTo: hodAcademic.member,
        missedDay: moment(req.body.missedDay),
        state: "Pending",
        reason: reason,
        submission_date: new moment().format("YYYY-MM-DD"),
        compensatedDay: req.body.compensatedDay
    })
    try {
        await newRequest.save()
        res.status(200).json("Request successfully submitted.")
    }
    catch (err) {
        res.json(err)
    }

    //send notification to hod
    const notification = (await StaffMemberModel.findById(hodAcademic.member)).notifications
    const notNew = notification
    notNew[notNew.length] = "You received a new compensation leave request."
    const staffReplacement = await StaffMemberModel.findByIdAndUpdate(hodAcademic.member, { notifications: notNew })


})

router.get('/requestStatus', authenticateToken, async (req, res) => {
    //check if user is HR
    const staff = await StaffMemberModel.findById(req.user.id)
    const type = staff.staff_type
    if (type == "HR") {
        return res.json("HR do not have any leave requests.")
    }

    const sent = await request.find({ sentBy: req.user.id })
    if (sent.length == 0) {
        return res.json("There are no submitted requests to display.")
    }
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType
        var repl = ""
        if (sent[i].replacementStaff)
            repl = (await StaffMemberModel.findById(sent[i].replacementStaff)).id
        if (reqType == "Annual") {
            res.write("Request ID: " + sent[i].requestID + "\n")
            res.write("Request type: " + sent[i].reqType + "\n")
            res.write("Sent to head of department: " + hodName + "\n")
            res.write("Request state: " + sent[i].state + "\n")
            res.write("Slot number: " + sent[i].slotNum + "\n")
            res.write("Slot date: " + sent[i].slotDate + "\n")
            res.write("Slot location: " + sent[i].slotLoc + "\n")
            res.write("Replacement academic staff member: " + repl + "\n")
            res.write("Submission date " + sent[i].submission_date + "\n")
            res.write("\n")
        }
        if (reqType == "Replacement") {
            res.write("Request ID: " + sent[i].requestID + "\n")
            res.write("Request type: " + sent[i].reqType + "\n")
            res.write("Sent to academic staff member: " + hodName + "\n")
            res.write("Request state: " + sent[i].state + "\n")
            res.write("Slot number: " + sent[i].slotNum + "\n")
            res.write("Slot date: " + sent[i].slotDate + "\n")
            res.write("Slot location: " + sent[i].slotLoc + "\n")
            res.write("Submission date " + sent[i].submission_date + "\n")
            res.write("\n")
        }
        if (reqType == "Change Day off") {
            res.write("Request ID: " + sent[i].requestID + "\n")
            res.write("Request type: " + sent[i].reqType + "\n"),
                res.write("Sent to head of department: " + hodName + "\n")
            res.write("Request state: " + sent[i].state + "\n")
            res.write("New DayOff: " + sent[i].newDayOff + "\n")
            res.write("Reason: " + sent[i].reason + "\n")
            res.write("Submission date: " + sent[i].submission_date + "\n")
            res.write("\n")
        }
        if (reqType == "Accidental Leave") {
            res.write("Request ID: " + sent[i].requestID + "\n")
            res.write("Request type: " + sent[i].reqType + "\n"),
                res.write("Sent to head of department: " + hodName + "\n")
            res.write("Request state: " + sent[i].state + "\n")
            res.write("Accident Date " + sent[i].accidentDate + "\n")
            res.write("Reason: " + sent[i].reason + "\n")
            res.write("Submission date: " + sent[i].submission_date + "\n")
            res.write("\n")
        }
        if (reqType == "Sick Leave") {
            res.write("Request ID: " + sent[i].requestID + "\n")
            res.write("Request type: " + sent[i].reqType + "\n"),
                res.write("Sent to head of department: " + hodName + "\n")
            res.write("Request state: " + sent[i].state + "\n")
            res.write("Sick Day: " + sent[i].sickDay + "\n")
            res.write("Reason: " + sent[i].reason + "\n")
            res.write("Submission date: " + sent[i].submission_date + "\n")
            res.write("\n")
        }
        if (reqType == "Maternity Leave") {
            res.write("Request ID: " + sent[i].requestID + "\n")
            res.write("Request type: " + sent[i].reqType + "\n"),
                res.write("Sent to head of department: " + hodName + "\n")
            res.write("Request state: " + sent[i].state + "\n")
            res.write("Reason: " + sent[i].reason + "\n")
            res.write("Submission date: " + sent[i].submission_date + "\n")
            res.write("\n")
        }
        if (reqType == "Compensation Leave") {
            res.write("Request ID: " + sent[i].requestID + "\n")
            res.write("Request type: " + sent[i].reqType + "\n"),
                res.write("Sent to head of department: " + hodName + "\n")
            res.write("Request state: " + sent[i].state + "\n")
            res.write("Missed Day: " + sent[i].missedDay + "\n")
            res.write("Reason: " + sent[i].reason + "\n")
            res.write("Submission date: " + sent[i].submission_date + "\n")
            res.write("\n")
        }
        if (reqType == "Slot Linking") {
            const coordinatorID = sent[i].sentTo
            const coordinator = await StaffMemberModel.findById(coordinatorID)
            const coordinatorName = coordinator.name
            res.write("Request ID: " + sent[i].requestID + "\n")
            res.write("Request type: " + sent[i].reqType + "\n"),
                res.write("Sent to course coordinator: " + coordinatorName + "\n")
            res.write("Request state: " + sent[i].state + "\n")
            res.write("Slot Day: " + sent[i].slotDay + "\n")
            res.write("Slot Number: " + sent[i].slotNum + "\n")
            res.write("Course ID: " + sent[i].courseID + "\n")
            res.write("Reason: " + sent[i].reason + "\n")
            res.write("Submission date: " + sent[i].submission_date + "\n")
            res.write("\n")
        }
    }
    res.end();
})

//sent requests that got accepted
router.get('/acceptedRequests', authenticateToken, async (req, res) => {
    const staff = await StaffMemberModel.findById(req.user.id)
    const type = staff.staff_type
    if (type == "HR") {
        return res.json("HR do not have any leave requests.")
    }
    var sent1 = await request.find({ sentBy: req.user.id, state: "Accepted" })
    const received = await request.find({ sentTo: req.user.id, state: "Accepted" })
    sent = [...sent1, ...received];
    // console.log("sent= "+sent)
    // console.log("sent= "+sent)
    var arr = []
    var k = 0
    if (sent.length == 0) {
        return res.json(arr)
    }

    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType

        //replacement
        // const academicMemberID=sent[i].sentTo
        // const academicMember=await StaffMemberModel.findById(academicMemberID)
        // const coordinatorName=coordinator.name
        var repl = ""
        if (sent[i].replacementStaff)
            repl = (await StaffMemberModel.findById(sent[i].replacementStaff)).id
        if (reqType == "Annual") {
            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: hodName, state: sent[i].state, slotNum: sent[i].slotNum, slotDate: sent[i].slotDate,
                slotLoc: sent[i].slotLoc, replacementStaff: repl, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
            }
            arr[k++] = reqNew
        }
        if (reqType == "Replacement") {
            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: hodName, state: sent[i].state, slotNum: sent[i].slotNum, slotDate: sent[i].slotDate,
                slotLoc: sent[i].slotLoc, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
            }
            arr[k++] = reqNew
        }
        if (reqType == "Change Day off") {
            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: hodName, state: sent[i].state, newDayOff: sent[i].newDayOff,
                reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
            }
            arr[k++] = reqNew
        }
        if (reqType == "Accidental Leave") {
            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: hodName, state: sent[i].state, accidentDate: sent[i].accidentDate,
                reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
            }
            arr[k++] = reqNew

        }
        if (reqType == "Sick Leave") {
            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: hodName, state: sent[i].state,
                sickDay: sent[i].sickDay, medicalDoc: sent[i].medicalDoc,
                reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
            }
            arr[k++] = reqNew

        }
        if (reqType == "Maternity Leave") {
            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: hodName, state: sent[i].state, maternityDoc: sent[i].maternityDoc,
                reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
            }
            arr[k++] = reqNew
        }
        if (reqType == "Maternity Leave") {
            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: hodName, state: sent[i].state, maternityDoc: sent[i].maternityDoc,
                reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
            }
            arr[k++] = reqNew
        }
        if (reqType == "Slot Linking") {
            const coordinatorID = sent[i].sentTo
            const coordinator = await StaffMemberModel.findById(coordinatorID)
            const coordinatorName = coordinator.name
            res.write("Request ID: " + sent[i].requestID + "\n")

            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: coordinatorName, state: sent[i].state, slotDay: sent[i].slotDay,
                slotNum: sent[i].slotNum, courseID: sent[i].courseID,
                reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
            }
            arr[k++] = reqNew
        }
    }
    res.json(arr);
})

//received requests that got accepted
router.get('/acceptedReceivedRequests', authenticateToken, async (req, res) => {
    const staff = await StaffMemberModel.findById(req.user.id)
    const type = staff.staff_type
    if (type == "HR") {
        return res.json("HR do not have any leave requests.")
    }
    const sent = await request.find({ sentTo: req.user.id, state: "Accepted" })
    // console.log("sent= "+sent)
    if (sent.length == 0) {
        return res.json("There are no received accepted requests to display.")
    }
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType
        var repl = ""
        if (sent[i].replacementStaff)
            repl = (await StaffMemberModel.findById(sent[i].replacementStaff)).id
        if (reqType == "Annual") {
            res.write("Request ID: " + sent[i].requestID + "\n")
            res.write("Request type: " + sent[i].reqType + "\n")
            res.write("Sent to head of department: " + hodName + "\n")
            res.write("Request state: " + sent[i].state + "\n")
            res.write("Slot number: " + sent[i].slotNum + "\n")
            res.write("Slot date: " + sent[i].slotDate + "\n")
            res.write("Slot location: " + sent[i].slotLoc + "\n")
            res.write("Replacement academic staff member: " + repl + "\n")
            res.write("Submission date " + sent[i].submission_date + "\n")
            res.write("\n")
        }

        if (reqType == "Replacement") {
            res.write("Request ID: " + sent[i].requestID + "\n")
            res.write("Request type: " + sent[i].reqType + "\n")
            res.write("Sent to academic staff member: " + hodName + "\n")
            res.write("Request state: " + sent[i].state + "\n")
            res.write("Slot number: " + sent[i].slotNum + "\n")
            res.write("Slot date: " + sent[i].slotDate + "\n")
            res.write("Slot location: " + sent[i].slotLoc + "\n")
            res.write("Submission date " + sent[i].submission_date + "\n")
            res.write("\n")
        }
        if (reqType == "Change Day off") {
            res.write("Request ID: " + sent[i].requestID + "\n")
            res.write("Request type: " + sent[i].reqType + "\n"),
                res.write("Sent to head of department: " + hodName + "\n")
            res.write("Request state: " + sent[i].state + "\n")
            res.write("New DayOff " + sent[i].newDayOff + "\n")
            res.write("Reason " + sent[i].reason + "\n")
            res.write("Submission date " + sent[i].submission_date + "\n")
            res.write("\n")
        }
        if (reqType == "Accidental Leave") {
            res.write("Request ID: " + sent[i].requestID + "\n")
            res.write("Request type: " + sent[i].reqType + "\n"),
                res.write("Sent to head of department: " + hodName + "\n")
            res.write("Request state: " + sent[i].state + "\n")
            res.write("Accident Date " + sent[i].accidentDate + "\n")
            res.write("Reason " + sent[i].reason + "\n")
            res.write("Submission date " + sent[i].submission_date + "\n")
            res.write("\n")
        }
        if (reqType == "Sick Leave") {
            res.write("Request ID: " + sent[i].requestID + "\n")
            res.write("Request type: " + sent[i].reqType + "\n"),
                res.write("Sent to head of department: " + hodName + "\n")
            res.write("Request state: " + sent[i].state + "\n")
            res.write("Sick Day: " + sent[i].sickDay + "\n")
            res.write("Reason " + sent[i].reason + "\n")
            res.write("Submission date " + sent[i].submission_date + "\n")
            res.write("\n")
        }
        if (reqType == "Maternity Leave") {
            res.write("Request ID: " + sent[i].requestID + "\n")
            res.write("Request type: " + sent[i].reqType + "\n"),
                res.write("Sent to head of department: " + hodName + "\n")
            res.write("Request state: " + sent[i].state + "\n")
            res.write("Reason " + sent[i].reason + "\n")
            res.write("Submission date " + sent[i].submission_date + "\n")
            res.write("\n")
        }
        if (reqType == "Compensation Leave") {
            res.write("Request ID: " + sent[i].requestID + "\n")
            res.write("Request type: " + sent[i].reqType + "\n"),
                res.write("Sent to head of department: " + hodName + "\n")
            res.write("Request state: " + sent[i].state + "\n")
            res.write("Missed Day: " + sent[i].missedDay + "\n")
            res.write("Reason " + sent[i].reason + "\n")
            res.write("Submission date " + sent[i].submission_date + "\n")
            res.write("\n")
        }
        if (reqType == "Slot Linking") {
            const coordinatorID = sent[i].sentTo
            const coordinator = await StaffMemberModel.findById(coordinatorID)
            const coordinatorName = coordinator.name
            res.write("Request ID: " + sent[i].requestID + "\n")
            res.write("Request type: " + sent[i].reqType + "\n"),
                res.write("Sent to course coordinator: " + coordinatorName + "\n")
            res.write("Request state: " + sent[i].state + "\n")
            res.write("Slot Day: " + sent[i].slotDay + "\n")
            res.write("Slot Number: " + sent[i].slotNum + "\n")
            res.write("Course ID: " + sent[i].courseID + "\n")
            res.write("Reason: " + sent[i].reason + "\n")
            res.write("Submission date: " + sent[i].submission_date + "\n")
            res.write("\n")
        }
    }
    res.end();
})


//sent requests that are pending
router.get('/pendingRequests', authenticateToken, async (req, res) => {
    const staff = await StaffMemberModel.findById(req.user.id)
    const type = staff.staff_type
    if (type == "HR") {
        return res.json("HR do not have any leave requests.")
    }
    const sent1 = await request.find({ sentBy: req.user.id, state: "Pending" })
    const received = await request.find({ sentTo: req.user.id, state: "Pending" })
    const sent = [...sent1, ...received];
    // console.log("sent= "+sent)
    var arr = []
    var k = 0
    if (sent.length == 0) {
        return res.json(arr)
    }

    //////////////////////
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType

        //replacement
        // const academicMemberID=sent[i].sentTo
        // const academicMember=await StaffMemberModel.findById(academicMemberID)
        // const coordinatorName=coordinator.name
        var repl = ""
        if (sent[i].replacementStaff)
            repl = (await StaffMemberModel.findById(sent[i].replacementStaff)).id
        if (reqType == "Annual") {
            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: hodName, state: sent[i].state, slotNum: sent[i].slotNum, slotDate: sent[i].slotDate,
                slotLoc: sent[i].slotLoc, replacementStaff: repl, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
            }
            arr[k++] = reqNew
        }
        if (reqType == "Replacement") {
            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: hodName, state: sent[i].state, slotNum: sent[i].slotNum, slotDate: sent[i].slotDate,
                slotLoc: sent[i].slotLoc, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
            }
            arr[k++] = reqNew
        }
        if (reqType == "Change Day off") {
            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: hodName, state: sent[i].state, newDayOff: sent[i].newDayOff,
                reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
            }
            arr[k++] = reqNew
        }
        if (reqType == "Accidental Leave") {
            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: hodName, state: sent[i].state, accidentDate: sent[i].accidentDate,
                reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
            }
            arr[k++] = reqNew

        }
        if (reqType == "Sick Leave") {
            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: hodName, state: sent[i].state,
                sickDay: sent[i].sickDay, medicalDoc: sent[i].medicalDoc,
                reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
            }
            arr[k++] = reqNew

        }
        if (reqType == "Maternity Leave") {
            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: hodName, state: sent[i].state, maternityDoc: sent[i].maternityDoc,
                reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
            }
            arr[k++] = reqNew
        }
        if (reqType == "Compensation Leave") {
            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: hodName, state: sent[i].state, missedDay: sent[i].missedDay,
                reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
            }
            arr[k++] = reqNew
        }
        if (reqType == "Slot Linking") {
            const coordinatorID = sent[i].sentTo
            const coordinator = await StaffMemberModel.findById(coordinatorID)
            const coordinatorName = coordinator.name
            res.write("Request ID: " + sent[i].requestID + "\n")

            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: coordinatorName, state: sent[i].state, slotDay: sent[i].slotDay,
                slotNum: sent[i].slotNum, courseID: sent[i].courseID,
                reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
            }
            arr[k++] = reqNew
        }
    }
    res.json(arr);

    //////////////////////////////

})
//received requests that are pending
router.get('/pendingReceivedRequests', authenticateToken, async (req, res) => {
    const staff = await StaffMemberModel.findById(req.user.id)
    const type = staff.staff_type
    if (type == "HR") {
        return res.json("HR do not have any leave requests.")
    }
    const sent = await request.find({ sentTo: req.user.id, state: "Pending" })
    if (sent.length == 0) {
        return res.json("There are no pending requests to display.")
    }
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType
        var repl = ""
        if (sent[i].replacementStaff)
            repl = (await StaffMemberModel.findById(sent[i].replacementStaff)).id
        if (reqType == "Annual") {
            res.write("Request ID: " + sent[i].requestID + "\n")
            res.write("Request type: " + sent[i].reqType + "\n")
            res.write("Sent to head of department: " + hodName + "\n")
            res.write("Request state: " + sent[i].state + "\n")
            res.write("Slot number: " + sent[i].slotNum + "\n")
            res.write("Slot date: " + sent[i].slotDate + "\n")
            res.write("Slot location: " + sent[i].slotLoc + "\n")
            res.write("Replacement academic staff member: " + repl + "\n")
            res.write("Submission date " + sent[i].submission_date + "\n")
            res.write("\n")
        }
        if (reqType == "Replacement") {
            res.write("Request ID: " + sent[i].requestID + "\n")
            res.write("Request type: " + sent[i].reqType + "\n")
            res.write("Sent to academic staff member: " + hodName + "\n")
            res.write("Request state: " + sent[i].state + "\n")
            res.write("Slot number: " + sent[i].slotNum + "\n")
            res.write("Slot date: " + sent[i].slotDate + "\n")
            res.write("Slot location: " + sent[i].slotLoc + "\n")
            res.write("Submission date " + sent[i].submission_date + "\n")
            res.write("\n")
        }
        if (reqType == "Change Day off") {
            res.write("Request ID: " + sent[i].requestID + "\n")
            res.write("Request type: " + sent[i].reqType + "\n"),
                res.write("Sent to head of department: " + hodName + "\n")
            res.write("Request state: " + sent[i].state + "\n")
            res.write("New DayOff " + sent[i].newDayOff + "\n")
            res.write("Reason " + sent[i].reason + "\n")
            res.write("Submission date " + sent[i].submission_date + "\n")
            res.write("\n")
        }
        if (reqType == "Accidental Leave") {
            res.write("Request ID: " + sent[i].requestID + "\n")
            res.write("Request type: " + sent[i].reqType + "\n"),
                res.write("Sent to head of department: " + hodName + "\n")
            res.write("Request state: " + sent[i].state + "\n")
            res.write("Accident Date " + sent[i].accidentDate + "\n")
            res.write("Reason " + sent[i].reason + "\n")
            res.write("Submission date " + sent[i].submission_date + "\n")
            res.write("\n")
        }
        if (reqType == "Sick Leave") {
            res.write("Request ID: " + sent[i].requestID + "\n")
            res.write("Request type: " + sent[i].reqType + "\n"),
                res.write("Sent to head of department: " + hodName + "\n")
            res.write("Request state: " + sent[i].state + "\n")
            res.write("Sick Day: " + sent[i].sickDay + "\n")
            res.write("Reason " + sent[i].reason + "\n")
            res.write("Submission date " + sent[i].submission_date + "\n")
            res.write("\n")
        }
        if (reqType == "Maternity Leave") {
            res.write("Request ID: " + sent[i].requestID + "\n")
            res.write("Request type: " + sent[i].reqType + "\n"),
                res.write("Sent to head of department: " + hodName + "\n")
            res.write("Request state: " + sent[i].state + "\n")
            res.write("Reason " + sent[i].reason + "\n")
            res.write("Submission date " + sent[i].submission_date + "\n")
            res.write("\n")
        }
        if (reqType == "Compensation Leave") {
            res.write("Request ID: " + sent[i].requestID + "\n")
            res.write("Request type: " + sent[i].reqType + "\n"),
                res.write("Sent to head of department: " + hodName + "\n")
            res.write("Request state: " + sent[i].state + "\n")
            res.write("Missed Day: " + sent[i].missedDay + "\n")
            res.write("Reason " + sent[i].reason + "\n")
            res.write("Submission date " + sent[i].submission_date + "\n")
            res.write("\n")
        }
        if (reqType == "Slot Linking") {
            const coordinatorID = sent[i].sentTo
            const coordinator = await StaffMemberModel.findById(coordinatorID)
            const coordinatorName = coordinator.name
            res.write("Request ID: " + sent[i].requestID + "\n")
            res.write("Request type: " + sent[i].reqType + "\n"),
                res.write("Sent to course coordinator: " + coordinatorName + "\n")
            res.write("Request state: " + sent[i].state + "\n")
            res.write("Slot Day: " + sent[i].slotDay + "\n")
            res.write("Slot Number: " + sent[i].slotNum + "\n")
            res.write("Course ID: " + sent[i].courseID + "\n")
            res.write("Reason: " + sent[i].reason + "\n")
            res.write("Submission date: " + sent[i].submission_date + "\n")
            res.write("\n")
        }
    }
    res.end();
})


//sent requests that are rejected
router.get('/rejectedRequests', authenticateToken, async (req, res) => {
    const staff = await StaffMemberModel.findById(req.user.id)
    const type = staff.staff_type
    if (type == "HR") {
        return res.json("HR do not have any leave requests.")
    }
    const sent1 = await request.find({ sentBy: req.user.id, state: "Rejected" })
    const received = await request.find({ sentTo: req.user.id, state: "Rejected" })
    const sent = [...sent1, ...received];
    // console.log("sent= "+sent)

    var arr = []
    var k = 0
    if (sent.length == 0) {
        return res.json(arr)
    }
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType

        //replacement
        // const academicMemberID=sent[i].sentTo
        // const academicMember=await StaffMemberModel.findById(academicMemberID)
        // const coordinatorName=coordinator.name
        var repl = ""
        if (sent[i].replacementStaff)
            repl = (await StaffMemberModel.findById(sent[i].replacementStaff)).id
        if (reqType == "Annual") {
            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: hodName, state: sent[i].state, slotNum: sent[i].slotNum, slotDate: sent[i].slotDate,
                slotLoc: sent[i].slotLoc, replacementStaff: repl, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
            }
            arr[k++] = reqNew
        }
        if (reqType == "Replacement") {
            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: hodName, state: sent[i].state, slotNum: sent[i].slotNum, slotDate: sent[i].slotDate,
                slotLoc: sent[i].slotLoc, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
            }
            arr[k++] = reqNew
        }
        if (reqType == "Change Day off") {
            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: hodName, state: sent[i].state, newDayOff: sent[i].newDayOff,
                reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
            }
            arr[k++] = reqNew
        }
        if (reqType == "Accidental Leave") {
            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: hodName, state: sent[i].state, accidentDate: sent[i].accidentDate,
                reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
            }
            arr[k++] = reqNew

        }
        if (reqType == "Sick Leave") {
            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: hodName, state: sent[i].state,
                sickDay: sent[i].sickDay, medicalDoc: sent[i].medicalDoc,
                reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
            }
            arr[k++] = reqNew

        }
        if (reqType == "Maternity Leave") {
            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: hodName, state: sent[i].state, maternityDoc: sent[i].maternityDoc,
                reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
            }
            arr[k++] = reqNew
        }
        if (reqType == "Compensation Leave") {
            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: hodName, state: sent[i].state, missedDay: sent[i].missedDay,
                reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
            }
            arr[k++] = reqNew
        }
        if (reqType == "Slot Linking") {
            const coordinatorID = sent[i].sentTo
            const coordinator = await StaffMemberModel.findById(coordinatorID)
            const coordinatorName = coordinator.name
            res.write("Request ID: " + sent[i].requestID + "\n")

            const reqNew = {
                counter: k + 1, requestID: sent[i].requestID, reqType: sent[i].reqType,
                sentTo: coordinatorName, state: sent[i].state, slotDay: sent[i].slotDay,
                slotNum: sent[i].slotNum, courseID: sent[i].courseID,
                reason: sent[i].reason, submission_date: moment(sent[i].submission_date).format("YYYY-MM-DD")
            }
            arr[k++] = reqNew
        }
    }
    res.json(arr);
})

//received requests that are rejected
router.get('/rejectedReceivedRequests', authenticateToken, async (req, res) => {
    const staff = await StaffMemberModel.findById(req.user.id)
    const type = staff.staff_type
    if (type == "HR") {
        return res.json("HR do not have any leave requests.")
    }
    const sent = await request.find({ sentTo: req.user.id, state: "Rejected" })
    if (sent.length == 0) {
        return res.json("There are no rejected requests to display.")
    }
    for (var i = 0; i < sent.length; i++) {
        const hodID = sent[i].sentTo
        const hod = await StaffMemberModel.findById(hodID)
        const hodName = hod.name
        const type = sent[i].type
        var reqType = sent[i].reqType
        var repl = ""
        if (sent[i].replacementStaff)
            repl = (await StaffMemberModel.findById(sent[i].replacementStaff)).id
        if (reqType == "Annual") {
            res.write("Request ID: " + sent[i].requestID + "\n")
            res.write("Request type: " + sent[i].reqType + "\n")
            res.write("Sent to head of department: " + hodName + "\n")
            res.write("Request state: " + sent[i].state + "\n")
            res.write("Slot number: " + sent[i].slotNum + "\n")
            res.write("Slot date: " + sent[i].slotDate + "\n")
            res.write("Slot location: " + sent[i].slotLoc + "\n")
            res.write("Replacement academic staff member: " + repl + "\n")
            res.write("Submission date " + sent[i].submission_date + "\n")
            res.write("\n")
        }
        if (reqType == "Replacement") {
            res.write("Request ID: " + sent[i].requestID + "\n")
            res.write("Request type: " + sent[i].reqType + "\n")
            res.write("Sent to academic staff member: " + hodName + "\n")
            res.write("Request state: " + sent[i].state + "\n")
            res.write("Slot number: " + sent[i].slotNum + "\n")
            res.write("Slot date: " + sent[i].slotDate + "\n")
            res.write("Slot location: " + sent[i].slotLoc + "\n")
            res.write("Submission date " + sent[i].submission_date + "\n")
            res.write("\n")
        }
        if (reqType == "Change Day off") {
            res.write("Request ID: " + sent[i].requestID + "\n")
            res.write("Request type: " + sent[i].reqType + "\n"),
                res.write("Sent to head of department: " + hodName + "\n")
            res.write("Request state: " + sent[i].state + "\n")
            res.write("New DayOff " + sent[i].newDayOff + "\n")
            res.write("Reason " + sent[i].reason + "\n")
            res.write("Submission date " + sent[i].submission_date + "\n")
            res.write("\n")
        }
        if (reqType == "Accidental Leave") {
            res.write("Request ID: " + sent[i].requestID + "\n")
            res.write("Request type: " + sent[i].reqType + "\n"),
                res.write("Sent to head of department: " + hodName + "\n")
            res.write("Request state: " + sent[i].state + "\n")
            res.write("Accident Date " + sent[i].accidentDate + "\n")
            res.write("Reason " + sent[i].reason + "\n")
            res.write("Submission date " + sent[i].submission_date + "\n")
            res.write("\n")
        }
        if (reqType == "Sick Leave") {
            res.write("Request ID: " + sent[i].requestID + "\n")
            res.write("Request type: " + sent[i].reqType + "\n"),
                res.write("Sent to head of department: " + hodName + "\n")
            res.write("Request state: " + sent[i].state + "\n")
            res.write("Sick Day: " + sent[i].sickDay + "\n")
            res.write("Reason " + sent[i].reason + "\n")
            res.write("Submission date " + sent[i].submission_date + "\n")
            res.write("\n")
        }
        if (reqType == "Maternity Leave") {
            res.write("Request ID: " + sent[i].requestID + "\n")
            res.write("Request type: " + sent[i].reqType + "\n"),
                res.write("Sent to head of department: " + hodName + "\n")
            res.write("Request state: " + sent[i].state + "\n")
            res.write("Reason " + sent[i].reason + "\n")
            res.write("Submission date " + sent[i].submission_date + "\n")
            res.write("\n")
        }
        if (reqType == "Compensation Leave") {
            res.write("Request ID: " + sent[i].requestID + "\n")
            res.write("Request type: " + sent[i].reqType + "\n"),
                res.write("Sent to head of department: " + hodName + "\n")
            res.write("Request state: " + sent[i].state + "\n")
            res.write("Missed Day: " + sent[i].missedDay + "\n")
            res.write("Reason " + sent[i].reason + "\n")
            res.write("Submission date " + sent[i].submission_date + "\n")
            res.write("\n")
        }
        if (reqType == "Slot Linking") {
            const coordinatorID = sent[i].sentTo
            const coordinator = await StaffMemberModel.findById(coordinatorID)
            const coordinatorName = coordinator.name
            res.write("Request ID: " + sent[i].requestID + "\n")
            res.write("Request type: " + sent[i].reqType + "\n"),
                res.write("Sent to course coordinator: " + coordinatorName + "\n")
            res.write("Request state: " + sent[i].state + "\n")
            res.write("Slot Day: " + sent[i].slotDay + "\n")
            res.write("Slot Number: " + sent[i].slotNum + "\n")
            res.write("Course ID: " + sent[i].courseID + "\n")
            res.write("Reason: " + sent[i].reason + "\n")
            res.write("Submission date: " + sent[i].submission_date + "\n")
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

router.put('/acceptReplacementRequest', authenticateToken, async (req, res) => {
    //input will be sender type,submission date,sentBy (email or can change to normal id ,requestID)
    const requestID = req.body.requestID
    userAcademic = await AcademicStaffModel.findOne({ member: req.user.id })
    if (!userAcademic) return res.status(401).send('You are not an academic member!');

    //check if this request actually exists
    const currRequest = await request.findOne({ requestID: req.body.requestID })
    // console.log("currRes= "+currRequest)
    if (!currRequest) {
        return res.json("This request does not exist. Please enter correct request ID")
    }
    //check if this person is the sender of this request
    if (!currRequest.sentTo.equals(req.user.id))
        return res.status(401).send('This request was not sent to you.Cannot accept or reject.');
    if (currRequest.state == "Accepted") {
        return res.json("This request has already been accepted before.")
    }

    // const sentBy=(await StaffMemberModel.findOne({email:sentByEmail}))._id
    const reqType = currRequest.reqType
    const submission_date = currRequest.submission_date
    const sentBy = currRequest.sentBy
    const slotNum = currRequest.slotNum
    const slotDate = currRequest.slotDate
    const slotLoc = currRequest.slotLoc


    // const reqID=currRequest._id
    const reqUpdated = await request.findOneAndUpdate({ requestID: requestID }, { state: "Accepted" })

    //delete other requests sent to other academic members since one is already accepted
    const otherRepReq = await request.find({
        reqType: reqType, submission_date: submission_date, sentBy: sentBy,
        slotNum: slotNum, slotDate: slotDate, slotLoc: slotLoc
    })
    for (var i = 0; i < otherRepReq.length; i++) {
        if (otherRepReq[i].sentTo != req.user.id) {
            const delID = otherRepReq[i]._id
            const delReq = await request.findByIdAndDelete(delID)
        }
    }

    return res.json("Request successfully accepted.")


})

router.put('/rejectReplacementRequest', authenticateToken, async (req, res) => {
    //input will be sender type,submission date,sentBy (email or can change to normal id ,requestID)
    const requestID = req.body.requestID
    userAcademic = await AcademicStaffModel.findOne({ member: req.user.id })
    if (!userAcademic) return res.status(401).send('You are not an academic member!');

    //check if this request actually exists
    const currRequest = await request.findOne({ requestID: req.body.requestID })
    // console.log("currRes= "+currRequest)
    if (!currRequest) {
        return res.json("This request does not exist. Please enter correct request ID")
    }
    //check if this person is the sender of this request
    if (!currRequest.sentTo.equals(req.user.id))
        return res.status(401).send('This request was not sent to you.Cannot accept or reject.');
    if (currRequest.state == "Rejected") {
        return res.json("This request has already been rejected before.")
    }

    // const sentBy=(await StaffMemberModel.findOne({email:sentByEmail}))._id
    const reqType = currRequest.reqType
    const submission_date = currRequest.submission_date
    const sentBy = currRequest.sentBy
    const slotNum = currRequest.slotNum
    const slotDate = currRequest.slotDate
    const slotLoc = currRequest.slotLoc


    // const reqID=currRequest._id
    const reqUpdated = await request.findOneAndUpdate({ requestID: requestID }, { state: "Rejected" })

    //delete other requests sent to other academic members since one is already accepted
    const otherRepReq = await request.find({
        reqType: reqType, submission_date: submission_date, sentBy: sentBy,
        slotNum: slotNum, slotDate: slotDate, slotLoc: slotLoc
    })
    for (var i = 0; i < otherRepReq.length; i++) {
        if (otherRepReq[i].sentTo != req.user.id) {
            const delID = otherRepReq[i]._id
            const delReq = await request.findByIdAndDelete(delID)
        }
    }

    return res.json("Request successfully rejected.")


})



//-----------------------------------MARIA CANCEL REQUESTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT
//MARIAAAAAAAAAAAAAAAAAAAAAAAAAAA REJECT
router.get('/viewScheduleAllSemester', authenticateToken, async (req, res) => {
    const userAcademic = await AcademicStaffModel.findOne({ member: req.user.id });

    if (!userAcademic) return res.status(401).send('You are not an academic member!');
    const schedule = userAcademic.schedule;
    const normalSlots = [];
    const replacementSlots = [];

    for (let index = 0; index < schedule.length; index++) {
        const slot = schedule[index];
        const courseTemp = await Course.findById(slot.course);
        const locationTemp = await location.findById(slot.location);
        const returnedSlot = {
            day: slot.day,
            locationID: locationTemp.id,
            courseID: courseTemp.id,
            date: moment(slot.date).format('YYYY-MM-DD'),
            number: slot.number
        }
        if (slot.isReplaced) replacementSlots.push(returnedSlot);
        else normalSlots.push(returnedSlot);
    }
    const returnObject = {
        replacementSlots: replacementSlots,
        normalSlots: normalSlots
    }
    return res.status(200).json(returnObject);
});

router.get('/viewScheduleThisWeek', authenticateToken, async (req, res) => {
    const userAcademic = await AcademicStaffModel.findOne({ member: req.user.id });

    if (!userAcademic) return res.status(401).send('You are not an academic member!');
    const schedule = userAcademic.schedule;
    const normalSlots = [];
    const replacementSlots = [];

    for (let index = 0; index < schedule.length; index++) {
        const slot = schedule[index];
        var flag = false;
        for (let i = 1; i < 8; i++) {
            const diff = moment().add(i, "days").format('YYYY-MM-DD');
            if (moment(slot.date).format('YYYY-MM-DD').toString() == diff.toString()) {
                flag = true;
                break;
            }
        }
        if (flag) {
            const courseTemp = await Course.findById(slot.course);
            const locationTemp = await location.findById(slot.location);
            const returnedSlot = {
                day: slot.day,
                locationID: locationTemp.id,
                courseID: courseTemp.id,
                date: moment(slot.date).format('YYYY-MM-DD'),
                number: slot.number
            }
            if (slot.isReplaced) replacementSlots.push(returnedSlot);
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
    console.log("cancel req id= " + req.body.requestID);
    console.log("req.user.id= " + req.user.id)
    const userAcademic = await AcademicStaffModel.findOne({ member: req.user.id });

    if (!userAcademic) return res.status(401).send('You are not an academic member!');
    const { requestID } = req.body;
    console.log("reqID" + requestID)
    const currRequest = await request.findOne({ requestID: requestID });
    if (!currRequest) {
        console.log("not found")
        return res.status(400).send('Request not found!');
    }

    if (!currRequest.sentBy.equals(req.user.id))
        return res.status(401).send('You are not the one who sent this request!');

    if (currRequest.reqType != 'Replacement' && currRequest.reqType != 'Annual Leave') {
        if (currRequest.state != 'Pending') {
            console.log("req not pending")
            return res.status(400).send('Cannot cancel a non-pending request!');
        }
        else {
            await request.findOneAndDelete({ requestID: requestID });
            return res.status(200).send('Request cancelled successfully!');
        }
    }
    else {
        if (moment(currRequest.slotDate).format('YYYY-MM-DD').toString() <= moment().format('YYYY-MM-DD').toString()) return res.status(400).send('Cannot cancel a replacement/annual request whose target day has passed!');
        else {
            if (currRequest.reqType == 'Annual Leave' && currRequest.state == 'Accepted') {
                const sentToAcademic = await AcademicStaffModel.findOne({ member: currRequest.replacementStaff });
                const location = await location.findOne({ id: currRequest.slotLoc });

                var position = -1;
                sentToAcademic.schedule.some(function (assignedSlot, ind) {
                    var flag = assignedSlot.number == currRequest.slotNum
                        && assignedSlot.location.equals(location._id)
                        && moment(assignedSlot.date).format('YYYY-MM-DD').toString() == moment(currRequest.slotDate).format('YYYY-MM-DD').toString();

                    if (flag) {
                        position = ind;
                        return flag;
                    }
                });

                // console.log(position);
                const slot = sentToAcademic.schedule[position];
                sentToAcademic.schedule.splice(position, 1);
                await sentToAcademic.save();

                slot.isReplaced = false;

                userAcademic.schedule.push(slot);
                await userAcademic.save();

                const courses = await Course.find({});
                for (let i = 0; i < courses.length; i++) {
                    const course = courses[i];

                    var pos = - 1;
                    var SlotExists = course.schedule.some(function (courseSlot, ind) {
                        var flag = moment(courseSlot.date).format('YYYY-MM-DD').toString() == moment(currRequest.slotDate).format('YYYY-MM-DD').toString()
                            && courseSlot.number == slot.number
                            && courseSlot.location.equals(slot.location);

                        if (flag) {
                            pos = ind;
                            return flag;
                        }
                    });

                    if (SlotExists) {
                        course.schedule[pos].isReplaced = false;
                        course.academic_member_id = userAcademic._id;
                        await course.save();
                    }
                }
            }
            await request.findOneAndDelete({ requestID: requestID });
            return res.status(200).send('Request deleted successfully!');
        }
    }
});

router.post('/annualLeave', authenticateToken, async (req, res) => {
    //input is slotDate
    const staff = await StaffMemberModel.findById(req.user.id)
    if (staff.staff_type == "HR") {
        return res.json("HR not permitted to send requests!")
    }
    console.log("in annual leave" + req.body.slotDate)
    const userAcademic = await AcademicStaffModel.findOne({ member: req.user.id });

    const currDepartment = await department.findById(userAcademic.department);

    const HODAcademicModel = await AcademicStaffModel.findById(currDepartment.HOD);
    const HODStaffModel = await StaffMemberModel.findById(HODAcademicModel.member);
    console.log("hod nameeeeeeeeeeeeeeeeeeeeeeeee= " + HODStaffModel.name)

    if (req.body.slotDate <= new moment().format("YYYY-MM-DD")) {
        console.log("slotDte= " + req.body.slotDate)
        return res.status(400).json("Must submit a request for a date that is yet to come!")
    }
    if (moment(req.body.slotDate).format("dddd") == "Friday")
        return res.status(400).json("Friday is already your day off!")
    const day_off = userAcademic.day_off
    if (moment(req.body.slotDate).format("dddd") == day_off)
        return res.status(400).json("This is already your day off!")

    if (req.body.slotDate < new moment().format("YYYY-MM-DD")) {

        return res.status(400).json("Day Off must be a date that is yet to come!")
    }

    //get slotDate and user's schedule to get slots on this day
    const slotDate = req.body.slotDate;
    const userSchedule = userAcademic.schedule
    var acceptedRequests = new Array()
    var l = 0;
    const requestsSameSlot = new Array()
    var n = 0

    var allReplacementRequest = [];
    var m = 0;
    // console.log("sched= "+userSchedule)
    for (var k = 0; k < userSchedule.length; k++) {
        if (moment(userSchedule[k].date).format("YYYY-MM-DD") == moment(slotDate).format("YYYY-MM-DD")) {
            //    console.log("inside loop hereeeeeeeeeeeeeeeee")
            //    console.log("date= "+new Date(slotDate))
            //    console.log("NUM= "+ userSchedule[k].number)

            const slotLocation = (await location.findById(userSchedule[k].location)).id
            //    console.log("loc ="+slotLocation)
            var acceptedRequest = await request.findOne({
                reqType: "Replacement",
                slotNum: userSchedule[k].number, slotDate: new Date(slotDate),
                slotLoc: slotLocation,
                state: 'Accepted',
                sentBy: req.user.id
            });

            //need to add all requests to check that user 
            //even sent replacement requests before sending annual
            var allReq = await request.findOne({
                reqType: "Replacement",
                slotNum: userSchedule[k].number, slotDate: new Date(slotDate),
                slotLoc: slotLocation,
                sentBy: req.user.id
            });
            allReplacementRequest[m++] = allReq


            if (acceptedRequest) {

                var accepted = ({
                    replacementID: acceptedRequest.sentTo,
                    slotNum: userSchedule[k].number,
                    slotLoc: slotLocation
                })

                acceptedRequests[l++] = accepted
            }
        }

    }

    // console.log("llllllllllllllll= "+acceptedRequests.length)
    // for(var g=0;g<acceptedRequests.length;g++)
    // console.log(acceptedRequests[g].replacementID+" "+acceptedRequests[g].slotNum+" "+
    // acceptedRequests[g].slotLoc)

    console.log("sasdsadadasd= " + allReplacementRequest.length)
    var currReason = ""
    if (req.body.reason)
        currReason = req.body.reason;
    if (acceptedRequests.length > 0) {
        const newAnnualRequest = new request({
            reqType: 'Annual Leave',
            sentTo: HODStaffModel._id,
            sentBy: req.user.id,
            state: 'Pending',
            submission_date: moment(),

            reason: currReason,
            slotDate: slotDate,
            // replacementStaff: acceptedRequest.sentTo,

            //milestone2
            acceptedReplacement: acceptedRequests
        });

        await newAnnualRequest.save();

        //const acceptedStaff = await StaffMemberModel.findById(acceptedRequest.sentTo);

        //send notification to hod
        const notification = (await StaffMemberModel.findById(HODStaffModel._id)).notifications
        const notNew = notification
        notNew[notNew.length] = "You received a new annual leave request."
        const staffReplacement = await StaffMemberModel.findByIdAndUpdate(HODStaffModel._id, { notifications: notNew })
        return res.status(200).send('Annual Leave request sent to HOD with the details about the academic member who accepted your request');



    }
    else {
        if (allReplacementRequest.length == 0) {
            return res.status(400).send('You do not have a replacement request with such details!');
        }
        else {

            var currReason = ""
            if (req.body.reason)
                currReason = req.body.reason;
            const newAnnualRequest = new request({
                reqType: 'Annual Leave',
                sentTo: HODStaffModel._id,
                sentBy: req.user.id,
                state: 'Pending',
                submission_date: moment(),

                reason: currReason,
                slotDate: slotDate,

                //milestone2
                acceptedReplacement: []
            });
            await newAnnualRequest.save();
            //send notification to hod
            const notification = (await StaffMemberModel.findById(HODStaffModel._id)).notifications
            const notNew = notification
            notNew[notNew.length] = "You received a new annual leave request."
            const staffReplacement = await StaffMemberModel.findByIdAndUpdate(HODStaffModel._id, { notifications: notNew })

            return res.status(200).send('Annual Leave request sent to HOD with request that has no accept responses.');
        }
    }

});

router.put('/acceptRequest', authenticateToken, async (req, res) => {
    console.log("in accept request")
    const userAcademic = await AcademicStaffModel.findOne({ member: req.user.id });
    if (!userAcademic)
        return res.status(401).send('You are not an academic member!');

    if (!req.body.requestID) {
        return res.json("Please enter request ID.")
    }
    const currRequest = await request.findOne({ requestID: req.body.requestID })
    if (!currRequest)
        return res.json("This request does not exist.")
    if (!currRequest.sentTo.equals(req.user.id))
        return res.status(401).send('This request was not sent to you.Cannot accept or reject.');

    const reqType = currRequest.reqType;
    if (currRequest.state != "Pending") {
        return res.status(400).json("This request has already been responded to!")
    }

    if (reqType == "Replacement") {
        //check if this person is the sender of this request
        // if(!currRequest.sentTo.equals(req.user.id)) 
        // return res.status(401).send('This request was not sent to you.Cannot accept or reject.');
        // if(currRequest.state=="Accepted"){
        //     return res.json("This request has already been accepted before.")
        // }

        // const sentBy=(await StaffMemberModel.findOne({email:sentByEmail}))._id
        const reqType = currRequest.reqType
        const submission_date = currRequest.submission_date
        const sentBy = currRequest.sentBy
        const slotNum = currRequest.slotNum
        const slotDate = currRequest.slotDate
        const slotLoc = currRequest.slotLoc


        // const reqID=currRequest._id
        const reqUpdated = await request.findOneAndUpdate({ requestID: req.body.requestID }, { state: "Accepted" })

        //delete other requests sent to other academic members since one is already accepted
        const otherRepReq = await request.find({
            reqType: reqType, submission_date: submission_date, sentBy: sentBy,
            slotNum: slotNum, slotDate: slotDate, slotLoc: slotLoc
        })
        for (var i = 0; i < otherRepReq.length; i++) {
            if (otherRepReq[i].sentTo != req.user.id) {
                const delID = otherRepReq[i]._id
                const delReq = await request.findByIdAndDelete(delID)
            }
        }

        const notification = (await StaffMemberModel.findById(currRequest.sentBy)).notifications
        const notNew = notification
        notNew[notNew.length] = "Your request has been accepted."
        const staffReplacement = await StaffMemberModel.findByIdAndUpdate(currRequest.sentBy, { notifications: notNew })
        return res.json("Request successully accepted.")

    }

    if (reqType == "Change Day off") {

        const upReq = await request.findOneAndUpdate({ requestID: req.body.requestID }, { state: "Accepted" })
        const upDayOff = await AcademicStaffModel.findOneAndUpdate({ member: currRequest.sentBy }, { day_off: currRequest.newDayOff })
        const notification = (await StaffMemberModel.findById(currRequest.sentBy)).notifications
        const notNew = notification
        notNew[notNew.length] = "Your Change Day-Off request has been accepted."
        const staffReplacement = await StaffMemberModel.findByIdAndUpdate(currRequest.sentBy, { notifications: notNew })
        return res.json("Request successully accepted.")
    }


    if (reqType == "Accidental Leave" || reqType == "Sick Leave") {
        var attDay


        if (reqType == "Sick Leave")
            attDay = currRequest.sickDay

        if (reqType == "Accidental Leave")
            attDay = currRequest.accidentDate

        const upAccReq = await request.findOneAndUpdate({ requestID: req.body.requestID }, { state: "Accepted" })
        const newAtt = ({
            date: attDay,
            attended: true,
        })

        const user = await StaffMemberModel.findById(currRequest.sentBy)
        var oldMonthUp = user.attendance
        console.log("this is=============== " + user.name)
        oldMonthUp[oldMonthUp.length] = newAtt

        console.log("newwwwwwwwwwww= " + oldMonthUp)
        // for(var l=0;l<oldMonthUp;l++)
        // console.log("atttendaceeeeeeeeeeeeeeeeeee= "+oldMonthUp[l])
        console.log("oldddddddddddddddd= " + moment(oldMonthUp[oldMonthUp.length - 1].date).format("YYYY-MM-DD"))

        const up = await StaffMemberModel.findByIdAndUpdate(currRequest.sentBy, { attendance: oldMonthUp })

        //notify
        const notification = user.notifications
        const notNew = notification
        if (reqType == "Accidental Leave")
            notNew[notNew.length] = "Your Accidental leave request has been accepted!"
        if (reqType == "Sick Leave")
            notNew[notNew.length] = "Your Sick leave request has been accepted!"
        const staffReplacement = await StaffMemberModel.findByIdAndUpdate(currRequest.sentBy, { notifications: notNew })
        return res.json("Request successully accepted.")

    }

    if (reqType == "Maternity Leave") {
        const user = await StaffMemberModel.findById(currRequest.sentBy)
        const upAccReq = await request.findOneAndUpdate({ requestID: req.body.requestID }, { state: "Accepted" })
        console.log("uppppppppppp= " + upAccReq)
        var bool = false;
        var attendance = user.attendance
        var newAtt = attendance
        var k = attendance.length
        var startDate = currRequest.startDate
        const endDate = currRequest.endDate
        var startDateYear = moment(currRequest.startDate).format("Y")
        const startDateMonth = moment(currRequest.startDate).format("M")
        var endDay;
        console.log("st=  " + startDate)
        console.log("end=  " + endDate)

        while (!bool) {
            console.log("start date= " + startDate)
            var newAttendance = ({
                date: startDate,
                attended: true,
            })
            newAtt[k++] = newAttendance
            startDate = moment(startDate, "YYYY-MM-DD").add(1, 'days');
            console.log("new start date= " + moment(startDate).format("YYYY-MM-DD"))
            console.log("end == " + moment(endDate).format("YYYY-MM-DD"))
            var check = (moment(startDate).format("YYYY-MM-DD") <= (moment(endDate).format("YYYY-MM-DD")))
            console.log("checkkkkkkkk= " + check)
            if (!check)
                bool = true
        }
        const up = await StaffMemberModel.findByIdAndUpdate(currRequest.sentBy, { attendance: newAtt })

        //notify
        const notification = user.notifications
        const notNew = notification
        notNew[notNew.length] = "Your Maternity leave request has been accepted!"
        const staffReplacement = await StaffMemberModel.findByIdAndUpdate(currRequest.sentBy, { notifications: notNew })
        return res.json("Request successully accepted.")
    }

    if (reqType == "Compensation Leave") {
        const user = await StaffMemberModel.findById(currRequest.sentBy)
        const compensatedDay = currRequest.compensatedDay
        var attendance = user.attendance
        var newAtt = attendance
        var bool = false;
        for (var k = 0; k < attendance.length; k++) {
            console.log("attendanceDay= " + moment(attendance[k].date).format("YYYY-MM-DD"))
            console.log("compensatedDay= " + moment(compensatedDay).format("YYYY-MM-DD"))
            if (moment(attendance[k].date).format("YYYY-MM-DD") == moment(compensatedDay).format("YYYY-MM-DD")) {
                bool = true;
                break;
            }
        }
        if (!bool)
            return res.status(400).json("Cannot accept this request because the compensation day was not attended!")

        const upAccReq = await request.findOneAndUpdate({ requestID: req.body.requestID }, { state: "Accepted" })

        var oldMonthUp = user.attendance
        var newAttendance = ({
            date: currRequest.missedDay,
            attended: true,
        })
        oldMonthUp[oldMonthUp.length] = newAttendance

        const up = await StaffMemberModel.findByIdAndUpdate(currRequest.sentBy, { attendance: oldMonthUp })

        //notify
        const notification = user.notifications
        const notNew = notification
        notNew[notNew.length] = "Your Compensation leave request has been accepted!"
        const staffReplacement = await StaffMemberModel.findByIdAndUpdate(currRequest.sentBy, { notifications: notNew })
        return res.json("Request successully accepted.")
        // const upAccReq=await request.findOneAndUpdate({requestID:req.body.requestID},{state:"Accepted"})

    }
    if (reqType == "Annual Leave") {
        const user = await StaffMemberModel.findById(currRequest.sentBy)
        const upAccReq = await request.findOneAndUpdate({ requestID: req.body.requestID }, { state: "Accepted" })

        var oldMonthUp = user.attendance
        var newAttendance = ({
            date: currRequest.slotDate,
            attended: true,
        })
        oldMonthUp[oldMonthUp.length] = newAttendance
        const up = await StaffMemberModel.findByIdAndUpdate(currRequest.sentBy, { attendance: oldMonthUp })


        //updating replacements schedule
        if (currRequest.acceptedReplacement.length > 0) {
            for (var s = 0; s < currRequest.acceptedReplacement.length; s++) {
                var replacement = await AcademicStaffModel.findOne({ member: acceptedReplacement[s].replacementID })
                var repacementSchedule = replacement.schedule
                var replacementSlotDate = currRequest.slotDate
                var replacementSlotNum = acceptedReplacement[s].slotNum
                var replacementSlotLoc = acceptedReplacement[s].slotLoc
                const slotLoc = await Location.findOne({ id: replacementSlotLoc })
                const slotLocID = slotLoc._ID
                const slotDay = moment(currRequest.slotDate).format("dddd")
                var courseID;

                //get course id by getting it from schedule of person who sent the replacement request
                const sender = await AcademicStaffModel.findOne({ member: currRequest.sentBy })
                const senderSchedule = sender.schedule
                for (var g = 0; g < senderSchedulelength; g++) {
                    if (moment(senderSchedule[g].date).format("YYYY-MM-DD") == currRequest.slotDate
                        && senderSchedule[g].number == replacementSlotNum, senderSchedule[g].location == slotLocID)
                        courseID = senderSchedule[g].course
                }
                var newSlot = ({
                    date: currRequest.slotDate,
                    day: slotDay,
                    number: replacementSlotNum,
                    location: slotLocID,
                    academic_member_id: replacement._id,
                    course: courseID,
                    isReplaced: true
                })

                replacementSchedule.push(newSlot);
                var upReplacement = await AcademicStaffModel.findOneAndUpdate({
                    member: acceptedReplacement[s].replacementID
                }, { schedule: replacementSchedule })



            }
        }

        //notify
        const notification = user.notifications
        const notNew = notification
        notNew[notNew.length] = "Your Annual leave request has been accepted!"
        try {
            const staffReplacement = await StaffMemberModel.findByIdAndUpdate(currRequest.sentBy, { notifications: notNew })
            return res.json("Request successully accepted.")
        }
        catch (err) {
            console.log(err)
        }

    }

    // if(reqType=="Slot Linking"){
    //     const user=await StaffMemberModel.findById(currRequest.sentBy)
    //     const upAccReq=await request.findOneAndUpdate({requestID:req.body.requestID},{state:"Accepted"})
    //     const academicMember=await AcademicStaffModel.findOne({member:currRequest.sentBy})
    //     const userSchedule=academicMember.schedule
    //     const reqCourse=await Course.findOne({id=currRequest.courseID})
    //     const reqCourseID=reqCourse._id
    //     for(var k=0;k<userSchedule.length;k++){
    //         if(userSchedule[k].day==currRequest.slotDay){
    //             var newSlot=({date: userSchedule[k].date,
    //                 day: userSchedule[k].day,
    //                 number: userSchedule[k].number, 
    //                 location:userSchedule[k].location,
    //                 academic_member_id: userSchedule[k].academic_member_id,
    //                 course:reqCourseID ,
    //                 isReplaced:false })
    //             userSchedule[k].push(newSlot)
    //         }
    //     }
    //     if(userSchedule.length==0)
    //     userSchedule.push

    //     const up=await AcademicStaffModel.findOneAndUpdate({member:currRequest.sentBy},{schedule:userSchedule})


    //     const notification=user.notifications
    //     const notNew=notification
    //     notNew[notNew.length]="Your Slot Linking request has been accepted!"
    //     const staffReplacement= await StaffMemberModel.findByIdAndUpdate(currRequest.sentBy,{notifications:notNew})
    //     return res.json("Request successully accepted.")

    // }

})

router.post('/rejectRequest', authenticateToken, async (req, res) => {
    console.log("in reject request")
    const userAcademic = await AcademicStaffModel.findOne({ member: req.user.id });
    console.log("idddddddddddddddd= " + req.body.requestID)
    if (!userAcademic)
        return res.status(401).send('You are not an academic member!');

    if (!req.body.requestID) {
        return res.json("Please enter request ID.")
    }
    const currRequest = await request.findOne({ requestID: req.body.requestID })
    const reqType = currRequest.reqType
    console.log("state= " + currRequest.state)
    if (currRequest.state != "Pending")
        return res.status(400).json("This request has already been responded to!")
    if (!currRequest)
        return res.json("This request does not exist.")

    if (req.body.reason)
        var upAccReq = await request.findOneAndUpdate({ requestID: req.body.requestID }, { state: "Rejected", RejectionReason: req.body.reason })
    else
        var upAccReq = await request.findOneAndUpdate({ requestID: req.body.requestID }, { state: "Rejected" })

    const user = await StaffMemberModel.findById(currRequest.sentBy)
    const notification = user.notifications
    const notNew = notification
    notNew[notNew.length] = "Your " + reqType + " request has been rejected!"
    const staffReplacement = await StaffMemberModel.findByIdAndUpdate(currRequest.sentBy, { notifications: notNew })
    return res.json("Request successully rejected.")

})

router.get('/newNotifications', authenticateToken, async (req, res) => {
    const userNotifications = (await StaffMemberModel.findById(req.user.id)).notifications

    const upOld = await StaffMemberModel.findByIdAndUpdate(req.user.id, { oldNotifications: userNotifications, notifications: [] })
    return res.status(200).json(userNotifications)
})
router.get('/allNotifications', authenticateToken, async (req, res) => {
    const userNotifications = (await StaffMemberModel.findById(req.user.id)).notifications

    return res.status(200).json(userNotifications)
})


module.exports = router;