const express = require("express");
const router = express.Router();
const AcademicStaff = require("../Models/AcademicStaffModel.js");
const StaffMember = require("../Models/StaffMemberModel.js");
const StaffMemberModel = require("../Models/StaffMemberModel.js");
const location = require("../Models/LocationModel.js");
const HR = require("../Models/HRModel.js");
const faculty = require("../Models/FacultyModel");
const department = require("../Models/DepartmentModel");
const course = require("../Models/CourseModel");
const jwt = require("jsonwebtoken");
const SlotSchema = require("../Models/SlotSchema.js");

function authenticateToken(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send("Access denied please log in first");
  }
  const verified = jwt.verify(token, process.env.TOKEN_SECRET);
  req.user = verified;
  next();
}

// 1- Course coverage
router.get("/coursecoverage", authenticateToken, async (req, res) => {
  try {
    const instr = await StaffMember.findById(req.user.id);
    if (!instr) res.status(400).send("Something went wrong");
    else {
      const inst = await AcademicStaff.findOne({ member: instr._id });
      if (!inst) res.status(400).send("Something went wrong");
      else {
        if (inst.type == "Course Instructor") {
          const courses = inst.courses;
          var coverage = [];
          for (var i = 0; i < courses.length; i++) {
            var c = await course.findById(courses[i]);
            if (c.slots_needed != 0)
              coverage.push({
                "course id": c.id,
                coverage: (100 * c.slots_covered) / c.slots_needed + "%",
              });
            else
              coverage.push({
                "course id": c.id,
                courseDoesNotHaveSlotsAssigned: true,
              });
          }
          res.status(200).json(coverage);
        } else res.status(401).send("Access denied");
      }
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//slots assignment
router.get(
  "/slotsAssignmentpersemester",
  authenticateToken,
  async (req, res) => {
    try {
      const instr = await StaffMember.findOne({ _id: req.user.id });
      if (instr == null) res.status(400).json({ msg: "Something went wrong" });
      else {
        const inst = await AcademicStaff.findOne({ member: instr._id });
        if (inst == null) res.status(400).json({ msg: "Something went wrong" });
        else {
          if (inst.type == "Course Instructor") {
            const courses = inst.courses;
            var assignments = [courses.length];
            for (var i = 0; i < courses.length; i++) {
              var c = await course.findOne({ _id: courses[i] });
              assignments[i] = { "course id": c.id, schedule: c.schedule };
            }
            res.send(assignments);
          } else res.status(400).json({ msg: "Access denied" });
        }
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

//slots assignment
router.get("/slotsAssignmentperweek", authenticateToken, async (req, res) => {
  try {
    const instr = await StaffMember.findOne({ id: req.user.id });
    if (instr == null) res.status(400).json({ msg: "Something went wrong" });
    else {
      const inst = await AcademicStaff.findOne({ member: instr._id });
      if (inst == null) res.status(400).json({ msg: "Something went wrong" });
      else {
        if (inst.type == "Course Instructor") {
          const courses = inst.courses;
          var assignments = [courses.length];
          for (var i = 0; i < courses.length; i++) {
            var c = await course.findOne({ _id: courses[i] });
            var week = [];
            for (var j = 0; j < c.schedule.length; j++) {
              var slot = c.schedule[j];
              var flag = false;
              for (let i = 1; i < 8; i++) {
                const diff = moment().add(i, "days").format("YYYY-MM-DD");
                if (
                  moment(slot.date).format("YYYY-MM-DD").toString() ==
                  diff.toString()
                ) {
                  flag = true;
                  break;
                }
              }
              if (flag) {
                var loc = await location.findOne({ _id: slot.location });
                const returnedSlot = {
                  day: slot.day,
                  locationID: loc.id,
                  courseID: c.id,
                  date: moment(slot.date).format("YYYY-MM-DD"),
                  number: slot.number,
                };
                week.push(returnedSlot);
              }
            }
            assignments[i] = { "course id": c.id, "slots assignment": week };
          }
          return res.status(200).json(assignments);
        } else res.status(400).json({ msg: "Access denied" });
      }
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//staff per department
router.get("/staffperdepartment", authenticateToken, async (req, res) => {
  try {
    const instr = await StaffMember.findOne({ _id: req.user.id });
    //make sure instr is not null elawl
    if (instr == null) res.status(400).json({ msg: "something went wrong" });
    else {
      const inst = await AcademicStaff.findOne({ member: instr._id });

      //for testing
      //  const instr=await StaffMember.findOne({"id":"ac-1"});
      // const inst=await AcademicStaff.findOne({"member":instr._id});
      //end
      if (inst == null) res.status(400).json({ msg: "Something went wrong" });
      else {
        if (inst.type == "Course Instructor") {
          //for testing only
          // const departmentname=req.body.departmentname;
          // if(!departmentname) res.status(400).json({msg:"please enter the department name"});
          //   const dep= await department.findOne({"name":departmentname});
          const departmentid = inst.department;
          const dep = await department.findOne({ _id: departmentid });
          if (dep == null)
            res.status(400).json({ msg: "the department name is incorrect" });
          else {
            const staff = await AcademicStaff.find({ department: dep._id });
            var s = [];
            for (var i = 0; i < staff.length; i++) {
              if (String(staff[i].member) != String(instr._id)) {
                var n = await StaffMember.findOne({ _id: staff[i].member });
                var off = await location.findOne({ _id: n.office });
                if (off != null) off = off.id;
                s.push({
                  name: n.name,
                  id: n.id,
                  dayoff: staff[i].day_off,
                  type: staff[i].type,
                  office: off,
                });
              }
            }
            res.send(s);
          }
        } else res.status(400).json({ msg: "Access denied" });
      }
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//staffpercourse
//they have to enter a course,no?
router.get("/staffpercourse", authenticateToken, async (req, res) => {
  try {
    const instr = await StaffMember.findOne({ _id: req.user.id });
    //make sure instr is not null elawl
    if (instr == null) res.status(400).json({ msg: "something went wrong" });
    else {
      const inst = await AcademicStaff.findOne({ member: instr._id });

      //for testing
      //    const instr=await StaffMember.findOne({"id":"ac-1"});
      //    const inst=await AcademicStaff.findOne({"member":instr._id});
      // end
      if (inst == null) res.status(400).json({ msg: "Something went wrong" });
      else {
        if (inst.type == "Course Instructor") {
          const courseid = req.body.Scourse;
          if (!courseid) {
            const courses = inst.courses;
            const staff = [courses.length];
            for (var i = 0; i < courses.length; i++) {
              var c = await course.findOne({ _id: courses[i] });
              var staffmembers = [c.academic_staff.length];
              for (var j = 0; j < c.academic_staff.length; j++) {
                var staffmem = await AcademicStaff.findOne({
                  _id: c.academic_staff[j],
                });
                staffmembers[j] = {
                  name: staffmem.name,
                  id: staffmem.id,
                  email: staffmem.email,
                  office: staffmem.office,
                };
              }
              staff[i] = {
                "course name": c.name,
                "course id": c.id,
                "staff members": staffmembers,
              };
            }
            res.send(staff);
          } else {
            const courses = inst.courses;
            const thecourse = await course.findOne({ id: courseid });
            if (thecourse == null)
              res
                .status(400)
                .json({ msg: "the course id you entered is incorrect" });
            else {
              var assigned = false;
              for (var i = 0; i < courses.length; i++) {
                if (courses[i] == (await thecourse)._id) {
                  assigned = true;
                  break;
                }
              }
              if (assigned) {
                var staffmembers = [thecourse.academic_staff.length];
                for (var j = 0; j < thecourse.academic_staff.length; j++) {
                  if (String(thecourse.academic_staff[i]) != String(inst._id)) {
                    var staffmem = await AcademicStaff.findOne({
                      _id: thecourse.academic_staff[j],
                    });
                    var s = await StaffMember.findOne({ _id: staffmem.member });
                    staffmembers[j] = {
                      name: s.name,
                      id: s.id,
                      email: s.email,
                      office: s.office,
                      dayoff: staffmem.day_off,
                    };
                  }
                }
                res.send(staffmembers);
              } else
                res
                  .status(400)
                  .json({ msg: "you are not assigned to this course" });
            }
          }
        } else res.status(400).json({ msg: "Access denied" });
      }
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//assigntounassignedSlot
router.route("/Assignment").post(authenticateToken, async (req, res) => {
  try {
    const instr = await StaffMember.findOne({ _id: req.user.id });
    if (!instr) res.status(400).json({ msg: "Something went wrong." });

    else {
      const inst = await AcademicStaff.findOne({ member: instr._id });
      if (!inst) res.status(400).json({ msg: "Something went wrong." });

      else {
        if (inst.type == "Course Instructor") {
          const { courseid, day, number, slocation, memid } = req.body;
          if (!courseid || !day || !number || !slocation || !memid)
            res
              .status(400)
              .json({ msg: "Please fill all the required fields." });

          else {
            const loc = await location.findOne({ id: slocation });
            if (!loc)
              res
                .status(400)
                .json({ msg: "The location you entered does not exist." });

            else {
              const thecourse = await course.findOne({ id: courseid });
              if (!thecourse)
                res.status(400).json({ msg: "This course id does not exist." });

              else {
                var assigned = false;
                for (var i = 0; i < inst.courses.length; i++) {
                  if (inst.courses[i].equals(thecourse._id)) {
                    assigned = true;
                    break;
                  }
                }
                if (!assigned)
                  res
                    .status(400)
                    .json({ msg: "You are not assigned to this course." });
                else {
                  const smem = await StaffMember.findOne({ id: memid });
                  if (!smem)
                    res.status(400).json({
                      msg: "There is no staff member with that id."
                    });
                  else {
                    const mem = await AcademicStaff.findOne({
                      member: smem._id,
                    });
                    if (
                      !mem ||
                      !mem.department.equals(inst.department)
                    )
                      res.status(400).json({
                        msg: "There is no TA in your department with that id."
                      });
                    else {
                      const busySlots = [];
                      thecourse.schedule.forEach(slot => {
                        if (slot.day == day && slot.number == number && slot.location.equals(loc._id)) {

                          const busySlot = {date: moment(slot.date).format('YYYY-MM-DD')};
                          var free = true;
                          for (var i = 0; i < mem.schedule.length; i++) {
                            if (
                              mem.schedule[i].date.getTime() == slot.date.getTime() &&
                              mem.schedule[i].number == slot.number) {
                              free = false;
                              break;
                            }
                          }

                          if (free) {
                            var duplicate = false;
                            for (var k = 0; k < mem.courses.length; k++) {
                              if (mem.courses[k].equals(thecourse._id)) {
                                duplicate = true;
                                break;
                              }
                            }

                            if (!slot.academic_member_id) {
                              slot.academic_member_id = mem._id;
                              thecourse.slots_covered++;
                              const newSlot = {
                                date: slot.date,
                                day: slot.day,
                                course: thecourse._id,
                                number: slot.number,
                                location: slot.location
                              };
                              mem.schedule.push(newSlot);
                              if(!duplicate) {
                                  thecourse.academic_staff.push(mem._id);
                                  mem.courses.push(thecourse._id);
                              }
                            }
                            else {
                              busySlot.busySlot = true;
                              busySlots.push(busySlot);
                            }
                          }
                          else {
                            busySlot.unfreeSlot = true;
                            busySlots.push(busySlot);
                          }
                        }
                      });

                      await thecourse.save();
                      await mem.save();
                      const correctSlots = thecourse.schedule.filter(slot => {return slot.day == day && slot.number == number && slot.location.equals(loc._id)});
                      if(correctSlots.length == 0) res.status(400).json({msg: "No slots with those details."});
                      else if(busySlots.length != 0) res.status(400).json({msg: busySlots});
                      else res.status(200).send("Operation successful!");
                    }
                  }
                }
              }
            }
          }
        } else res.status(400).json({ msg: "Access denied" });
      }
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//assign course coordinator
router.put("/assigncoordinator", authenticateToken, async (req, res) => {
  try {
    const instr = await StaffMember.findOne({ _id: req.user.id });
    //make sure instr is not null elawl
    if (instr == null) res.status(400).json({ msg: "something went wrong" });
    else {
      const inst = await AcademicStaff.findOne({ member: instr._id });

      //for testing
      //    const instr=await StaffMember.findOne({"id":"ac-1"});
      //    const inst=await AcademicStaff.findOne({"member":instr._id});
      // end
      if (inst == null) res.status(400).json({ msg: "Something went wrong" });
      else {
        if (inst.type == "Course Instructor") {
          const { courseid, coordinatorid } = req.body;
          if (!courseid || !coordinatorid)
            res.status(400).json({ msg: "please fill all the fields" });
          else {
            const thecourse = await course.findOne({ id: courseid });
            if (thecourse == null)
              res
                .status(400)
                .json({ msg: "the course id you entered is incorrect" });
            else {
              const thec = await StaffMember.findOne({ id: coordinatorid });
              if (thec == null)
                res
                  .status(400)
                  .json({ msg: "the coordinator id you entered is incorrect" });
              else {
                const thecoordinator = await AcademicStaff.findOne({
                  member: thec._id,
                });
                if (
                  thecoordinator == null ||
                  thecoordinator.type != "Teaching Assistant"
                )
                  res.status(400).json({
                    msg: "the coordinator id you entered is incorrect",
                  });
                else {
                  //make sure it's his/her course
                  var assigned = false;
                  const courses = await inst.courses;
                  for (var i = 0; i < courses.length; i++) {
                    if (thecourse._id == courses[i]) {
                      assigned = true;
                      break;
                    }
                  }
                  if (assigned) {
                    //make sure the coordinater is a teaching assistant of this course
                    var coassigned = false;
                    const cocourses = thecoordinator.courses;
                    for (var i = 0; i < cocourses.length; i++) {
                      if (String(thecourse._id) == String(cocourses[i])) {
                        coassigned = true;
                        break;
                      }
                    }
                    if (coassigned) {
                      if (thecourse.course_coordinator != null) {
                        const oldcoordinater = await AcademicStaff.findOne({
                          _id: thecourse.course_coordinator,
                        });
                        oldcoordinater.isCourseCoordinator = false;
                        await oldcoordinater.save();
                      }
                      thecourse.course_coordinator = thecoordinator._id;
                      thecoordinator.isCourseCoordinator = true;
                      await thecoordinator.save();
                      await thecourse.save();
                      res.send("done");
                    } else
                      res.status(400).json({
                        msg:
                          "the staffmember you entered is not assigned to this course",
                      });
                  } else
                    res
                      .status(400)
                      .json({ msg: "your not assigned to this course." });
                }
              }
            }
          }
        } else res.status(400).json({ msg: "Access denied" });
      }
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
