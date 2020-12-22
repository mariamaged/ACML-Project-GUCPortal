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
      1. courseID [where courseID is a `string` like `CSEN704`].
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
   - `Case 3:` If any of the constraints do not apply to one of the input objects in the array, an array of **`request defects`** is sent back with a detailed analysis with what was wrong with the input with status **`400`**.
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
      1. courseID [where courseID is a `string` like `CSEN704`].
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
   - `Case 3:` If any of the constraints do not apply to one of the input objects in the array, an array of **`request defects`** is sent back with a detailed analysis with what was wrong with the input with status **`400`**.
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

## 4.3 Course Coordinator
	3(a) Add course slot(s) in his/her course.
- **Functionality:** the user who is a Course Coordinator should be capable of adding several slots (or one slot) to the schedule of a certain course he is a course coordinator of.  
    - Since the academic member teaching the slot is later specified by the course instructor, the course coordinator only adds the:
        - Date [YYYY-MM-DD].
        - Slot Number [1, 2, 3, 4, 5].
        - Location.\
        related to the slot.
- **Route:** /courseSlots
- **Request:** POST.
- **Request body:** 
   - Should be an object with two properties:
      - courseID [where courseID is a `string` like `CSEN704`].
      -  details: An Array of objects with three properties: -->
         1. date [Where date is a `string` in the form of `YYYY-MM-DD`].
         2. number [where number is the number of one of the five slots].
         3. locationID [where locationID is a `string` like `C7.203`].
    - This implies that the Course Coordinator is trying to assign this particular course in the request body several slots where each slot is identified by the day it happens, the number of the slot and the location it resides in.
- **Example request body:**
```json
{
"courseID": "CSEN704",
"details": [
	{
	"date": "2020-12-12",
	"locationID": "C7.203",
	"number": 3
	},
	{
	"date": "2020-12-12",
	"locationID": "C7.204",
	"number": 3
	},
	{
	"date": "2020-12-14",
	"locationID": "C7.203",
	"number": 4
	}
]
}
```
- **Response body:**
   - `Case 1:` If the user is not a Course Coordinator and therefore not authorized to issue this action, the response sends back the message: **`Access Denied!`** with status **`401`**.\
   &nbsp;
   -  `Case 2:` If there is no course in the database with that courseID, the response sends back the message **`Course not found!`** with status **`400`**.\
   &nbsp;
    - `Case 3:` If the user is not a course coordinator of the course specified in the body, the response sends back the message **`You are not a course coordinator for this course!`** with status **`401`**.\
     &nbsp;
    - `Case 4:` If the operation is successful, and the course gets added all of the slots in the request body, the response sends back the message **`Operation done successfully!`** with status **`200`**.\
  &nbsp;
  - `Case 5:` If any of the constraints do not apply to one of the input slots objects in the details property, an array of **`request defects`** is sent back with a detailed analysis with what was wrong with the input with status **`400`**.
     - There are two possible error messages per slot object -->
         1. `locationNotFound: true, locationID: <id-of-location-not-in-database>`.
         2. `slotAlreadyExistsforOtherCourses: true, conflictingCourse: ["courseID1", "courseID2"]`.
            - This error message indicates that the slot to be inserted already exists in the schedule of other courses, and therefore cannot be assigned to the course in the request body.
- **Example response body:**
```json
Access Denied!
```

```json
Course not found!
```

```json
You are not a course coordinator for this course!
```

```json
Operation done successfully!
```

```json
[
{
	"slot": {
		"date": "2020-15-12",
		"number": 5,
		"locationID": "C7.203"
	},
	"locationNotFound": true,
	"locationID": "C7.203"
},
{
	"slot": {
		"date": "2020-15-12",
		"number": 5,
		"locationID": "C7.203"
	},
	"slotAlreadyExistsforOtherCourses": true,
	"conflictingCourses": [
		"CSEN703",
		"CSEN704"
	]
}
]
```
- **Changes in database:**  
   - The `schedule` attribute of the `course` in the course table gets added the new slot object.
      - The new object not only contains the (1) date, (2) number of slot, (3) location.
      - It also contains the day of week calculated from the date by using the **moment library**.
  - The `slots_needed` attribute of the `course` in the course table gets incremented by 1.
***
	3(b) Update course slot(s) in his/her course.
- **Functionality:** 
   - The user who is a Course Coordinator should be capable of updating several slots (or one slot) found in the schedule of a course he is a course coordinator of.
   - These changes include from 1 up to 3 of the following attributes in the slot definition:
       1. **date [YYYY-MM-DD]**.
       2. **location**.
       3. **number [1, 2, 3, 4, 5]**.
- **Route:** /updateCourseSlots
- **Request:** POST.
- **Request body:** 
   - Should be an object with two properties:
      - courseID [where courseID is a `string` like `CSEN704`].
      -  details: An Array of objects with two properties: -->
         1. `oldSlot`: an object containing ***3 properties***:
              - dateOld [Where dateOld is a `string` in the form of `YYYY-MM-DD`].
              - numberOld [where numberOld is the number of one of the five slots].
              - locationIDOld [where locationIDOld is a `string` like `C7.203`].
          2. `newSlot`: an object containing ***from 1 to 3 properties***:
             - dateNew [Where dateNew is a `string` in the form of `YYYY-MM-DD`].
             - numberNew [where numberNew is the number of one of the five slots].
             - locationIDNew[where locationIDNew is a `string` like `C7.203`].
- **Example request body:**
```json
{
"courseID": "CSEN704",
"details": [
	{
	
	"oldSlot": {
		"dateOld": "2020-12-12",
		"locationIDOld": "C7.203",
		"numberOld": 3
		},
	"newSlot": {
		"dateNew": "2020-12-15"
		}
	
	},
	{
	"oldSlot": {
			"dateOld": "2020-12-12",
			"locationIDOld": "C7.203",
			"numberOld": 3
		},
	"newSlot": {
			"numberNew": 4
		}
	},
	{
	"oldSlot": {
			"dateOld": "2020-12-12",
			"locationIDOld": "C7.203",
			"numberOld": 3
		},
	"newSlot": {
			"numberNew": 4,
			"dateNew": "2020-12-15"
		}
	},
	{
	"oldSlot": {
			"dateOld": "2020-12-12",
			"locationIDOld": "C7.203",
			"numberOld": 3
		},
	"newSlot": {
			"numberNew": 4,
			"dateNew": "2020-12-15",
			"locationIDNew": "C3.201"
		}
	}
	
]
}
```
- **Response body:**
   - `Case 1:` If the user is not a Course Coordinator and therefore not authorized to issue this action, the response sends back the message: **`Access Denied!`** with status **`401`**.\
   &nbsp;
   -  `Case 2:` If there is no course in the database with that courseID, the response sends back the message **`Course not found!`** with status **`400`**.\
   &nbsp;
    - `Case 3:` If the user is not a course coordinator of the course specified in the body, the response sends back the message **`You are not a course coordinator for this course!`** with status **`401`**.\
     &nbsp;
    - `Case 4:` If the operation is successful, and the course gets added all of the slots in the request body, the response sends back the message **`Operation done successfully!`** with status **`200`**.\
  &nbsp;
  - `Case 5:` If any of the constraints do not apply to one of the input slots objects in the details property, an array of **`request defects`** is sent back with a detailed analysis with what was wrong with the input with status **`400`**.
     - There are two possible error messages per slot object -->
         1. `locationNotFound: true`, 
             - `locationIDOld: <id-of-old-location-not-in-database>`. [Optional].
             -  `locationIDNew: <id-of-new-location-not-in-database>`. [Optional].
             - The error message contains the first message and a **mix** of the two other messages depending on whether both locations do not exist or only one of them does not exist.
         2. `updatedSlotAlreadyExistsforOtherCourses: true, conflictingCourse: ["courseID1", "courseID2"]`.
            - This error message indicates that the slot ***after being modified*** already exists in the schedule of other courses, and therefore cannot be assigned to the course in the request body.
       3. `oldSlotDoesNotExistinCourseScedule: true`.
             - This error message that the old slot ***to be modified*** does ***not exist*** in the schedule of the course.

> Note: the second and third messages may appear together in the same error message object.
- **Example response body:**
```json
Access Denied!
```

```json
Course not found!
```

```json
You are not a course coordinator for this course!
```

```json
Operation done successfully!
```

```json
[
{
	"oldSlot": {
		"date": "2020-15-12",
		"number": 5,
		"locationID": "C7.203"
	},
	"newSlot": {
		"locationID": "C7.205"
	},
	"locationNotFound": true,
	"locationIDOld": "C7.203"
},

{
	"oldSlot": {
		"date": "2020-15-12",
		"number": 5,
		"locationID": "C7.203"
	},
	"newSlot": {
		"locationID": "C7.205"
	},
	"locationNotFound": true,
	"locationIDOld": "C7.203",
	"locationIDNew": "C7.205"
},

{
	"oldSlot": {
		"date": "2020-15-12",
		"number": 5,
		"locationID": "C7.203"
	},
	"newSlot": {
		"locationID": "C7.201"
	}
	"locationNotFound": true,
	"locationIDNew": "C3.201"
},

{
	"oldSlot": {
		"date": "2020-15-12",
		"number": 4,
		"locationID": "C7.203"
	},
	"newSlot": {
		"number": 5
	},
	"updatedSlotAlreadyExistsforOtherCourses": true,
	"conflictingCourses": [
		"CSEN703",
		"CSEN704"
	]
},

{
	"oldSlot": {
		"date": "2020-15-12",
		"number": 5,
		"locationID": "C7.203"
	},
	"newSlot": {
		"number": 4
	},
	"updatedSlotAlreadyExistsforOtherCourses": true,
	"conflictingCourses": [
		"CSEN703",
		"CSEN704"
	],
	"oldSlotDoesNotExistinCourseSchedule": true
},

{
	"oldSlot": {
		"date": "2020-15-12",
		"number": 5,
		"locationID": "C7.203"
	},
	"newSlot": {
		"date": "2020-15-12"
	},
	"oldSlotDoesNotExistinCourseSchedule": true
}
]
```
- **Changes in database:**  
   - The `schedule` array attribute of the `course` in the course table has the `oldSlot element` attributes specified in the `newSlot` changed to the new values.
***
	3(c) Delete course slot(s) in his/her course.
- **Functionality:** the user who is a Course Coordinator should be capable of deleting several slots (or one slot) from the schedule of a certain course he is a course coordinator of.  
- **Route:** /courseSlots
- **Request:** DELETE.
- **Request body:** 
   - Should be an object with two properties:
      - courseID [where courseID is a `string` like `CSEN704`].
      -  details: An Array of objects with three properties: -->
         1. date [Where date is a `string` in the form of `YYYY-MM-DD`].
         2. number [where number is the number of one of the five slots].
         3. locationID [where locationID is a `string` like `C7.203`].
    - This implies that the Course Coordinator is trying to delete from this particular course in the request body several slots where each slot is identified by the day it happens, the number of the slot and the location it resides in.
- **Example request body:**
```json
{
"courseID": "CSEN704",
"details": [
	{
	"date": "2020-12-12",
	"locationID": "C7.203",
	"number": 3
	},
	{
	"date": "2020-12-12",
	"locationID": "C7.204",
	"number": 3
	},
	{
	"date": "2020-12-14",
	"locationID": "C7.203",
	"number": 4
	}
]
}
```
- **Response body:**
   - `Case 1:` If the user is not a Course Coordinator and therefore not authorized to issue this action, the response sends back the message: **`Access Denied!`** with status **`401`**.\
   &nbsp;
   -  `Case 2:` If there is no course in the database with that courseID, the response sends back the message **`Course not found!`** with status **`400`**.\
   &nbsp;
    - `Case 3:` If the user is not a course coordinator of the course specified in the body, the response sends back the message **`You are not a course coordinator for this course!`** with status **`401`**.\
     &nbsp;
    - `Case 4:` If the operation is successful, and the course gets added all of the slots in the request body, the response sends back the message **`Operation done successfully!`** with status **`200`**.\
  &nbsp;
  - `Case 5:` If any of the constraints do not apply to one of the input slots objects in the details property, an array of **`request defects`** is sent back with a detailed analysis with what was wrong with the input with status **`400`**.
     - There are two possible error messages per slot object -->
         1. `locationNotFound: true, locationID: <id-of-location-not-in-database>`.
         2. `slotDoesNotExistinCourseSchedule: true`.
            - This error message indicates that the slot to be deleted does not exist in the schedule of the course specified (and therefore cannot be deleted).
- **Example response body:**
```json
Access Denied!
```

```json
Course not found!
```

```json
You are not a course coordinator for this course!
```

```json
Operation done successfully!
```

```json
[
{
	"slot": {
		"date": "2020-15-12",
		"number": 5,
		"locationID": "C7.203"
	},
	"locationNotFound": true,
	"locationID": "C7.203"
},
{
	"slot": {
		"date": "2020-15-12",
		"number": 5,
		"locationID": "C7.203"
	},
	"slotDoesNotExistinCourseSchedule": true
}
]
```
- **Changes in database:**  
   - The `schedule` attribute of the `course` in the course table has the slots objects specified deleted.
   - The `slots_needed` attribute of the `course` in the course table gets decremented by 1.