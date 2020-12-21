# Advanced Computer Lab - GUCPortal
## Milestone 1
### Collaborators
1. Maria Maged 43-1498.
2. Monica George 43-0818.
3. Maya Ahmed 43-6655.

## Port Number
3000.
## 4.1 HOD Functionalities
### Any HOD can do the following
	 1(a) Assign a course instructor for each course in his department.
- **Functionality:** the user who is an HOD should be capable of assigning certain courses under his department to certain `course instructors` who are under his department as well.
- **Route:** /assignCourseInstructorforCourses
- **Request type:** POST.
- **Request body:**
   - Should be an array of objects with two properties: -->
      1. courseID [where ID is a `string` like `CSEN704`].
      2. member [where member is the staff member id as a `string` like `ac-12`].
    - This implies that the HOD is trying to assign each academic member in the array the course referred to in the same object.
- **Example request body:**
```json
[
{
"courseID": "CSEN704",
"member": "ac-12"
},
{
"courseID": "CSEN703",
"member": "ac-13"
}
]
```
- **Response body:**
   - `Case 1:` If the user is not an HOD and therefore not authorized to issue this action, the response sends back the message: **`Access Denied!`** with status **`401`**.\
   &nbsp;
   - `Case 2:` If the operation is successful, and each of the individual course instructors gets assigned to their respective course, the response sends back the message **`Operation done successfully!`** with status **`200`**.\
   &nbsp;
   - `Case 3:` If any of the constraints do not apply to one of the input objects in the array, an array of **`request defects`** is sent back with a detailed analysis with what was wrong with the input.
     - The six possible errors are:
        - unfoundCourse.
        - unfoundAcademicMember.
        - memberNotCourseInstructor.
        - courseNotunderHODDepartment.
        - memberNotBelongingtoCourseDep.
        - courseInstructorAlreadyAssigned.
- **Example response body:**
```json
Access denied!
```
```json
Operation done successfully!
```

```json
[
{
	"request": 
	{
		"courseID": "CSEN704",
		"member": "ac-11"
	},
	
	"unfoundCourse": true,
	"unfoundAcademicMember": true,
    "memberNotCourseInstructor": true,
    "courseNotunderHODDepartment": true,
    "memberNotBelongingtoCourseDep": true,
    "courseInstructorAlreadyAssigned": true
},
{
	"request": 
	{
		"courseID": "CSEN703",
		"member": "ac-13"
	},
	
    "unfoundCourse": true,
    "unfoundAcademicMember": true,
    "memberNotCourseInstructor": true,
    "courseNotunderHODDepartment": true,
}
]
```
- **Result in database:**
   - The `courses` attribute of each `course instructor` in the `AcademicStaffModel` gets updated with the reference to the new course the course instructor will be teaching.
   - The `academic_staff` attribute of each `course` in the `CourseModel` gets updated with the reference to the course instructor who will be teaching this course.
***

## 4.2 Course Instructor
### Any course instructor can do the following:
	5(a) Update assignment of academic member in course(s) he/she is assigned to.
- **Functionality:** the user who is a Course Instructor should be capable of changing an academic member assigned to a particular course he is assigned to as well with another academic member who is not assigned to the course and belongs to the same department as the course.
- **Route:** /updateAcademicMemberstoCourses
- **Request:** POST.
- **Request body:** 
   -  Should be an array of objects with three properties: -->
      1. courseID [where ID is a `string` like `CSEN704`].
      2. oldMember [where oldMember is the staff member id as a `string` like `ac-12` to be replaced].
      3. newMember [where newMember is the staff member id as a `string` like `ac-12` to get assigned the course instead].
    - This implies that the Course Instructor is trying to assign each new academic member in the array the course referred to in the same object, and removing the assignment of the old member in the same object.
- **Example request body:**
```json
[
{
"courseID": "CSEN704",
"oldMember": "ac-12",
"newMember": "ac-13"
},
{
"courseID": "CSEN703",
"oldMember": "ac-13",
"newMember": "ac-11"
}
]
```
- **Response body:**
   - `Case 1:` If the user is not a Course Instructor and therefore not authorized to issue this action, the response sends back the message: **`Access Denied!`** with status **`401`**.\
   &nbsp;
   - `Case 2:` If the operation is successful, and each of the individual academic members gets replaced with another academic member in their respective course, the response sends back the message **`Operation done successfully!`** with status **`200`**.\
   &nbsp;
   - `Case 3:` If any of the constraints do not apply to one of the input objects in the array, an array of **`request defects`** is sent back with a detailed analysis with what was wrong with the input.
     - The six possible errors are:
        - unfoundCourse.
        - unfoundAcademicOldMember.
        - unfoundAcademicNewMember.
        - newMemberNotBelongingtoCourseDep.
        - notAssignedToCourse.
        - oldNotAssignedToCourse.
        - newMemberAlreadyAssigned.
- **Example response body:**
```json
Access denied!
```
```json
Operation done successfully!
```
```json
[
{
	"request": 
	{
		"courseID": "CSEN704",
		"oldMember": "ac-12",
		"newMember": "ac-13"
	},
    
    "unfoundCourse": true,
    "unfoundAcademicOldMember": true,
    "unfoundAcademicNewMember": true,
    "newMemberNotBelongingtoCourseDep": true,
    "notAssignedToCourse": true,
    "oldNotAssignedToCourse": true,
    "newMemberAlreadyAssigned": true
},
{
	"request": 
	{
		"courseID": "CSEN703",
		"oldMember": "ac-13",
		"newMember": "ac-11"
	},
	
    "unfoundCourse": true,
    "unfoundAcademicOldMember": true,
    "unfoundAcademicNewMember": true,
    "newMemberNotBelongingtoCourseDep": true,
}
]
```
- **Result in database:**
    - The `courses` attribute of each `old academic member` in the `AcademicStaffModel` has the reference to the course removed.
    - The `courses` attribute of each `new academic member` in the `AcademicStaffModel` has the reference to the course added to it.
   - The `academic_staff` attribute of each `course` in the `CourseModel` gets updated with the new reference to the new academic member after the old one has been removed.