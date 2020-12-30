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
router
.post('/courseSlots', authenticateToken, async (req, res) => {
    //  if(req.user.isCourseCoordinator) {
    const {courseID, details} = req.body;
    const course = await CourseModel.findOne({id: courseID});
    if(!course) return res.status(400).send("Course not found!");

    const CCAcademicModel = await AcademicStaffModel.findOne({member: req.user.id}); 

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
})

// 3 (b)
.delete('/courseSlots', authenticateToken, async (req, res) => {
            const {courseID, details} = req.body;
            const course = await CourseModel.findOne({id: courseID});
            if(!course) return res.status(400).send("Course not found!");
        
            const CCAcademicModel = await AcademicStaffModel.findOne({member: req.user.id}); 
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
});

// 3 (c)
app.post('/updateCourseSlots', authenticateToken, async (req, res) => {
        const {courseID, details} = req.body;
        const course = await CourseModel.findOne({id: courseID});
        if(!course) return res.status(400).send("Course not found!");
    
        const CCAcademicModel = await AcademicStaffModel.findOne({member: req.user.id}); 
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
});

