# Advanced Computer Lab - GUCPortal
## Milestone 1
### Collaborators
1. Maria Maged 43-1498.
2. Monica George 43-0818.
3. Maya Ahmed 43-6655.
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
   - `Case 2:` If the operation is successful, and each of the individual course instructors gets assigned to their respective course, the response sends back the message `Operation done successfully!` with status **`200`**.\
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
Operation done successfully!
```

```json
Access denied!
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