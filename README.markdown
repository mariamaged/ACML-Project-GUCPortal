# Advanced Computer Lab - GUCPortal
## Milestone 1
### Collaborators
1. Maria Maged 43-1498.
2. Monica George 43-0818.
3. Maya Ahmed 43-6655


3. HR Functionalities:
 Add location:
o Functionality: adds a location (lab, office, tutorial, or lecture hall).
o Route: /HR /Location
o Request type: post()
o Request body: {id, type, maximum_capacity}
o Response body: in case the user was not authorized (not HR) the
response will be “Access Denied”.
If one of the request body inputs was missing, the response will be
“please insert a correct location”.
If a location with the id already exists, the response will be “a
location with this id already exists”, otherwise the response is the
new location added.
o Result in database: a new location is added to the location model
with current capacity equivalent to 0.
 Delete location:
o Functionality: deletes a location from the database, and if the
location is an office, then any staff members who are assigned to this
office will get their offices nullified until they are assigned new
offices. If the location is any other type, then any slot that is taking
place in this location will have its location nullified until it’s assigned
another location.
o Route: /HR /Location
o Request type: delete()
o Request body: {id}
o Response body: in case the user was not authorized (not HR) the
response will be “Access Denied”.
If the id was not given in the body, the response will be “please enter
the id of the location to be deleted”
If the location is not found the response is “this location does not
exist”. Otherwise the response is “done”.
o Result in database: if the location is found to be an office, the staff
members with office equivalent to this location will get their office
nullified; if it was of any other type then the slots happening in this
place will get their location nullified.
 Update location:
o Functionality: Updates location attributes such as id, type, and
maximum_capacity.
o Route: /HR /Location
o Request type: put()
o Request body: {oldid, id, type, maximum_capacity}
o Response body: in case the user was not authorized (not HR) the
response will be “Access Denied”. If any of the request body
variables is missing the response is “please fill all the fields for the
location to be updated successfully”. If the location was not found
the response is” There is no location with this id to update”. If the
current capacity exceeds the new maximum capacity the response is”
Cannot update the current capacity of this location it is already
exceeding the new maximum capacity”. If the new id already exists,
the response is” the new id already exists”. Otherwise it’s “done”.
Note: any attribute that is not to be updated will be given in the body
as the same old one.
o Result in database: if the type is to be updated the same approach
used in deletion will be applied in updating as for the people or slots
assigned to this location. All the attributes will be updated
successfully and saved in the database.
 Add faculty:
o Functionality: adds a faculty to the database.
o Route: /HR /Faculty
o Request type: post()
o Request body: {name}
o Response body: in case the user was not authorized (not HR) the
response will be “Access Denied”. If the name was not given the
response will be “please enter the faculty name”. If a faculty with the
same name was found, the response will be “a faculty with this name
already exists”. Otherwise the response is the new added faculty.
o Result in database: a new faculty is added and saved in the database.
 Delete faculty:
o Functionality: deletes a faculty from the database. And consequently
delete all the departments, courses, and staff members under this
faculty.
o Route: /HR /Faculty
o Request type: delete()
o Request body: {name}
o Response body: in case the user was not authorized (not HR) the
response will be “Access Denied”. In case the name was missing, the
response is “please insert the name of the faculty you want to
delete”. If the faculty is not found, the response is “this faculty does
not exist”. Otherwise the response is “Done”.
o Result in database: all the academic staff that belongs to this faculty
is deleted from the academic staff model and the staff member
model. The courses under the departments to be deleted (under that
faculty) are deleted from the course model. Then all the departments
that belong to this faculty will be deleted. Then the faculty itself will
be deleted.
 Update faculty:
o Functionality: Updates the name of a faculty.
o Route: /HR /Faculty
o Request type: put()
o Request body: {oldname, name}
o Response body: in case the user was not authorized (not HR) the
response will be “Access Denied”. If any variable of request body is
missing the response is” Please insert the old and new name of the
faculty you want to update.” If there is a faculty with the new name
or the no faculty was found to update the response is” please enter
correct data”. Otherwise “done”.
o Result in database: the name of the faculty is updated to the new
name.
 Add department:
o Functionality: adds a department under a certain faculty.
o Route: /HR /department
o Request type: post()
o Request body: {name, facultyname, hod}
o Response body: in case the user was not authorized (not HR) the
response will be “Access Denied”. If any variable of request body
(except for hod not necessary) is missing the response is” Please fill
the fields correctly”. If a department with the same name was found,
the response is “a department with this name already exists”. If no
faculty of the provided name was found, the response is” the faculty
name you entered is incorrect”. Otherwise the response is the new
added department.
o Result in database: a new department is added containing its unique
name, faculty name, and hod (if it exists or null otherwise).
 Delete department:
o Functionality: deletes a department.
o Route: /HR /department
o Request type: delete()
o Request body:{name}
o Response body: in case the user was not authorized (not HR) the
response will be “Access Denied”. If any variable of request body is 
missing the response is” Please insert the name of the department
you want to delete”. If the department was not found, the response
is “this department already does not exist”. Otherwise “done”
o Result in database: all the academic staff belonging to this
department is deleted from the academic staff model and the staff
members one. All the courses belonging to this department are
deleted as well, and finally the department is deleted.
 Update department:
o Functionality: updates the department name, faculty name, or hod.
o Route: /HR /department
o Request type: put()
o Request body: {oldname, name, facultyname, hodid}
o Response body: in case the user was not authorized (not HR) the
response will be “Access Denied”. If any variable of request body
(except for hodid) is missing the response is” Please fill all the fields”.
If the department is not found the response is “there is no
department with that name”. If the hodid is provided with an id that
does not correspond to a staff member or corresponds to an staff
member but not an academic member, the response will be “there is
no academic member with the id you entered” if the faculty was not
found the response will be “No faculty with that name exists”,
Otherwise “done”.
Note: the response can be a combination of 2 of the previous
messages in some cases.
o Result in database: the department is updated with the new
attributes’ values and is saved in the database.
 Add course:
o Functionality: adds a course to the database.
o Route: /HR /course
o Request type: post()
o Request body: {id, name, departmentname}
o Response body: in case the user was not authorized (not HR) the
response will be “Access Denied”. If any variable of request body is
missing the response is” Please fill all the fields”. If no department
was found with the corresponding name, the response is” there is no
department with the corresponding name”. If a course with this id
already exists the response is” a course with this id already exists”.
Otherwise, it’s the new course added.
o Result in database: a new course is added with name, unique id, and
department, all the other attributes are null for now.
 Delete course:
o Functionality: deletes a course.
o Route: /HR /course
o Request type: put()
o Request body: {id}
o Response body: in case the user was not authorized (not HR) the
response will be “Access Denied”. If any variable of request body is
missing the response is” Please enter the id of the course you want
to delete”. If the course was not found, the response is “a course
with this id already does not exist”. Otherwise “done”
o Result in database: the array of courses in the academic staff
teaching that course is looped to delete that course from it. also the
schedule of them are looped to delete the slots of this course. Then
the course is deleted.
 Update course:
o Functionality: updates a course’s
id,name,departmentname,slotsneeded,slotscovered,or schedule
o Route: /HR /course
o Request type: put()
o Request body:
{oldid,id,name,departmentname,slotsneeded,slotscovered,schedule}
o Response body: in case the user was not authorized (not HR) the
response will be “Access Denied”. If any variable of request body
(first 4 only) is missing the response is” Please fill all the fields”. If the
course were not found, the response is “there is no course with that
id”. If no department was found with the given name, the response is
“there is no department with the given name”, If a course exists and
has the same new id, then the response is “a course with this new id
already exists”. Otherwise “done”.
o Result in database: all the attributes provided (some are optional)
will be updated in the database and saved.
 Add Staff member:
o Functionality: adds a new staff member to the system
o Route: /HR /staffmember
o Request type: post()
o Request body:
{name,email,salary,officelocation,type,dayoff,gender,actype,departm
entname,facultyname}
o Response body: in case the user was not authorized (not HR) the
response will be “Access Denied”. If any variable of request body
(first 6 only) is missing the response is” Please fill all the fields”. If the
office is not to be found the response is “there is no office in this
location”. If the office provided has already reached the maximum
capacity, the response is “the office in the location provided is
already at maximum capacity”. If the type of member is HR and
dayoff is entered as a day other than Saturday. Then the response is
“Saturday is automatically assigned to HR members as dayoff”, and
the process will continue after assigning dayoff to be Saturday. If the
member is an academic member, and one or more of actype,
departmentname, or facultyname is missing then the response is 
“please fill the required data fields”. If either the department or the
faculty is not found the response is “the data entered is incorrect”.
However in the last 2 cases the staff member will be added correctly
to staffmember model (all requirements met) but not to academic
staff model. If the email is already registered, then the response is
“this email is already registered”. Otherwise “done”.
o Result in database: a new staff member containing the member’s
name, email, salary, office, staff_type, dayoff, and gender is added to
the staff member model. If the staff member is HR member, the HR
model will get a new HR member containing reference to his/her
personal info and their day off set to Saturday. If he/she is an
academic member then a new member will be added to the
academic member model containing a reference to the personal
information, day_off, faculty, department, and type.
 Delete Staff member:
o Functionality: deletes a staffmember from the system.
o Route: /HR /staffmember
o Request type: delete()
o Request body: {email}
o Response body: in case the user was not authorized (not HR) the
response will be “Access Denied”. If the email is missing the
response is” Please insert the email of the member you want to
delete”. If the person was not found initially in the system, the
response is “a person with this email already does not exist”.
Otherwise “done”.
o Result in database: if the office location of the member is not null
then the current capacity of the office is decremented by 1. If the
member is an academic member, each of his/her courses will be
retrieved to remove his/her reference from the academic_staff array
in the course itself, and every slot in the course schedule assigned to
this member will be assigned to null and the slots covered for this 
course will be decremented by 1. And then the member is removed
from both staffmember and academic member. If the member is HR,
the member is removed from staff member model and HR model.
 Update Staff member:
o Functionality: updates a staffmember attributes such as email,
password, office, newStaffMember, annualdays, lastupdatedannual,
accidentaldaysleft, attendcompensationday.
o Route: /HR /staffmember
o Request type: put()
o Request body: { oldemail, email, password, office, newStaffMember,
annualdays, lastupdatedannual, accidentaldaysleft,
attendcompensationday}
o Response body: in case the user was not authorized (not HR) the
response will be “Access Denied”. If the old email (only necessary
one the rest is optional) is missing the response is” Please insert the
email of the member you want to update”. If the member is not
found, the response is” there is no member with that email”. If the
office is provided and not found or found as another type of location,
the response will be “there is no office in this location”. If the office
reached its full capacity, the response is” the office you provided is
already at full capacity”. If the email is provided and it’s found that
another user already has this email, the response will be “a user with
this email already exists”. Otherwise “done”.
Note: in case of an optional attribute, any problem with the data will
change in the response message but will not stop the system from
updating the rest of the attributes, which may cause the response to
be a combination of more than one of the previous responses, and
that is a general point (in most of the routes) not specific to only this
route.
o Result in database: If the office is updated then the old office’s
current capacity is decremented by 1, and the new one is 
incremented by 1 along with updating the office attribute. All the
attributes provided are updated and saved, and in case of password
it is hashed first then updated and saved.
 Add missing sign in / sign out record:
o Functionality: adds a missing sig in/sign out record to a specific staff
member other than the HR member performing the task
himself/herself.
o Route: /HR /addrecord
o Request type: put()
o Request body: {userid,thedate,signintime,signouttime} (both
signintime and signouttime are strings in the form of (example:
“13:15” , “07:55”).
o Response body: in case the user was not authorized (not HR) the
response will be “Access Denied”. If the userid or thedate(only
necessary ones the rest is optional) is missing the response is” Please
fill the required fields”. If the user id is equivalent to the HR
member’s id, the response is “cannot add record to this user”. If no
other request body inputs were entered, the response is “please
insert the record to add”. Otherwise “done”.
o Result in database: the record will be added to its place in the sign
in/sign out arrays in attendance of that specific member and it will be
saved in the database. Then the hours per day that date will be
calculated again and saved to the database in staffmember model.
 View any staff member attendance record:
o Functionality: views the attendance records of any staff member.
o Route: /HR /attendance
o Request type: get()
o Request body: {email}
o Response body: in case the user was not authorized (not HR) the
response will be “Access Denied”. If the email is missing the 
response is” Please insert the member you need the attendance
records of”. If the member is not found then the response is “there is
no user with this email”. Otherwise the response is the attendance
records of that member.
o Result in database: No change will occur to the database. The data
will be only retrieved from it with making any changes to it.
 Update the salary of a staff member:
o Functionality: updates the salary of a member
o Route: /HR /updatesalary
o Request type: put()
o Request body: {email,salary}
o Response body: in case the user was not authorized (not HR) the
response will be “Access Denied”. If the email or salary is missing the
response is” Please fill all the fields”. If the member is not found, the
response is “a staff member with this email is not found”. Otherwise
“done”.
o Result in database: the salary of this member is updated and saved
to the staff member model.
 View Staff members with missing hours:
o Functionality: views the members’ names, ids, emails, missing hours,
and missing minutes in case they have missing hours and minutes.
o Route: /HR /viewMissinghours
o Request type: get()
o Request body: {}
o Response body: in case the user was not authorized (not HR) the
response will be “Access Denied”. Otherwise the response is the
array of members.
o Result in database: No change will occur to the database. The data
will be only retrieved from it with making any changes to it.
 View Staff members with missing days:
o Functionality: views the members’ names, ids, emails, and missing
days in case they have missing days.
o Route: /HR /viewMissingdays
o Request type: get()
o Request body: {}
o Response body: in case the user was not authorized (not HR) the
response will be “Access Denied”. Otherwise the response is the
array of members.
o Result in database: No change will occur to the database. The data
will be only retrieved from it with making any changes to it.
4.2 Course Instructor Functionalities:
 View the course(s) coverage he/she is assigned to:
o Functionality: views the coverage of all the courses assigned to
him/her (assuming no specific course will be chosen but instead the
member will view the coverage of all his/her courses.
o Route: /Instructor/coursecoverage
o Request type: get()
o Request body: {}
o Response body: in case the user was not authorized (not instructor)
the response will be “Access denied”. If the staffmember is not found
(using the id in the token) or if the staffmember turns out as not an
academic member, the response is “something went wrong”.
Otherwise the coverage array is returned as a response containing
the course id and coverage for each of the member’s courses.
o Result in database: No change will occur to the database. The data
will be only retrieved from it with making any changes to it.
 View the slots’ assignment of course(s) he/she is assigned to per
semester:
o Functionality: views the slots assignments of all the member
courses for the whole semester; so if a replacement request was
made the new assignment will visible with its date. (Assuming it’s
done for all the courses not by choice of a specific course as it was
not very clear in the description so I took an assumption).
o Route: / Instructor /slotAssignmentpersemester
o Request type: get()
o Request body: {}
o Response body: in case the user was not authorized (not instructor)
the response will be “Access denied”. If the instructor is not found
through the id in the token or not found as an academic member, the
response will be “Something went wrong”. Otherwise it’s the array
of assignments containing the schedules of all the courses.
o Result in database: No change will occur to the database. The data
will be only retrieved from it with making any changes to it.
 View the slots’ assignment of course(s) he/she is assigned to per week:
o Functionality: views the slots assignments of all the courses of one
member for a week; so if a replacement request was made the new
assignment will visible with its date only if it’s occurring during this
upcoming week. (Assuming it’s done for all the courses not by choice
of a specific course as it was not very clear in the description so I took
an assumption).
o Route: /Instructor/slotAssignmentperweek
o Request type: get()
o Request body: {}
o Response body: in case the user was not authorized (not instructor)
the response will be “Access denied”. If the instructor is not found
through the id in the token or not found as an academic member, the
response will be “Something went wrong”. Otherwise it’s the array
of assignments containing the schedules of all the courses.
o Result in database: No change will occur to the database. The data
will be only retrieved from it with making any changes to it.
 View all the staff in his/her department:
o Functionality: views all the staff members that belong to the same
department
o Route: /Instructor/staffperdepartment
o Request type: get()
o Request body: {}
o Response body: in case the user was not authorized (not instructor)
the response will be “Access denied”. If the instructor is not found
through the id in the token or not found as an academic member, the
response will be “Something went wrong”. If the department is not
found, the response will be “the department name is incorrect”.
Otherwise the response is the array containing the names, ids,
dayoff, type, and offices of the staff in this department other than
the instructor himself/herself.
o Result in database: No change will occur to the database. The data
will be only retrieved from it with making any changes to it.
 View the staff per course:
o Functionality: views the academic staff teaching the same course; if
the user enters a course id the staff of this course only appears
otherwise all the staff of all the courses he is teaching appear.
o Route: / Instructor /staffpercourse
o Request type: get()
o Request body: {coursed}
o Response body: in case the user was not authorized (not instructor)
the response will be “Access denied”. If the instructor is not found
through the id in the token or not found as an academic member, the
response will be “Something went wrong”. If a coursed was provided
and the course was not found, the response is “the course id you 
entered is incorrect”. If the course was found as not an assigned
course to the instructor, the response is “you are not assigned to this
course”. Otherwise it’s the array containing the staff info either
sorted by course name and course id or just alone (if a specific course
was provided).
o Result in database: No change will occur to the database. The data
will be only retrieved from it with making any changes to it.
 Assign academic member to an unassigned slot in course(s) he/she is
assigned to:
o Functionality: assigns an unassigned slot to a specific academic
member (must be a TA as I was told by TA Nourhan Ashraf).
o Route: / Instructor /Assignment
o Request type: put()
o Request body: {coursed, day, number, slocation, memid}
o Response body: in case the user was not authorized (not instructor)
the response will be “Access denied”. If the instructor is not found
through the id in the token or not found as an academic member, the
response will be “Something went wrong”. If any of the request
body inputs was missing, the response is “please fill all the required
fields”. If the slot location provided by slocation as location id is not
found the response is “the location you entered does not exist”. If
the course turns out as not an assigned course to this instructor, the
response is “you are not assigned to this course”. If the staffmember
was not found or was found as not an academic member or as an
academic member of a type other than Teaching Assistant or
belonging to a department other than the instructor’s department,
the response will be “There is no TA in your department with that
id”. If the slot is already assigned. The response is” the slot is already
assigned”. If the slot does not belong to the course provided, the
response is “the slot does not belong to this course”. If the TA is not
free at this time (already assigned to a slot) the response is “the 
member you want to assign this slot to is busy at this time”.
Otherwise “done”.
o Result in database: we are going to check for duplicates in the
course’s academic staff array before inserting the member assigned
(if not already found). We are going to check for duplicates in the
TA’s courses array before inserting the course assigned (if not already
found). We are going to insert the slot assigned to the schedule of
the TA. We are going to increment the slots_covered of this course
by 1, and assign the slot.academic staff id to the TA’s id.
 Assign an academic member in each of his/her course(s) to be a
coordinator:
o Functionality: assigns a TA as a coordinator for a specific course.
o Route: / Instructor /assigncoordinator
o Request type: put()
o Request body: {coursid, coordinatorid}
o Response body: in case the user was not authorized (not instructor)
the response will be “Access denied”. If the instructor is not found
through the id in the token or not found as an academic member, the
response will be “Something went wrong”. If any of the request
body inputs was missing, the response is “please fill all the fields”. If
the course is not found through coursed, the response is “the course
id you entered is incorrect”. If the coordinator was not found as a
staff member or as an academic member or was found with type
other than TA, the response is “the coordinator id you entered is
incorrect”. If the course is not assigned to the instructor, the
response is “you are not assigned to this course”. If the TA is not
assigned to this course, the response is “the staffmember you
entered is not assigned to this course”. Otherwise “done”.
o Result in database: if the course already had a coordinator the
oldcoordinator’s attribute “isCourseCoordinator” will be updated to
false. Either way the academic member provided would update its 
attribute of isCourseCoordinator to true. The
course.course_coordinator would equal the coordinator _id. 
