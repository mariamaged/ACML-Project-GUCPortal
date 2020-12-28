// Created By Maria Maged 2020-12.

// Models.
const StaffMemberModel = require('../Models/StaffMemberModel.js');
const AcademicStaffModel = require('../Models/AcademicStaffModel.js');
const LocationModel = require('../Models/LocationModel.js');
const FacultyModel = require('../Models/FacultyModel.js');
const DepartmentModel = require('../Models/DepartmentModel.js');
const CourseModel = require('../Models/CourseModel.js');
const RequestModel = require('../Models/RequestModel.js');

const jwt = require('jsonwebtoken');
const moment = require('moment');

// For routing.
const express = require('express');
const router = express.Router();

function authenticateToken(req, res, next) {
    const token = req.header('x-auth-token');
    if(!token) {
        return res.status(401).send('Access denied please log in first');
    }
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
}

// Routes.
// (1)
router.get('/viewSlotLinkingRequests', authenticateToken, async (req, res) => {
    const CourseCoordinatorAcademicModel = await AcademicStaffModel.findOne({member: req.user.id});

    if(!CourseCoordinatorAcademicModel.isCourseCoordinator) {
        const slotLinkingRequests = await RequestModel.find({sentTo: req.user.id, reqType: 'Slot Linking'});
        const updatedSlotLinkingRequests = [];

        for(let index = 0; index < slotLinkingRequests.length; index++) {
            const request = slotLinkingRequests[index];
            const slotLinkingObject = {
                requestID: request.requestID,
                requestType: request.reqType,
                state: request.state,
                submission_date: moment(request.submission_date).format('YYYY-MM-DD')
            };
    
            const sentByStaff = await StaffMemberModel.findById(request.sentBy);
            const course = await CourseModel.findOne({id: request.courseID});

            slotLinkingObject.sentByID = sentByStaff.id;
            slotLinkingObject.sentByName = sentByStaff.name;
            if(request.HODRejectionReason) slotLinkingObject.HODRejectionReason = request.HODRejectionReason;
    
            slotLinkingObject.slotNum = request.slotNum;
            slotLinkingObject.slotDay = request.slotDay;
            slotLinkingObject.courseID = request.courseID;
            slotLinkingObject.courseName = course.name;

            if(request.reason) slotLinkingObject.reason = request.reason;
    
            updatedSlotLinkingRequests.push(slotLinkingObject);
        }
    
        return res.status(200).json(updatedSlotLinkingRequests);
    }
    else {
        return res.status(401).send('Access Denied!');
    }
});

// 2 
router.post('/determineSlotLinkingRequestState', authenticateToken, async (req, res) => {
    const CourseCoordinatorAcademicModel = await AcademicStaffModel.findOne({member: req.user.id});

    if(CourseCoordinatorAcademicModel.isCourseCoordinator) {

    const {requestID, state} = req.body;
    const request = await RequestModel.findOne({requestID: requestID});
    if(!request) res.status(400).send('Request not found!');
    if(!request.sentTo.equals(req.user.id)) return res.status(400).send('This request is not sent for you!');
    if(request.reqType != 'Slot Linking') return res.status(400).send('You are trying to accept a request that is not a slot linking request!');

    const slotDay = request.slotDay;
    const slotNum = request.slotNum;
    const academic = await AcademicStaffModel.findOne({member: request.sentBy});
    const course = await CourseModel.findOne({id: request.courseID});

    if(state == 'Accepted') {
    request.state = 'Accepted';
    await request.save();

    const addedSchedule = course.schedule.filter((slot) => {return slot.number == slotNum && slot.day == slotDay});
    course.schedule.forEach((slot) => {
        if(slot.number == slotNum && slot.day == slotDay) slot.academic_member_id = academic._id;
    });

    await course.save();

    addedSchedule.forEach((slot) => {slot.course = course._id});
    academic.schedule.push(addedSchedule);
    await academic.save();
    }

    else {
        request.state = 'Rejected';
        if(req.body.RejectionReason) request.HODRejectionReason = req.body.RejectionReason;
        await request.save();
    }
}
    else {
        res.status(401).send('Access Denied!');
    }
});

// 3 (a)

// 3 (b)

// 3 (c)

