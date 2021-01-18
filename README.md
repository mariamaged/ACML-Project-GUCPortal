
# Advanced Computer Lab - GUCPortal
## Milestone 1
- Team 36
### Collaborators
1. Maria Maged 43-1498.
2. Monica George 43-0818.
3. Maya Ahmed 43-6655.
4. Mark Maged 43-4147 (Merged in Milestone 2).
5. Hesham Yasser 43-5646 (Merged in Milestone 2).
## Port Number
> In milestone 1, the backend ran on 3000.
 - Frontend: 3000.
 - Backend: 5000.
## Which file to run
- <u>Milestone 1:</u> run npm start.
- <u>Milestone 2:</u> cd backend then npm start, and open another terminal and cd frontend then npm start.
## 1. Sample Pages
### Login Page
![enter image description here](https://lh3.googleusercontent.com/pw/ACtC-3d8F-VoNh9mnKpGbEy1JwRhlyouFq47a9uFr4PEJ7-_sZEK0_2-jhppY8Z46kkszfhvH8QRGzEffCXwoIvr83cWXr6YkXEfFd3s_YH78lAg199ORJkXv_OWd97iZxpQGeXlJ9eh9QJgRMZbmV-FP-I6=w1006-h423-no?authuser=0)

### Homepage
![enter image description here](https://lh3.googleusercontent.com/pw/ACtC-3fQb8YrZdbVyOIez9obK0ui7w-_zDNDQfpLVVWiC2pHc1DXsVKE1FlCHBsR7H13OMZiwvJcs-vDrCRQCmil-s8mGXaf1IaFukPr6ZEgcL0HWL0GkqJCwZumii_oxHD5-w5kO6fqBM9LLXanyMzFsL6d=w1006-h476-no?authuser=0)

### Sample Course Instructor Pages - (Head of Department Viewing Teaching Assignment of Courses in His Department)
![enter image description here](https://lh3.googleusercontent.com/pw/ACtC-3d5dU5hFwKY8Jczj8SU7VmRQ4HyE3Ter1_DVgLdeuYmNm1Dc_O1tp13bXqXedDGFrjYxKsHMbkPEb8Cdcr1gkpotmuHK48APb-L-qzCUO6krz6WD3yLAfAyVTFJcqAQOJCXYDbTJvyVi_G9YPd7sMJB=w1006-h464-no?authuser=0)

### Sample Teaching Assistant Pages (Course Coordinator Updating Slots in Course He Supervises)
![enter image description here](https://lh3.googleusercontent.com/pw/ACtC-3cw2czqfx1KSKM6MHfpUtK5AULHW17-7V9MlHRHzndKl-Ew0GBYKYhLdFxPNLuEB5Y1b2MCG2bmO8osCd9uKtz0XFY5BnlXX2uXTj9FvZG5bc82nPzeeo8dw6Q5o2yHZ5HjCVEcyEJ4lN6_SOnc9odG=w1007-h444-no?authuser=0)

### Sample HR Pages
![enter image description here](https://lh3.googleusercontent.com/pw/ACtC-3fF-O1tsqSpmISdDHPHnhDCsoTSYhijxnf338QN_jt8okWgYojLJUrwVgA9UxjFzXjRhrO92tI8QkiO8pexhE-1huK37kNWkWz9TbuDV0TjkYR20oDO4_WwdvKkjdEE810_OoeV-GmSh2KyzB31pEDg=w1006-h440-no?authuser=0)

### Sample General Pages
	Schedule
![enter image description here](https://lh3.googleusercontent.com/pw/ACtC-3dTdIRDbHxho3zHAk77aghPzLQrkXzc1npqNnBgDSA5LJhYuUPsb2I5bGdFmQWk4vPKbFG9cbS1lUuJ9DlTPw1R3xty_LSRbuz4iU-ggD0Ro5w5lTg-9qg1nGJ0BtS-OjXIkJ7xMD-WdPP7LPOl7mVk=w1006-h463-no?authuser=0)

	Profile
![enter image description here](https://lh3.googleusercontent.com/pw/ACtC-3eHUrxeGDVYD8cChS1AUOEhCX6VoYfxpgUqlV1McdIFsGPNHd22nBMqyA0IDwIZ0IZrwEiJsxBuHOJ1TrjhL58-NSUG0mL0vmNMiarNBWmwpvQFh0YsIDegLEyBJP4BK9JyfCfl-I5-ZGS5rmsjFkF4=w1006-h414-no?authuser=0)

	Submitted Requests
![enter image description here](https://lh3.googleusercontent.com/pw/ACtC-3cmxYbGlepQth17sO9b6gkOsHGSJOwoNZlcIweCGPKLcHZ7fX0tONsh2NQEQUWvrL3zl1bAwLJ57TZP38I087OpAedf-RaFZ6jPdK7Aam0Inhu9_4FN2T6_AtK3SvxX5eMKKfZSID6SKFbEXHNsSOU_=w1006-h443-no?authuser=0)

## 2. GUC Staff Members Functionalities
### Any GUC staff member can do the following:
	1. Log in with a unique email and a password.
 
 - **Functionality:** The user should be able to log in.
 - **Route:**/staff/login
 - **Request Type:** POST.
 - **Request body:** user must input
   1. email.
   2. password.
 -   **Example request body:**
```json 
{ 
	"email":"farida@gmail.com",
	"password":"asdas"
}
```
 - **Response body:**  
- Case 1: If the user does not enter an email the response sends back the message :
`"Please enter a valid email."`
 - Case  2: If the user does not enter password the response sends back the message:
`` "Please enter a valid password."``
 - Case  3: If the user submits an email that is not saved in the system ,the response sends back the message:
``` "This user is not registered."```
 - Case  4: If the user enters a  valid email but wrong password, the response sends back the message:
```"Please enter correct password."```
>
 - Case 5: If the user is logging in for the first time, the response send back the token and the  message
``` "Please enter new password."```
> **To use the token, I copy and paste in manually in the header in postman with key=x-auth-token and the value= token outputted upon login**.
 
  - Case 6: If the user is successfully logged in, the response returns the token and the message
``` "User logged in successfully"```
   
> **To use the token, I copy and paste in manually in the header in postman with key=x-auth-token and the value= token outputted upon login**
***
	 1(b) Enter new password after first login.
 
- **Functionality:** The user should be able to change his 123456 password to a new one when first logging in.
- **Route:**/staff/enterNewPass
- **Request:** PUT.
- **Request body:** User must input
  1. password
  2. password check (I do not ask for old password since I have another  route that changes password normally without being prompted to it on first login).
 -   **Example request body:**
```json
{ 
	"password":"farida",
	"passCheck":"farida",
}
```
 - **Response body:**
- Case 1: if the user does not enter a password the response sends back the message:
```"Please enter a valid password."```
- Case  2: if the user does not enter password check the response sends back the message:
``` "Please enter the password check."```
- Case  3: if the user enters different password and password check, the response sends back the message:
``` "Passwords should match."```
- Case  4: if the user enters a  valid password and password check, the response sends back the message:
```"Password changed successfully."```
- Case 4: if there was an error in the system and could not save new password, the response send back the token and the message:
``` "Error. Please try again""```
-  **Result in database:**
	- Password of this user id updated.
 ***
	 3. View their profile.
 
- **Functionality:** The user should be able to view his profile information.
- **Route:**/staff/profile
- **Request Type:** GET.
- **Request body:** empty
-  **Example of Academic member response body:**
```json
{
"name": "berlant",
"id": "ac-26565",
"email": "berlant@gmail.com",
"office": "c7.101",
"staff_type": "Academic Member",
"day_off": "Monday",
"department": "MET",
"faculty": "engineering",
"type": "Course Instructor"
}
``` 
Example of HR response body
```json
{
"name": "hana",
"id": "2",
"email": "hana@gmail.com",
"office": "",
"staff_type": "HR",
"day_off": "Saturday"
}
```
***
	4. Update their profile except for the id and the name. 
> Academic members can’t update their salary, faculty and department.
 
 - **Functionality:**  the user should be able to update their profile.
 - **Route:**/staff/updateProfile
 - **Request Type:** PUT.
  - **Request body:** 
    - email
    - office
- **Example request body:**
```json
{
 "email":"nancy3@gmail.com",
 "office":"c1.101"
}
``` 
 - **Response body:**
 - Case 1: if the user enter a new ID, the response sends back the message:
```"Cannot change ID."```
- Case  2: if the user enter new name, the response sends back the message:
``` "Cannot change name."```
 - Case  3: if the user enters a new password, the response sends back the message:
``` "Cannot change password.Please make a reset pasword request."```
 - Case  4: if the user enters a new day-off, the response sends back the message:
``` "Must make a request to change day-off."```
    
- Case  5: if the user enters a new office that is not registered in the database, the response sends back the message:
``` "This office does not exist.Please enter a valid office ID."```
- Case  6: if an academic member enters new department, the response sends back the message:
``` "Cannot change department."```
- Case  7: if an academic member enters new faculty, the response sends back the message:
``` "Cannot change faculty."```
- Case  8: if an academic member enters new salary, the response sends back the message:
``` "Cannot change salary."```
- Case  9: if an academic member enters new email that already exists in the database, the response sends back the message:
``` "This email is already registered. Please enter a new one."```
- Case  10: if an academic member enters new unique email and maybe new office that exists  the response sends back the message:
``` "Profile updated successfully"```  
***
	5. Reset their passwords.
 - **Functionality:** the user should be able to reset their passwords.
 - **Route:**/staff/resetPassword
 - **Request :** PUT.
  - **Request body:** 
    - old password (oldPass)
    - new password (newPass)
    - check password (checkPass)
- **Example request body:**
```json
{
"oldPass":"nancy",
"newPass":"nancy2",
"checkPass":"nancy2"
}
``` 
 - **Response body:**  
 - Case 1: if the user does not enter old password, the response sends back the message:
```"Please enter old password."```
 - Case  2: if the user enters incorrect old password,  the response sends back the message:
``` "Please enter correct old password"```
- Case  3: if the user does not enter a new password, the response sends back the message:
``` "Please enter valid new password."```     
 - Case  4: if the user does not enter password check, the response sends back the message:
``` "Please enter password check."```     
  - Case  5: if the user enters a different password and password check, the response sends back the message:
``` "Passwords do not match"```     
  - Case  6: else if all conditions are met, the response sends back the message:
    ``` "Password updated successfully."```     
 - Case  7: if there is a problem with the server, the response sends back the message:
``` "An error occured. Please try again."```                   
  -   **Result in database:**
      - Password of this user id updated.
  ***    
	6. Sign in.
 
- **Functionality:** the user should be able to sign in.
- **Route:**/staff/signin
- **Request:** PUT.
- **Request body:** empty
- **Response body:** 
- Case 1: if the user is already signed in, response sends back the message:
```"This user is already signed in"```
- Case  2: if the user signs in successfully, the response sends back the message:
``` "Succesfully signed in."```
 
  - Case  3: if there is an error in the server, the response sends back the message:
``` "An error occured. Please try again."```     
 ****
	7. Sign out.
 
- **Functionality:** the user should be able to sign in.
- **Route:**/staff/signout
- **Request Type:** PUT.
- **Request body:** empty
- **Response body:** 
 - Case 1: if the user is trying to sign out without previously signing in, the response sends back the message:
```"Cannot sign out without prior signin."```
- Case  2: if the user who is already signed out is trying to sign out again, the response sends back the message:
``` "This user has already signed out."```
 
- Case  3: successful sign out, the response sends back the message:
    ``` "Succesffuly signed out."``` 
- Case  4: an error occurred with the server, the response sends back the message:
``` "An error occured please try again."```   
  -   **Result in database:**
      - A new record is added to the user's attendance with his sign in time and date and sign out time and date.
       - The hours spent between his last sign out and sign in is calculated and accumulated to his spent monthly hours and minutes.
       - These hours are also accumulated to his daily hours and minutes and his extra hours, minutes and missing hours and minutes are recalculated. 
> **I have used moment library to help manipulate dates and times.** 
> > **In mongo the timestamp of the date may appear as**
    **`"2020-12-18T22:00:00.000+00:00"`**.
>   -   **However, when it is formatted and printed**, console.log(moment("2020-12-18T22:00:00.000+00:00").format("YYYY-MM-DD")), **the result would be** **```2020-12-19```**.
   
***
	8. View all their attendance records, or they can specify exactly which month to view.
 - **Functionality:** the user should be able to view the records of all the days they have ATTENDED, or they can specify exactly which month to view. (I did not display all days since in missing days it was stated that days where the user is absent do not have attendance records)
- **Route:**/staff/attendanceRecords
- **Request :** GET.
- **Request body:** 
     - month (optional).
- **Example request body:** 
```json
{
"month":"1"
}
```
- **Response body:**    
 - Case 1: if the user anters an incorrect month number response sends back the message :
```"Please enter correct month."```
- Case  2: if there is currently no attendance records for this user yet, the response sends back the message:
``` "There are no attendance records to display.""```
- Case  3: displays available attendance records 
- **Response Body example:**
```json
Date: 2020-12-25
Attended: true
Hours: 0
Minutes: 0
Date: 2020-12-24
Attended: true
Hours: 1
Minutes: 35
Date: 2020-12-22
Attended: false
Hours: 0
Minutes: 0
```
 - Example for attendance for a certain month:
```json
{
"attendance": [{
"date": "2021-01-02",
"attended": true,
"last_signIn": "16:19",
"last_signOut": "16:19",
"hours": 0,
"minutes": 0
}]
}
```
***
	9. View if they have missing days.
	
 - **Functionality:** :the user should be able to view if they have missing days.
 - **Route:**/staff/missingDays
 - **Request Type:** GET
  - **Request body:** empty
  - **Response body:** 
 - Case 1: returns an array of missing days dates (unattended days in this month up to today) or an empty array if there are no missing days.
  ```
  [
"2020-11-11",
"2020-11-12",
"2020-11-14",
"2020-11-15
]
```
***
	10 .View if they have missing hours or extra hours.
 
 - **Functionality:** :the user should be able to view if they have missing hours or extra hours.
 - **Route:**/staff/missingDays
 - **Request Type:** GET
  - **Request body:** empty
  - **Response body:** 
     - Case 1: returns missing hours, missing minutes, extra hours and extra minutes spent up to this day.
````
{
"missingHours": 6,
"missingMinutes": 49,
"extraHours": 0,
"extraMinutes": 0
}
`````
## 3. HR Functionalities
3. HR Functionalities:
 Add location:
o Functionality: adds a location (lab, office, tutorial, or lecture hall).
o Route: /HR/Location
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
o Route: /HR/Location
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
o Route: /HR/Location
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
o Route: /HR/Faculty
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
o Route: /HR/Faculty
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
o Route: /HR/Faculty
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
o Route: /HR/department
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
o Route: /HR/department
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
o Route: /HR/department
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
o Route: /HR/course
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
o Route: /HR/course
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
o Route: /HR/course
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
o Route: /HR/staffmember
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
o Route: /HR/staffmember
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
o Route: /HR/staffmember
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
o Route: /HR/addrecord
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
o Route: /HR/attendance
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
o Route: /HR/updatesalary
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
o Route: /HR/viewMissinghours
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
o Route: /HR/viewMissingdays
o Request type: get()
o Request body: {}
o Response body: in case the user was not authorized (not HR) the
response will be “Access Denied”. Otherwise the response is the
array of members.
o Result in database: No change will occur to the database. The data
will be only retrieved from it with making any changes to it.
## 4.1 HOD Functionalities
### Any HOD can do the following
	 1(a) Assign a course instructor for each course in his department.
- **Functionality:** the user who is an HOD should be capable of assigning certain courses under his department to certain `course instructors` who are under his department as well.
- **Route:** /assignCoursetoCourseInstructor
- **Request type:** POST.
- **Request body:**
   - Should be an object with two properties: -->
      1. courseID [where courseID is a `string` like `CSEN704`].
      2. academicMemberID [where member is the staff member id as a `string` like `ac-12`].
    - This implies that the HOD is trying to assign the academic member in the object the course referred to in the same object.
- **Example request body:**
```json
{
"courseID": "CSEN703",
"academicMemberID": "ac-1"
}
```
- **Response body:**
   - `Case 1:` If the user is not an HOD and therefore not authorized to issue this action, the response sends back the message: **`Access Denied!`** with status **`401`**.\
   &nbsp;
   - `Case 2:` If the operation is successful, and each of the individual course instructors gets assigned to their respective course, the response sends back the message **`Operation done successfully!`** with status **`200`**.\

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
	2 (a) View all the staff in his/her department per course along with their profiles.
- **Functionality:**
    - The user who is HOD should be capable of viewing the profiles of staff members teaching a certain course that is under his department.
- **Route:** /HOD/viewDepartmentStaffPerCourse/:courseID
    - Where courseID is the id of the course as a `string`, like `CSEN704`.
- **Request:** GET.
- **Request body:** empty.
- **Example request endpoint:** GET /HOD/viewDepartmentStaffPerCourse/CSEN704
- **Response body:** 
    - `Case 1 (normal case with status 200):` Should be an array of objects with ***9 properties:***
       - name: where name is the `name` of the academic member as a `string`, like `Maria`.
       - email: where email is the `email` as a `string`.
       - id: where id is a `string` like `ac-11`.
       - salary: where salary is a `number`.
       - office: where office is the `id` of the office as a `string`, like `C7.203`.
       - gender.
       - department: where department is the name of the department as a `string`.
       - faculty: where faculty is the `name` of the faculty as a `string`.
       - academicType: either `Course Instructor` or `Teaching Assistant`.\
  &nbsp;
  - `Case 2:` If the user is not a HOD, and is therefore not authorized to issue this action, the response sends back the message **`Access Denied`** with status **`401`**.\
  &nbsp;
  - `Case 3:` If the course with an id like that does not exist in the database, the response sends back the message **`Course not found!`** with status **`400`**.\
  &nbsp;
  - `Case 4:` If the course belongs to a different department than the HOD, then the response sends back the message **`Course not under your department!`** with status **`401`**.
 - **Example response body:**
```json
Access Denied!
```
```json
Course not found!
```
```json
Course not under your department!
```
```json
[
{
"name": "Maria Maged",
"email": "maria@gmail.com",
"id": "ac-12",
"salary": 2000,
"office": "C7.203",
"gender": "Female",
"department": "Computer Science",
"faculty": "Engineering",
"academicType": "Teaching Assistant"
},
{
"name": "Monica George",
"email": "monica@gmail.com",
"id": "ac-13",
"salary": 3000,
"office": "C7.203",
"gender": "Female",
"department": "Computer Science",
"faculty": "Engineering",
"academicType": "Course Instructor"
},
{
"name": "Maya Ahmed",
"email": "maya@gmail.com",
"id": "ac-11",
"salary": 1000,
"office": "C7.203",
"gender": "Female",
"department": "Computer Science",
"faculty": "Engineering",
"academicType": "Course Instructor"
}
]
```
***
	2 (b) View all the staff in his/her department for each course along with their profiles.
- **Functionality:**
   - The user who is HOD should be capable of viewing the profiles of staff members teaching each course belonging to his department.
- **Route:** /HOD/viewDepartmentStaffAllCourses
- **Request:** GET.
- **Request body:** empty.
- **Response body:**
   - `Case 1 (normal case with status 200):` Should be an array of objects with ***three properties***, where each object represents a particular course:
      1. courseID: where courseID is the ID of the course as a `string`, like `CSEN704`.
      2. courseName: where courseName is the name of the course, like `Advanced Computer Lab`.
      3. academicStaff: which is an array of objects containing the same 9 properties described in route 2(b).
  - `Case 2:` If the user is not HOD, and is therefore not authorized to issue this action, the response sends back the message **`Access Denied!`** with status **`401`**.
- **Example response body:**
```json
Access Denied!
```
```json
[
{
"courseID": "CSEN704",
"courseName": "Advanced Computer Lab",
"academicStaff": [
{
"name": "Maria Maged",
"email": "maria@gmail.com",
"id": "ac-12",
"salary": 2000,
"office": "C7.203",
"gender": "Female",
"department": "Computer Science",
"faculty": "Engineering",
"academicType": "Course Instructor"
},
{
"name": "Monica George",
"email": "monica@gmail.com",
"id": "ac-13",
"salary": 3000,
"office": "C7.203",
"gender": "Female",
"department": "Computer Science",
"faculty": "Engineering",
"academicType": "Course Instructor"
},
{
"name": "Maya Ahmed",
"email": "maya@gmail.com",
"id": "ac-11",
"salary": 1000,
"office": "C7.203",
"gender": "Female",
"department": "Computer Science",
"faculty": "Engineering",
"academicType": "Course Instructor"
}]
},
{
"courseID": "CSEN703",
"courseName": "Software Engineering",
"academicStaff": [
{
"name": "Maria Maged",
"email": "maria@gmail.com",
"id": "ac-12",
"salary": 2000,
"office": "C7.203",
"gender": "Female",
"department": "Computer Science",
"faculty": "Engineering",
"academicType": "Course Instructor"
}
]
}
]
```
***
	2 (c) View all the staff in his/her department.
- **Functionality:**
   - The user who is HOD should be capable of viewing the profiles of all the staff under his department.
- **Route:** /HOD/viewDepartmentStaff
- **Request:** GET.
- **Request body:** empty.
- **Response body:**
    - `Case 1 (normal case with status 200):` Should be an array of objects with ***9 properties*** that were described in 2(a), where each object represents an academic member.
    - `Case 2:` If the user is not HOD, and is therefore not authorized to issue this action, the response sends back the message **`Access Denied!`** with status **`401`**.
- **Example response body:**
```json
Access Denied!
```
```json
[
{
"name": "Maria Maged",
"email": "maria@gmail.com",
"id": "ac-12",
"salary": 2000,
"office": "C7.203",
"gender": "Female",
"department": "Computer Science",
"faculty": "Engineering",
"academicType": "Teaching Assistant"
},
{
"name": "Monica George",
"email": "monica@gmail.com",
"id": "ac-13",
"salary": 3000,
"office": "C7.203",
"gender": "Female",
"department": "Computer Science",
"faculty": "Engineering",
"academicType": "Course Instructor"
},
{
"name": "Maya Ahmed",
"email": "maya@gmail.com",
"id": "ac-11",
"salary": 1000,
"office": "C7.203",
"gender": "Female",
"department": "Computer Science",
"faculty": "Engineering",
"academicType": "Course Instructor"
}
]
```
***
	3 (a) View the day off of a single staff in his/her department.
- **Functionality:**
   - The user who is HOD should be capable of viewing the day off of a specific academic member under his department.
- **Route:** /HOD/viewDepartmentStaffMemberDayOff/:memberID
   - Where memberID is the id of the academic member as a `string`, like `ac-1`.
- **Request:** GET.
- **Request body:** empty.
- **Example request endpoint:** GET /HOD/viewDepartmentStaffMemberDayOff/ac-11
- **Response body:**
   - `Case 1 (Normal case with status 200):` Should be a single object with ***two properties***:
       1. academicStaffMemberName, where academicStaffMemberName is the `name` of the academic member as a `string`, like `Maria`.
       2. dayOff, where dayOff is one of the day weeks ***except*** `Friday`.\
       &nbsp;
    - `Case 2:` If the user is not a HOD, and is therefore not authorized to issue this action, the response sends back the message **`Access Denied!`** with the status **`401`**.\
    &nbsp;
    - `Case 3:` If the id inserted does not belong to an academic member in the database, the response sends back the message **`Academic member not found!`** with status **`400`**.\
    &nbsp;
     - `Case 4:` If the academic member belongs to a different department than the HOD's department, the response sends back the message **`Staff member not in your department!`** with status **`401`**.
- **Response body example:**
```json
Access Denied!
```
```json
Academic member not found!
```
```json
Staff member not in your department!
```
```json
{
"academicStaffMemberName": "Maria",
"dayOff": "Tuesday"
}
```
***
	3(b) View the day off of all the staff in his department.
- **Functionality:**
   - The user who is a HOD should be capable of viewing the day off of all the academic members under his department.
- **Route:** /HOD/viewDepartmentStaffDayOff
- **Request:** GET.
- **Request body:** empty.
- **Response body:** 
   - `Case 1 (Normal case with status 200):` Should be an array of objects with ***three properties***:
      1. academicStaffMemberID, where academicStaffMemberID is the `ID` of the academic member as a `string`, like `ac-11`.
      2. academicStaffMemberName, where academicStaffMemberName is the `name` of the academic member as a `string`, like `Maria`.
      3. dayOff, where dayOff is one of the week days ***except*** `Friday`.\
      &nbsp;
   - `Case 2:` If the user is not a HOD, and is therefore not authorized to issue this action, the response sends back the message **`Access Denied!`** with status **`401`**.
- **Example response body:**
```json
Access Denied!
```
```json
[
{
	"academicStaffMemberID": "ac-11",
	"academicStaffMemberName": "Maria",
	"dayOff": "Monday"
},
{
	"academicStaffMemberID": "ac-12",
	"academicStaffMemberName": "Monica",
	"dayOff": "Tuesday"
},
{
	"academicStaffMemberID": "ac-13",
	"academicStaffMemberName": "Maya",
	"dayOff": "Wednesday"
}
]
```
***
	(4) View all the requests “change day off/leave” sent by staff members in his/her department.
- **Functionality:**
   - The user who is HOD should be able to view all the requests sent to him by staff members in his department.
- **Route:** /HOD/viewDayOffLeaveRequests
- **Request:** GET.
- **Request body:** empty.
- **Response body:**
   - `Case 1: (normal case)` If the user is a HOD who is authorized to issue this action, the response sends back an object with ***two properties*** and status **`200`**-->
     1. dayOffRequests.
     2. leaveRequest.\
   &nbsp;
   -  Each of them is an array of objects corresponding to each request, where the properties ***vary*** according to the ***type*** of the request.
       - **`Common properties`** -->  
          - requestID: where requestID is the id as a `string` with the type of the request as the prefix. It gets incremented whenever another request with the same type gets submitted. For example, `MaternityLeave-1`.
           - requestType: where requestType is a `string` of one of the 6 leave/day off requests.
           - state: where state is a `string` indicating either `Pending`, `Accepted`, `Rejected`.
           - submission_date: where submission_date is a `date` shown in the **`YYYY-MM-D`** format indicating the day at which the request happened.
           - sentByID: ID of the sender as a `string` like `ac-11`.
           - sentByName: name of the sender as a `string` like `Maria`.
           - HODRejectionReason (Optional): if the request was rejected, then show the reason of rejection.\
           &nbsp;
       - **`Change Day off`** -->
            -  newDayOff: where newDayOff is the name of the weekday which the requester wants as his/her new day off.
            - reason (Optional): where reason is a `string` indicating the reason for applying for this request.\
              &nbsp;
        - **`Maternity Leave`** -->
            - maternityDoc: where maternityDoc is a `string` proving maternity condition.
            - reason (Optional): where reason is a `string` indicating the reason for applying for this request.\
           &nbsp;
         - **`Sick Leave`** --> 
              - medicalDoc: where medicalDoc is a document proving injury/sickness.
              - sickDay: where sickDay is a `date` shown in the format **`YYYY-MM-DD`** at which the staff member got sick.
              - reason (Optional): where reason is a `string` indicating the reason for applying for this request. \
     &nbsp;
          - **`Accidental Leave`** -->
              - accidentDate: where accidentDate is a `date` shown in the format **`YYYY-MM-DD`** at which the staff member missed a teaching day for some abrupt event.
              - reason (Optional): where reason is a `string` indicating the reason for applying for this request.\
              &nbsp;
           - **`Compensation Leave`** -->
             - missedDate: where missedDate is a `date` shown in the format **`YYYY-MM-DD`** at which the staff member missed a teaching day and wants to compensate it for some other day.
             - reason (Optional): where reason is a `string` indicating the reason for applying for this request.\
     &nbsp;
       - **`Annual Leave`** -->
         - slotDate: where slotDate is a `date` shown in the format **`YYYY-MM-DD`** of the slot the staff wants to replace with other staff member.
         - slotNum: where slotNum is a `number` indicating one of the five slots.
         - slotLoc: where slotLoc is a `string` showing the `id` of the location of the slot, like `C7.203`.
         - replacementStaffID: where replacementStaffID is the `id` of the staff member as a `string`, like `ac-11`.
         - replacementStaffName: where replacementStaffName is the `name` of the staff member as a `string` like `Maria`.
         - reason (Optional): where reason is a `string` indicating the reason for applying for this request.
  - `Case 2:` If the user is not a HOD, and therefore not authorized to issue this action, the response sends back the message **`Access Denied!`** with status **`401`**.
- **Example response body:**
```json
Access Denied!
```
```json
{
"dayOffRequests": [
{
"requestID": "ChangeDayOff-1",
"requestType": "Change Day off",
"state": "Pending",
"submission_date": "2020-12-24",
"sentByID": "ac-11",
"sentByName": "Manal Mounir",
"newDayOff": "Monday",
"reason": "I want to spend time saturday with family"
}
],
"leaveRequests": [
{
"requestID": "SickLeave-1",
"requestType": "Sick Leave",
"state": "Rejected",
"submission_date": "2020-12-24",
"sentByID": "ac-13",
"sentByName": "Monica George",
"HODRejectionReason": "A very mild flu.",
"medicalDoc": "ABC",
"sickDay": "2020-12-23",
"reason": "I have a flu."
},
{
"requestID": "MaternityLeave-1",
"requestType": "Maternity Leave",
"state": "Pending",
"submission_date": "2020-12-24",
"sentByID": "ac-13",
"sentByName": "Monica George",
"maternityDoc": "ABCC"
}
]
}
```
***
	7(a) View the coverage of a course in his/her department.
- **Functionality:** 
   - The user who is a HOD should be capable of viewing the course coverage (the percentage of slots with academic members assigned to them compared to the total number of slots inserted for a particular course under his department).
- **Route:** /HOD/courseCoverage/:courseID
   - Where courseID is a the id of the course as a `string` like `CSEN704`.
- **Request:** GET.
- **Request body:** empty.
- **Example request endpoint:** GET /HOD/courseCoverage/CSEN704
- **Response body:**
   - `Case 1:` If the user is not a HOD and therefore not authorized to issue this action, the response sends back the message: **`Access Denied!`** with status **`401`**.\
   &nbsp;
   - `Case 2:` If the course does not exist in the database, the response sends back the message **`Course does not exist!`** with status **`400`**.\
  &nbsp;
    - `Case 3:` If the course is not under the HOD department, the response sends the message **`Course not under your department!`** with status **`401`**.\
    &nbsp;
    - `Case 4:` If there were no slots inserted for the course, the response sends back the message **`Course does not have any slots for now!`** with status **`400`**.\
    &nbsp;
    - `Case 5:` If the course coverage was retrieved, the response sends back the message **`Course coverage is equal to: <number-calculated-as slots_covered/slots_need * 100>%`**.
- **Example response body:**
```json
Access Denied!
```
```json
Course does not exist!
```
```json
Course not under your department!
```
```json
Course does not have any slots for now!
```
```json
Course coverage is equal to: 50%
```
***
	7(b) View the coverage of all courses in his/her department. 
- **Functionality:** the user who is a HOD should be capable of viewing the course coverage of all courses in his department.
- **Route:** /HOD/coursesCoverage
- **Request:** GET.
- **Request body:** empty.
- **Response body:** 
   - `Case 1 (normal case):` If the user is an HOD and therefore authorized to issue this action, the response sent is of status **`200`** and is an array of objects with ***two properties***.
      1. The first property is **`courseID`** --> where courseID is the id of the course as a `string` like `CSEN704`.
      2. The second property is either:
          - **`courseCoverage`** --> where courseCoverage is a `percentage`.
          - **`courseDoesNotHaveSlotsAssigned`** --> which is equal to true if the property exists indicating that the course has no slots assigned to it (and therefore calculating course coverage would cause division by 0).
  - `Case 2:` If the user is not HOD, and therefore not authorized to issue this action, the response sends the message **`Access Denied!`** with status **`401`**.
- **Example response body:**
```json
Access Denied!
```
```json
[
{
"courseID": "CSEN704",
"courseCoverage": 50
},
{
"courseID": "CSEN703",
"courseDoesNotHaveSlotsAssigned": true
}
]
```
  ***
	  (8) View teaching assignments (which staff members teach which slots) of all courses offered by his department.
- **Functionality:** 
    - The user who is HOD should be able to view, for **`each course under his department`**, a detailed analysis of the slots assigned to each of the academic members assigned to a course.
    -  Even if one of the academic member assigned to a course has not been assigned any slots yet, it can be seen that his slots array is empty.
- **Route:** /HOD/teachingAssignmentAllCourses
- **Request:** GET.
- **Request body:** empty.
-  **Response body:**
    - `Case 1: (normal case with status 200):` Should be an array of objects with ***3 properties*** where each object represents details about one course.
       - courseID: the id of the course as a `string`, like `CSEN704`.
       - courseName: the name of the course as a `string`, like `Advanced Computer Lab`.
       - oneCourseTeachingAssignment: an array of objects representing the teaching assignments.\
       &nbsp;
       - Properties under oneCourseTeachingAssignment:
           - staffID: id of the academic member as a `string` like `ac-11`.
           - staffName: name of the academic member as a `string`, like `Maria`.
           - slotsTaughtbyStaff: an array of objects representing the respective slots that the academic member teaches.\
      &nbsp;
      - Properties under slotsTaughtbyStaff:
           - number: number of the slot from the 5 slots.
           - day: one of the week days.
           - date: in the form of `YYYY-MM-DD`.
           - location: id of the location as a `string` like `C7.203`.
           - isReplaced: boolean indicating whether this slot is the original slot or replaced by an annual leave request.
   - `Case 2:` If the user is not HOD, and is therefore not authorized to issue this action, the response sends back the message **`Access Denied!`** with status **`401`**.
- **Example response body:**
```json
Access Denied
```
```json
[
{
"courseID": "CSEN704",
"courseName": "Advanced Computer Lab",
"oneCourseTeachingAssignment": [
	{
	"staffID": "ac-12",
	"staffName": "Maria Maged",
	"slotsTaughtbyStaff": []
	},
	{
	"staffID": "ac-13",
	"staffName": "Monica George",
	"slotsTaughtbyStaff": []
	},
	{
	"staffID": "ac-11",
	"staffName": "Maya Ahmed",
	"slotsTaughtbyStaff": [
		{	
		"date": "2020-12-15",
		"day": "Tuesday",
		"number": 4,
		"location": "C7.203",
		"isReplaced": false
		}
	]
	}
]
},
{
"courseID": "CSEN703",
"courseName": "Software Engineering",
"oneCourseTeachingAssignment": [
	{
	"staffID": "ac-12",
	"staffName": "Maria Maged",
	"slotsTaughtbyStaff": [	
		{
		"date": "2020-12-15",
		"day": "Tuesday",
		"number": 2,
		"location": "C7.203",
		"isReplaced": false	
		}	
	]
	}
]
}
]
```
## 4.2 Course Instructor
### Any course instructor can do the following:
	2 (a) View the slots’ assignment of all courses he/she is assigned to.
- **Functionality:** 
    - The user who is a course instructor should be able to view, for **`each course he is assigned to`**, a detailed analysis of the slots assigned to each of the academic members assigned to the course.
    -  Even if one of the academic member assigned to a course has not been assigned any slots yet, it can be seen that his slots array is empty.
- **Route:** /instructor/slotsAssignment
- **Request:** GET.
- **Request body:** empty.
-  **Response body:**
    - `Case 1: (normal case with status 200):` Should be an object with property **msg** that has an array of objects with ***3 properties*** where each object represents details about one course.
       - courseID: the id of the course as a `string`, like `CSEN704`.
       - courseName: the name of the course as a `string`, like `Advanced Computer Lab`.
       - oneCourseTeachingAssignment: an array of objects representing the teaching assignments.\
       &nbsp;
       - Properties under oneCourseTeachingAssignment:
           - staffID: id of the academic member as a `string` like `ac-11`.
           - staffName: name of the academic member as a `string`, like `Maria`.
           - slotsTaughtbyStaff: an array of objects representing the respective slots that the academic member teaches.\
      &nbsp;
      - Properties under slotsTaughtbyStaff:
           - number: number of the slot from the 5 slots.
           - day: one of the week days.
           - date: in the form of `YYYY-MM-DD`.
           - location: id of the location as a `string` like `C7.203`.
           - isReplaced: boolean indicating whether this slot is the original slot or replaced by an annual leave request.
   - `Case 2:` If the user is not a course instructor, and is therefore not authorized to issue this action, the response sends back the message **`Access Denied!`** with status **`401`**.
   - `Case 3:` If there is a server error, the response sends back the error message with status **`500`**.
   - `Case 4:` If the token does not belong to any staff member, or academic member in the database, the response sends back the message `Something went wrong` with status **`400`**.
- **Example response body:**
```json
{msg: 'Access Denied'}
```
```json
{msg: 'Something went wrong'}
```
```json
{error: err.message}
```

```json
{
msg: [
{
"courseID": "CSEN704",
"courseName": "Advanced Computer Lab",
"oneCourseTeachingAssignment": [
	{
	"staffID": "ac-12",
	"staffName": "Maria Maged",
	"slotsTaughtbyStaff": []
	},
	{
	"staffID": "ac-13",
	"staffName": "Monica George",
	"slotsTaughtbyStaff": []
	},
	{
	"staffID": "ac-11",
	"staffName": "Maya Ahmed",
	"slotsTaughtbyStaff": [
		{	
		"date": "2020-12-15",
		"day": "Tuesday",
		"number": 4,
		"location": "C7.203",
		"isReplaced": false
		}
	]
	}
]
},
{
"courseID": "CSEN703",
"courseName": "Software Engineering",
"oneCourseTeachingAssignment": [
	{
	"staffID": "ac-12",
	"staffName": "Maria Maged",
	"slotsTaughtbyStaff": [	
		{
		"date": "2020-12-15",
		"day": "Tuesday",
		"number": 2,
		"location": "C7.203",
		"isReplaced": false	
		}	
	]
	}
]
}
]
}
```
***
	2 (b) View the slots’ assignment of a particular course he/she is assigned to.
- Functionality:
    - The user who is a course instructor should be able to view, for **`a particular course he is assigned to`**, a detailed analysis of the slots assigned to each of the academic members assigned to the course.
    -  Even if one of the academic member assigned to a course has not been assigned any slots yet, it can be seen that his slots array is empty.
- **Route:** /instructor/slotsAssignment/:courseID
- **Request:** GET.
- **Request body:** empty.
- **Response body:**
   - `Case 1 (normal case with status 200):` 
     - Should be an object with property **msg** which is assigned an object where the object has ***three properties***:
        1. courseID --> the id of the course as a `String` like `CSEN704`.
        2. courseName --> the name of the course as a string like `Advanced Computer Lab`.
        3. oneCourseTeachingAssignment --> an ***array*** of teaching assignment objects for each individual academic member assigned to that course.\
        &nbsp;
         - Properties under oneCourseTeachingAssignment:
           - staffID: id of the academic member as a `string` like `ac-11`.
           - staffName: name of the academic member as a `string`, like `Maria`.
           - slotsTaughtbyStaff: an array of objects representing the respective slots that the academic member teaches.\
      &nbsp;
        - Properties under slotsTaughtbyStaff:
           - number: number of the slot from the 5 slots.
           - day: one of the week days.
           - date: in the form of `YYYY-MM-DD`.
           - location: id of the location as a `string` like `C7.203`.
           - isReplaced: boolean indicating whether this slot is the original slot or replaced by an annual leave request.
   - `Case 2:` If the user is not a course instructor and therefore not authorized to issue this action, the response sends back the message `Access Denied` with status **`401`**.
   - `Case 3:` If there is a server error, the response sends back the error message with status **`500`**.
   - `Case 4:` If the token does not belong to any staff member, or academic member in the database, the response sends back the message `Something went wrong` with status **`400`**.
   - `Case 5:` If the course does not exist, the response sends the message `Course does not exist!` with status **`400`**.
   - `Case 6:` If the course instructor is not assigned to this course, the response sends back the message `You are not assigned to this course!` with status **`403`**.
- **Example response body:**
```json
{error: err.message}
```

```json
{msg: 'Access denied'}
```

```json
{msg: 'Something went wrong'}
```

```json
{msg: 'Course does not exist!'}
```

```json
{msg: 'You are not assigned to this course!'}
```

```json
{
"msg": {
	"courseID": "CSEN704",
	"courseName": "Advanced Computer Lab",
	"oneCourseTeachingAssignment": [
		{
			"staffID": "ac-1",
			"staffName": "Maya Ahmed",
			"slotsTaughtbyStaff": [
				{
				"date": "2021-01-17",
				"day": "Sunday",
				"number": 5,
				"location": "C7.203",
				"isReplaced": false
				},

				{
				"date": "2021-01-24",
				"day": "Sunday",
				"number": 5,
				"location": "C7.203",
				"isReplaced": false
				}]
},

			{
			"staffID": "ac-2",
			"staffName": "Maria Maged",
			"slotsTaughtbyStaff": [
				{
					"date": "2021-01-18",
					"day": "Monday",
					"number": 4,
					"location": "C7.203",
					"isReplaced": false
				},

				{
				"date": "2021-01-19",
				"day": "Tuesday",
				"number": 3,
				"location": "C7.203",
				"isReplaced": false
				},

				{
				"date": "2021-01-20",
				"day": "Wednesday",
				"number": 2,
				"location": "C7.203",
				"isReplaced": false
				},

				{
				"date": "2021-01-25",
				"day": "Monday",
				"number": 4,
				"location": "C7.203",
				"isReplaced": false
				},

				{
				"date": "2021-01-26",
				"day": "Tuesday",
				"number": 3,
				"location": "C7.203",
				"isReplaced": false
				}]

	},

				{
				"staffID": "ac-3",		
				"staffName": "Monica George",
				"slotsTaughtbyStaff": []
				}

	]
}
}
```
***
	(4) Assign an academic member to an unassigned slots in course(s) he/she is assigned to.
- Functionality:
    - The user who is a course instructor should be able to assign an academic member (either a Teaching Assistant or Course Instructor) empty slots in a particular course.
        - `Note:` the academic member does not have to be assigned to the course because there is no explicit route that can assign Teaching Assistants to a course. Therefore, in this route, a course instructor can be capable of assigning Teaching Assistants to course ***implicitly*** by assigning them free slots.
- **Route:** /instructor/Assignment
- **Request type:** POST.
- **Request body:**
   - Should be an object with `5 properties`:
       1. courseid, which is the course id as a string like `CSEN704`.
       2. day, which is one of the 6 days except Friday.
       3. number, slot number from 1 to 5.
       4. slocation, location id as a string like `C7.203`.
       5. memid, the id of the academic member to be assigned like `ac-1`.
- **Example request body:**
```json
{
"courseid": "CSEN704",
"day": "Sunday",
"number": "5",
"slocation": "C7.203",
"memid": "ac-1"
}
```
- **What is supposed to happen:** 
    1. The academic member would be assigned ***all*** slots that happen on the same day, same location, and same slot number for that course. The only difference is that each slot happens on a different date.
    2. The slots covered for that course gets incremented.
    3. If the academic member was not assigned to the course (like in the case of TAs previously mentioned), they will be assigned.
- **Some problems that may appear:**
   - If the course does not have any slots on that day, number, location, the response sends back the message `No slots with those details.`
   - If on some of the slots, the academic member was busy (had a slot on the same exact date, slot number), the response sends back an array of all such slots specifying their dates.
   - If on some of the slots, there was an academic member already assigned to it, the response sends back an array of all such slots specifying their dates.
- **Response body:**
```json
{error: err.message}
```

```json
{msg: "Something went wrong"}
```

```json
{msg: "Please fill all the required fields." }
```

```json
{msg: "The location you entered does not exist."}
```

```json
{msg: "This course id does not exist."}
```

```json
{msg: "You are not assigned to this course."}
```

```json
{msg: "There is no staff member with that id."}
```

```json
{msg: "There is no TA in your department with that id."}
```

```json
{msg: "Access denied"}
```

```json
{
	msg: [
	{"date": "2021-1-21",
	"busySlot": true},
	{"date": "2021-1-22",
	"busySlot": true}
	]
}
```

```json
{
	msg: [
	{"date": "2021-1-21",
	"unfreeSlot": true},
	{"date": "2021-1-22",
	"unfreeSlot": true}
	]
}
```
***
	(6) Remove an assigned academic member in course(s) he/she is assigned to.
- **Functionality:**
   - The user who is a course instructor should be able to remove an academic member from courses they are assigned to.
- **Route:** /instructor/removeAssignedAcademic
- **Request type:** DELETE.
- **Request body:** Should be an object with two properties:
     1. courseID, which is a `string` like `CSEN704`.
     2. academicMemberID, which is a `string` like `ac-1`.
- **Example request body:**
```json
{
	"courseID": "CSEN704",
	"academicMemberID": "ac-1"
}
```
- **Response body:**
   - Reflects wither errors or that the operations was successful.
- **Changes in the database:**
   - The courses array in the academic member model should have the reference to the course deleted.
   - The academic_staff array in the course model should have the reference to the academic member deleted.
   - All of the slots that were assigned to that academic member in the course model schedule array get deleted.
   - All of the slots that were assigned to that academic member in the academic member model schedule arrays get deleted.
   - The slots_covered gets decremented by how much slots were deleted by removing that academic member.
- **Example response body:**
```json
{ msg: 'Please fill all required fields!' }
```

```json
{ msg: "Something went wrong" }
```

```json
{ msg: 'The course does not exist' }
```

```json
{ msg: 'There is no staff member with this id' }
```

```json
{ msg: 'The staff member is not an academic member' }
```

```json
{ msg: 'You are not assigned to this course' }
```

```json
{ msg: 'The academic member you want to remove is not assigned to this course' }
```

```json
{ msg: 'Access Denied' }
```

```json
{ msg: 'Operation successful' }
```

***
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
o Route: /Instructor/slotAssignmentpersemester
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
o Route: /Instructor/staffpercourse
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
o Route: /Instructor/Assignment
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
o Route: /Instructor/assigncoordinator
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
## 4.4 Academic Member
	1 (a) View their schedule (for the entire semester). Schedule should show teaching activities and replacements if present.
- **Functionality:**
    - The user who is an academic member should be capable of seeing his schedule that has been assigned to him so far (even including the slots whose date has passed and slots who are not in the near future [current week]).
- **Route:** /academic/viewScheduleAllSemester
- **Request:** GET.
- **Request body:** empty.
- **Response body:**
    - `Case 1 (normal case with status 200):` Should be an object with ***two properties***.
        - replacementSlots: which is an array of objects representing slots in the user's schedule that they have taken as a result of accepting an annual request.
        - normalSlots: which is an array of objects representing slots that were originally found there.\
        &nbsp;
        - Properties under the normalSlots and replacementSlots:
            - day: one of the week days.
            - date: in the format `YYYY-MM-DD`.
            - number: one of the five slots.
            - courseID: the id of the course as a `string` like `CSEN704`.
            - locationID: the id of the location as a `string` like `C7.203`.
   - `Case 2:` If the user is not an academic member (and is an HR member instead), the response sends back the message **`You are not an academic member!`** with status **`401`**.
- **Example response body:**
```json
You are not an academic member!
```
```json
{
"replacementSlots": [
	{
	"day": "Sunday",
	"locationID": "C7.203",
	"courseID": "CSEN703",
	"date": "2020-12-27",
	"number": 4	
	},
	{
	"day": "Saturday",
	"locationID": "C7.203",
	"courseID": "CSEN703",
	"date": "2021-01-02",
	"number": 3
	},
	{
	"day": "Thursday",
	"locationID": "C7.203",
	"courseID": "CSEN703",
	"date": "2020-12-24",
	"number": 2
	}
],
"normalSlots": [	
	{
	"day": "Saturday",
	"locationID": "C7.203",
	"courseID": "CSEN704",
	"date": "2020-12-26",
	"number": 5
	}
]
}
```
***
	1 (b) View their schedule (for the upcoming week only). Schedule should show teaching activities and replacements if present.
- **Functionality:**
    - The user who is an academic member should be capable of seeing his schedule that has been assigned to him for the upcoming week only  (starting from the current day).
- **Route:** /academic/viewScheduleThisWeek
- **Request:** GET.
- **Request body:** empty.
- **Response body:**
    - `Case 1 (normal case with status 200):` Should be an object with ***two properties***.
        - replacementSlots: which is an array of objects representing slots in the user's schedule that they have taken as a result of accepting an annual request.
        - normalSlots: which is an array of objects representing slots that were originally found there.\
        &nbsp;
        - Properties under the normalSlots and replacementSlots:
            - day: one of the week days.
            - date: in the format `YYYY-MM-DD`.
            - number: one of the five slots.
            - courseID: the id of the course as a `string` like `CSEN704`.
            - locationID: the id of the location as a `string` like `C7.203`.
   - `Case 2:` If the user is not an academic member (and is an HR member instead), the response sends back the message **`You are not an academic member!`** with status **`401`**.
- **Example response body:**
```json
You are not an academic member!
```
- Imagine that the current date is **2020-12-25**, then the previous slots with dates **2021-01-02** and **2020-12-24** that the previous route showed do not get included.
```json
{
"replacementSlots": [
	{
	"day": "Sunday",
	"locationID": "C7.203",
	"courseID": "CSEN703",
	"date": "2020-12-27",
	"number": 4	
	}
],
"normalSlots": [	
	{
	"day": "Saturday",
	"locationID": "C7.203",
	"courseID": "CSEN704",
	"date": "2020-12-26",
	"number": 5
	}
]
}
```
***
	 2 (a)  Send “replacement” request(s).
 
 - **Functionality:** :the user who is any academic member should be capable of sending replacement requests to ask  other academic members teaching the same course as him to teach one of his slots in his/her stead.
 - **Route:**/academic/sendReplacementRequest
 - **Request Type:** POST
 - **Request body:** user must input
 - 1. slot number (1st,2nd,etc..) 
 - 2. slot date ("2020-12-09)
 - 3. slot location (office/hall id eg. "C7.101")
 -   **Example request body:**
 -      { 
        "slotNum":"2",
        "slotDate":"2020-12-29",
        "slotLoc":"c7.101" 
        }
**Response body:**
   
 - Case 1: if the user is an HR member and not an academic one the response sends back the message :
     ```"HR cannot submit this request.Only academic staff are permitted."```
 - Case  2: if the user does not input slot number the response sends back the message:
    ``` "Must submit slot number with the request."```
 
 - Case  3: if the user does not input slot date the response sends back the message:
    ``` "Must submit slot date with the request."```
 
 - Case  4: if the user does not input slot date the response sends back the message:
    ```"Must submit slot location with the request."```
>
 - Case 4: if the user inputs a slot date that has already passed the response send back the message
   ``` "Cannot replace a slot that has already passed"```
> 
 - Case 5: if the user inputs a slot that is not in his schedule the
   response sends back the message
    ``` "This slot is not present in your schedule."```
> 
 - Case 6: if after searching the system has not found any other
   academic members teaching this course the response sends back the message
   ``` "No other academic staff member who teach this course are available to send a replacement request to."```
> 
 - Case 7: if all other academic members have teaching activities during this slot the response sends back the message
   ``` "Requests successfully submitted"```
> 
 - Case 8: else if all input is correct and the system found an
   available academic member to send the request to it sends it and responds with
    ``` "Requests successfully submitted"```
**Result in database:**
 - Requests are sent to all available academic members teaching the same course and not having teaching activities during this slot. So a number of requests are made and saved into the requests collection with id of the sender, id the receiver , submission date , slot number ,slot date ,slot location and state=pending.
 - All academic members who are sent this request will receive a notification where each member has an array of notifications. So a new string saying ```You received a new replacement request``` will be pushed into their arrays.
 ***
	2 (b) View sent “replacement” request(s).**
 - **Functionality:** any academic member should be able to view replacement requests he sent.
 - **Route:**/academic/sentReplacementRequest
 - **Request type:** GET
 - **Request Body:** no request body needed
 - **Response body:**
 - Case 1: if the user is an HR member and not an academic one the response sends back the message :
     ```"HR cannot submit this request. Only academic   staff are permitted."```
     
     Case 2: this user has not sent any replacement requests yet the response sends back the message:
     ```There are no sent requests available to display.``` 
      Case 3: replacement requests that the user have sent are displayed
      
    - Example for a change day-off request returned
   ```json
     Request type: Change Day off
     Sent to head of department: hadeel
     Request state: Pending
     New DayOff: Wednesday
     Reason :
     Submission date: Thu Dec 24 2020 20:37:25 GMT+0200      (Eastern European Standard Time)```
     `````
***
	2 (b) View received “replacement” request(s).**
  - **Functionality:** any academic member should be able to view replacement requests he received.
 - **Route:** /academic/receivedReplacementRequest
 - **Request type:** GET
 - **Request Body:** no request body needed
 - **Response body:**
 - - Case 1: if the user is an HR member and not an academic one the response sends back the message :
     ```"HR do not have replacement requests."```
     
     Case 2: this user has not received any replacement requests yet the response sends back the message:
     ```There are no received requests..``` 
      Case 3: replacement requests that the user have received are displayed 
***
	3  . Send a “slot linking” request.
  - **Functionality:** any academic member should be able to send a “slot linking” request to the course coordinator to to indicate their desire to teach a slot
 - **Route:**/academic/slotLinkingRequest
 - **Request type:** POST
 - **Request body:** user must input
 - 1. course ID ("csen703") 
 - 2. slot day ("Saturday")
 - 3. slot number (1,2,etc..)
 - 4. (OPTIONAL) reason for request
 -   **Example request body:**
```
  { 
"slotNum":"2",
"slotDay":"Monday",
"courseID":"csen703",
"reason":"reason"
  }
   ```
   - **Response body:**
   - - Case 1: if the user is an HR member and not an academic one the response sends back the message :
       ```"HR are not permitted to send slot linking requests.Only academic members are allowed."```
      -  Case 2: if the user does not input slot day the response sends back the message :
         ```" Must submit slot day with the request."```
       -  Case 3: if the user does not input slot number the response sends back the message :
           ```  "Must submit slot number with the request."```
     -  Case 4: if the user does not input course ID the response sends back the message :
         ```"Must submit course ID with the request."```
       -  Case 5: if the user does not input correct slot day format the response sends back the message :
          ```"Please enter a day with correct format (eg.Saturday)."```
     -  Case 6: if the user inputs a course ID that is not present in the database the response sends back the message :
          ```"No such course exists. Please enter correct course ID."```
      -  Case 7: if the course the user inputted does not have a course coordinator yet so will not be able to send his request since this request should be automatically sent to course coordinator the response sends back the message :
          ```"Currently there is not an assigned course coorinator to this course send this request to."```
      -  Case 8: if the user already has teaching activities during the slot he is making a slot linking request for the response sends back the message :
          ```"User already has teaching activities during this slot. Cannot send this request."```
      -  Case 9: if the user is sending a slot linking request for a course that he/she does not teach the response sends back the message :
          ```"Not permitted to send this request because user does not teach this course."```
      -  Case 10 : else if all input is correct a request is created and saved and response sends back the message :
          ```"Request successfully submitted."```
**Result in database:**
 - A slot linking request is created with type: "Slot Linking" , id of the sender ,id of the receiver (course coordinator), submission date, course ID, slot number ,slot day, reason (if inputted by user) and state: "Pending". This request is saved into the requests collection.
 - The course coordinator of the course inputted by the user will receive a notification where each member has an array of notifications. So a new string saying ```You received a new slot linking request.``` will be pushed into their arrays.
***
	4  . Send a “change day off” request.
  - **Functionality:** any academic member should be able to send a “change day off” request to the head of their department.
 - **Route:**/academic/changeDayOff
 - **Request type:** POST
 - **Request body:** user must input
 - 1. newDayOff ( eg. "Saturday")
 - 2. (OPTIONAL) reason for request
 -   **Example request body:**
```
  { 
"newDayOff":"Wednesday"
,"reason":"reason"
  }
   ```
 - **Response body:**  
 - Case 1: if the user is an HR member and not an academic one the response sends back the message :
      ```"HR are not permitted to send this request.Only academic members are allowed."```
  -  Case 2: if the user does not input new day-off the response sends back the message :
         "Must submit new day-off with request." 
   -  Case 3: if the user does not input slot number the response sends back the message :
      ```     "Please enter a day with correct format.  (eg.Saturday)."```
   
  -  Case 4: if the user inputs his old day-off as the new day-off the response sends back the message :
     ```"This day is already your day-off. Please enter a new day."```
    -  Case 5: if the user inputs Friday as the new day-off the response sends back the message :
       ```"Friday is already a day off.Please submit a new day.```     
-  Case 6: if the user inputs a day where has teaching activities as the new day-off the response sends back the message :
     ```"Cannot request for a day off on a day with teaching activities."```     
-  Case 7: if the user is in a department that does not have a head of department yet to send the request to since this request is automatically sent to the head of the department, the response sends back the message :
     ```"There is currently no head of this department to send this request to."``` 
-  Case 8: else if input is correct and all other conditions are met  the response sends back the message :
     ```"Request successfully submitted."```      
     
     **Result in database:**
 - A slot linking request is created with type: "Change Day off" , id of the sender ,id of the receiver (head of the department), submission date, reason (if inputted by user) and state: "Pending". This request is saved into the requests collection.
 - The head of the user's department  will receive a notification where each member has an array of notifications. So a new string saying ```You received a new change day-off request.``` will be pushed into their arrays.
***
	5 (a)  Send an “accidental leave” request.
  - **Functionality:** any academic member should be able to send an “accidental leave” request to the head of their department.
 - **Route:** /academic/accidentalLeave
 - **Request type:** POST
 - **Request body:** user must input
 - 1. accidentDate( eg. "2020-12-20")
 - 4. (OPTIONAL) reason for request
 -   **Example request body:**
```
  { 
  "accidentDate":"2020-12-23",
  "reason":"compensate please"
  }
   ```
   - **Response body:**  
 - Case 1: if the user is an HR member and not an academic one the response sends back the message :
      ```"HR are not permitted to send leave requests.Only academic members are allowed."```
  -  Case 2: if the user does not input accident date the response sends back the message :
         "Must submit accident date with the request." 
   -  Case 3: if the user is in a department that does not have a head of department yet to send the request to since this request is automatically sent to the head of the department, the response sends back the message :
      ```     "There is currently no head of this department to send this request to."```
   -  Case 4: if the maximum number of accidental leaves have been already reached, the response sends back the message :
      ```     "Cannot submit request.Maximum number of accidental day leaves have been reached."```
   -  Case 5: if the current annual balance is zero, the response sends back the message :
      ```"Cannot submit request. Annual leave balance is currently empty."```
     -  Case 6: if the input is correct and all other conditions are met, the response sends back the message :
      ```"Request successfully submitted."```    
   **Result in database:**
 - An accidental leave request is created with type: "Accidental Leave" , id of the sender ,id of the receiver (head of the department),accident date, submission date, reason (if inputted by user) and state: "Pending". This request is saved into the requests collection.
 - The head of the user's department  will receive a notification where each member has an array of notifications. So a new string saying ```"You received a new accidental leave request."``` will be pushed into their arrays.  
***
	5 (b) Send a “sick leave” request.
  - **Functionality:** any academic member should be able to send a “sick leave” request to the head of their department.
 - **Route:**/academic/sickLeave
 - **Request type:** POST
 - **Request body:** user must input
 - 1. sickDay ( eg. "2020-12-20")
 - 2. medicalDoc ( a string that has link for drive for example)
 - 3. (OPTIONAL) reason for request
 -   **Example request body:**
```
  { 
  "sickDay":"2020-12-24",
  "medicalDoc":"any string",
  "reason":"reason"
  }
   ```
   - **Response body:**  
 - Case 1: if the user is an HR member and not an academic one the response sends back the message :
      ```"HR are not permitted to send leave requests.Only academic members are allowed."```
  -  Case 2: if the user does not input sick day date the response sends back the message :
         "Must submit sick day date with the request." 
   -  Case 3: if the user is in a department that does not have a head of department yet to send the request to since this request is automatically sent to the head of the department, the response sends back the message :
      ```     "There is currently no head of this department to send this request to."```
   -  Case 4: if the user does not input medical documents, the response sends back the message :
      ```     "Medical documents to prove medical condition must be submitted with the request."```
   -  Case 5: if the input is correct and all other conditions are met, the response sends back the message :
      ```"Request successfully submitted."```
``    
   **Result in database:**
 - A sick leave request is created with type: "Sick Leave" , id of the sender ,id of the receiver (head of the department),sick day date, submission date, reason (if inputted by user) and state: "Pending". This request is saved into the requests collection.
 - The head of the user's department  will receive a notification where each member has an array of notifications. So a new string saying ```"You received a new sick leave request."``` will be pushed into their arrays.  
 *** 
	5 (c) Send a “maternity leave” request.
  - **Functionality:** any academic member should be able to send a “maternityLeave” request to the head of their department.
 - **Route:**/academic/maternityLeave
 - **Request type:** POST
 - **Request body:** user must input
 - 1. maternityDoc ( a string that has link for drive for example)
 - 2. (OPTIONAL) reason for request
 
 -   **Example request body:**
```
  { 
  "maternityDoc":"drive string",
  "reason":"compensate please"
  }
   ```
   - **Response body:**  
 - Case 1: if the user is an HR member and not an academic one the response sends back the message :
      ```"HR are not permitted to send leave requests.Only academic members are allowed."```
  -  Case 2: if the user making this request is not female, the response sends back the message :
         "Only female staff members are eligible to send this request." 
   -  Case 3: if the user is in a department that does not have a head of department yet to send the request to since this request is automatically sent to the head of the department, the response sends back the message :
      ```     "There is currently no head of this department to send this request to."```
   -  Case 4: if the user does not input maternity documents, the response sends back the message :
      ```     "Documents to prove the maternity condition must be submitted."```
   -  Case 5: if the input is correct and all other conditions are met, the response sends back the message :
      ```"Request successfully submitted."```
``    
   **Result in database:**
 - A maternity leave request is created with type: "Maternity Leave" , id of the sender ,id of the receiver (head of the department),maternity documents, submission date, reason (if inputted by user) and state: "Pending". This request is saved into the requests collection.
 - The head of the user's department  will receive a notification where each member has an array of notifications. So a new string saying ```"You received a new maternity leave request."``` will be pushed into their arrays.  
***
	5 (d)  . Send a “compensation leave” request.
  - **Functionality:** any academic member should be able to send a “compensation leave” request to the head of their department.
 - **Route:**/academic/compensationLeave
 - **Request type:** POST
 - **Request body:** user must input
 - 1. missedDay ("2020-12-20")
 - 2. reason for request
 
 -   **Example request body:**
```
  { 
  "missedDay":"2020-12-12",
  "reason":"reason"
  }
   ```
 - **Response body:**  
 - Case 1: if the user is an HR member and not an academic one the response sends back the message :
      ```"HR are not permitted to send leave requests.Only academic members are allowed."```
 -  Case 2: if the user does not input missed day date, the response sends back the message :
        ```"Must submit the missed day date with the request." ```
 -  Case 3: if the user inputs a friday day as the missed day date, the response sends back the message :
      ```    "Cannot compensate for Friday.It is already a day off"```
 -  Case 4: if the user inputs his day off as the missed day date, the response sends back the message :
      ```     "Cannot compensate for a day off."```
 -  Case 5: if the day the user inputted was one where he attended and was not absent, the response sends back the message :
      ```"You already attended this day.Cannot send a compensation request for it."```
 -  Case 6: if the day the user does not input a reason for this request, the response sends back the message :
      ```"Must submit a reason for compensation leave request."```
 -  Case 7: if the input is correct and all other conditions are met, the response sends back the message :
      ```"Request successfully submitted."```
``      
   **Result in database:**
 - A compensation leave request is created with type: "Compensation Leave" , id of the sender ,id of the receiver (head of the department),missed day date, submission date, reason (if inputted by user) and state: "Pending". This request is saved into the requests collection.
 - The head of the user's department  will receive a notification where each member has an array of notifications. So a new string saying ```"You received a new compensation leave request."``` will be pushed into their arrays.  
***
	7 . View the status of all submitted requests.
 - **Functionality:** any academic member should be able view the status of requests they sent
 - **Route:**/academic/requestStatus
 - **Request type:** GET
 - **Request body:** empty
 - **Response body:**  
 - Case 1: if the user is an HR member and not an academic one the response sends back the message :
      ```"HR do not have any leave requests."```
 -  Case 2: if the user do not have any submitted requests yet, the response sends back the message :
        ```"There are no submitted requests to display." ```
 -  Case 3:else if there are submitted requests:
     **Example of response body:**
    
 ``` json
 Request type: Change Day off
Sent to head of department: hadeel
Request state: Pending
New DayOff: Wednesday
Reason: 
Submission date: Thu Dec 24 2020 20:37:25 GMT+0200 (Eastern European Standard Time)```
```
 ``` json
 Request type: Accidental Leave
Sent to head of department: hadeel
Request state: Pending
Accident Date Wed Dec 23 2020 02:00:00 GMT+0200 (Eastern European Standard Time)
Reason: reason
Submission date: Thu Dec 24 2020 21:23:13 GMT+0200 (Eastern European Standard Time)``
```
 ``` json
Request type: Compensation Leave
Sent to head of department: hadeel
Request state: Pending
Missed Day: Sat Dec 12 2020 00:00:00 GMT+0200 (Eastern European Standard Time)
Reason: compensate please
Submission date: Thu Dec 24 2020 22:19:59 GMT+0200 (Eastern European Standard Time)```
````
``      
***
	7 (b) . View accepted requests.
 - **Functionality:** any academic member should be able to view  accepted requests.
 - **Route:**
 - /academic/acceptedRequests (for submitted requests)
 - /academic/acceptedReceivedRequests (for received requests)
 - **Request type:** GET
 - **Request body:** empty
 - **Response body:**  
 - Case 1: if the user is an HR member and not an academic one the response sends back the message :
      ```"HR do not have any leave requests."```
 -  Case 2: if the user do not have any accepted requests yet, the response sends back the message :
       ```"There are no accepted requests to display."```
 -  Case 3:else if there are submitted requests:
     **Example of response body:**
```json
Request type: Slot Linking
Sent to course coordinator: marina
Request state: Accepted
Slot Day: Monday
Slot Number: 2
Course ID: csen33
Reason: 
Submission date: Thu Dec 24 2020 20:21:37 GMT+0200 (Eastern European Standard Time)
```
***
	7 (c) View pending requests.
 - **Functionality:** any academic member should be able to view  pending requests.
 - **Route:**
 - /academic/pendingRequests (for submitted requests)
 - /academic/pendingReceivedRequests (for received requests)
 - **Request type:** GET
 - **Request body:** empty
 - **Response body:**  
 - Case 1: if the user is an HR member and not an academic one the response sends back the message :
      ```"HR do not have any leave requests."```
 -  Case 2: if the user do not have any accepted requests yet, the response sends back the message :
       ```"There are no pending requests to display."```
 -  Case 3:else if there are submitted requests:
     **Example of response body:**
```json
Request type: Slot Linking
Sent to course coordinator: marina
Request state: Pending
Slot Day: Monday
Slot Number: 2
Course ID: csen33
Reason: 
Submission date: Thu Dec 24 2020 20:21:37 GMT+0200 (Eastern European Standard Time)
```
****
	7 (d) View rejected requests.
 - **Functionality:** any academic member should be able to view  rejected requests.
 - **Route:**
 - /academic/rejectedRequests (for submitted requests)
 - /academic/rejectedReceivedRequests (for received requests)
 - **Request type:** GET
 - **Request body:** empty
 - **Response body:**  
 - Case 1: if the user is an HR member and not an academic one the response sends back the message :
      ```"HR do not have any leave requests."```
 -  Case 2: if the user do not have any accepted requests yet, the response sends back the message :
       ```"There are no rejected requests to display."```
 -  Case 3:else if there are submitted requests:
     **Example of response body:**
```json
Request type: Slot Linking
Sent to course coordinator: marina
Request state: Rejected
Slot Day: Monday
Slot Number: 2
Course ID: csen33
Reason: 
Submission date: Thu Dec 24 2020 20:21:37 GMT+0200 (Eastern European Standard Time)
```
***
	8(a). Accept a replacement request.
 - **Functionality:** any academic member should be able to accept a replacement request sent by another member.
 - **Route:**/academic/acceptReplacementRequest
 - **Request type:** PUT
 - **Request body:** user must input
         - requestID (he can get this ID by viewing his requests)
 - **Response body:**  
 - Case 1: if the user is an HR member and not an academic one the response sends back the message :
      ```'You are not an academic member!'```
 -  Case 2: if the user inputs a request ID that does not exist, the response sends back the message :
       ```"This request does not exist. Please enter correct request ID"```
 -  Case 3: if the user inputs the ID of a request that was not sent to him , the response sends back the message :
       ```This request was not sent to you.Cannot accept or reject.'```
   -  Case 3: if the user inputs a request ID that he has already accepted before, the response sends back the message :
       ```"This request has already been accepted before."'```    
     -  Case 4: else :
           ```"Request successfully accepted."'```      
***
	8 (b). Reject a replacement request.
 - **Functionality:** any academic member should be able to accept a replacement request sent by another member.
 - **Route:**/academic/rejectReplacementRequest
 - **Request type:** PUT
 - **Request body:** user must input
         - requestID (he can get this ID by viewing his requests)
 - **Response body:**  
 - Case 1: if the user is an HR member and not an academic one the response sends back the message :
      ```'You are not an academic member!'```
 -  Case 2: if the user inputs a request ID that does not exist, the response sends back the message :
       ```"This request does not exist. Please enter correct request ID"```
 -  Case 3: if the user inputs the ID of a request that was not sent to him , the response sends back the message :
       ```This request was not sent to you.Cannot accept or reject.'```
   -  Case 3: if the user inputs a request ID that he has already rejected before, the response sends back the message :
       ```"This request has already been rejected before."'```    
     -  Case 4: else :
           ```"Request successfully rejected."'```    
***
	(9) Cancel a still pending request or a request whose day is yet to come.
- **Functionality:**
    - The user who is an academic member should be capable of cancelling a request that is either:
       - Not annual or replacement request, and is still pending.
       - An annual or replacement request whose target day is yet to come.
            - In the case of the annual request, if it is accepted, the route reverses the effect of the HOD accepting an annual request.
            - This means that the slot goes back to the schedule of the academic member who originally had it.
            - And is deleted from the replacement member.
            - This is reflected on the course schedule too.
- **Route:** /academic/cancelRequest
- **Request:** DELETE.
- **Request body:**
   - Should be an object with ***1 property*** --> requestID.
   - Where requestID is the id of the request as a `string` that gets auto-incremented, with the prefix indicating the type of the request:
       - AnnualLeave-\<number>.
       - Replacement-\<number>.
       - SlotLinking-\<number>.
       - ChangeDayOff-\<number>.
       - SickLeave-\<number>.
       - CompensationLeave-\<number>.
       - AccidentalLeave-\<number>.
       - MaternityLeave-\<number>.
- **Example request body:**
```json
{
	"requestID": "AnnualLeave-1"
}
```
- **Response body:**
    - `Case 1:` If the user is not an academic member, and is an HR member instead, the response sends back the message **`You are not an academic member!`** with status **`400`**.\
    &nbsp;
    - `Case 2:` If there is no such request with such an id in the database, the response sends backs the message **`Request not found!`** with status **`400`**.\
    &nbsp;
    - `Case 3:` If the sender of the found request is different from that of the user, the response sends back the message **`You are not the one who sent this request!`** with status **`401`**.\
    &nbsp;
    - `Case 4:` If the request is not an annual or replacement request, and the status is not pending, the response sends backs the message **`Cannot cancel a non-pending request!`** with status **`400`**.\
    &nbsp;
    - `Case 5:` If the request is not an annual or replacement request, and the status is pending, the response sends backs the message **`Request cancelled successfully!`** with status **`200`**.\
    &nbsp;
    - `Case 6:` If the request is an annual or replacement request, and the slot date ***was reached or on the current date***, then the response sends backs the message **`Cannot cancel a replacement/annual request whose target day has passed!`** with status **`400`**.\
 &nbsp;
    - `Case 7:` If the request is an annual or replacement request, and the slot date ***has not been reached yet***, then the response sends backs the message **`Request deleted successfully!`** with status **`200`**. 
- **Example response body:**
```json
You are not an academic member!
```
```json
Request not found!
```
```json
You are not the one who sent this request!
```
```json
Cannot cancel a non-pending request!
```
```json
Request cancelled successfully!
```
***
	(no certain point)
- **Functionality:**
   - The user who is an academic member should be capable of sending replacement requests they have submitted to be reviewed by the HOD of his department.
       - `Case 1:` If an academic member accepted their request, the annual request sent to the HOD will hold details about that member.
       - `Case 2:` If nobody accepted their request, the annual request will still be sent but without a replacement member.
- **Route:** /academic/sendAnnualLeavetoHOD
- **Request:** POST.
- **Request body:**
   - Should be an object with ***three properties*** -->
      - slotNum: the number of the 5 five slots.
      - slotDate: in the format `YYYY-MM-DD`.
      - slotLoc: the id of the location as a `string`, like `C7.203`.
- **Example request body:**
```json
{
	"slotNum": 5,
	"slotDate": "2020-12-26",
	"slotLoc": "C7.203"
}
```
- **Response body:**
   - `Case 1:` If there are no requests at all with those slot details, the response sends back the message **`You do not have a replacement request with such details!`** with status **`400`**.\
   &nbsp;
   - `Case 2:` If the replacement request was accepted, the response sends back the message **`Annual Leave request sent to HOD with the details about the academic member who accepted your request: <name>, with id <id>`** with status **`200`**.\
   &nbsp;
   - `Case 3:` If the replacement request was not accepted by anyone, the response sends back the message **`Annual Leave request sent to HOD with request that has no accept responses.`** with status **`200`**.
- **Example response body:**
```json
You do not have a replacement request with such details!
```
```json
Annual Leave request sent to HOD with the details about the academic member who accepted your request: <name>, with id <id>
```
```json
Annual Leave request sent to HOD with request that has no accept responses.
```
