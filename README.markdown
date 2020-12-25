

## **4.4 Academic member Functionalities**

**Any academic member can do the following:**

   **2 (a) . Send “replacement” request(s).**
 
 - **Functionality:** :the user who is any academic member should be capable of sending replacement requests to ask  other academic members teaching the same course as him to teach one of his slots in his/her stead.

 - **Route:**/sendReplacementRequest

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
 
 

 **2 (b) . View sent “replacement” request(s).**

 - **Functionality:** any academic member should be able to view replacement requests he sent.
 - **Route:**/sentReplacementRequests
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




 **2 (b) . View received “replacement” request(s).**
  - **Functionality:** any academic member should be able to view replacement requests he received.
 - **Route:**/receivedReplacementRequests
 - **Request type:** GET
 - **Request Body:** no request body needed
 - **Response body:**
 - - Case 1: if the user is an HR member and not an academic one the response sends back the message :

     ```"HR do not have replacement requests."```
     
     Case 2: this user has not received any replacement requests yet the response sends back the message:
     ```There are no received requests..``` 

      Case 3: replacement requests that the user have received are displayed 





 **3  . Send a “slot linking” request.**
  - **Functionality:** any academic member should be able to send a “slot linking” request to the course coordinator to to indicate their desire to teach a slot
 - **Route:**/slotLinkingRequest
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

**4  . Send a “change day off” request.**
  - **Functionality:** any academic member should be able to send a “change day off” request to the head of their department.
 - **Route:**/changeDayOff
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
 
 **5 (a)  . Send an “accidental leave” request.**
  - **Functionality:** any academic member should be able to send an “accidental leave” request to the head of their department.
 - **Route:**/accidentalLeave
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

 
 **5 (b)  . Send a “sick leave” request.**
  - **Functionality:** any academic member should be able to send a “sick leave” request to the head of their department.
 - **Route:**/sickLeave
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
  
 **5 ( c)  . Send a “maternity leave” request.**
  - **Functionality:** any academic member should be able to send a “maternityLeave” request to the head of their department.
 - **Route:**/maternityLeave
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

 **5 (d)  . Send a “compensation leave” request.**
  - **Functionality:** any academic member should be able to send a “compensation leave” request to the head of their department.
 - **Route:**/compensationLeave
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

**7 . View the status of all submitted requests..**
 - **Functionality:** any academic member should be able view the status of requests they sent
 - **Route:**/requestStatus
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

**7 (b) . View accepted requests.**
 - **Functionality:** any academic member should be able to view  accepted requests.
 - **Route:**/acceptedRequests
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
**7 (b) . View pending requests.**
 - **Functionality:** any academic member should be able to view  pending requests.
 - **Route:**/pendingRequests
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
**7 (c) . View rejected requests.**
 - **Functionality:** any academic member should be able to view  rejected requests.
 - **Route:**/rejectedRequests
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
**8 . Cancel a still pending request or a request whose day is yet to come.**
 - **Functionality:** any academic member should be able to cancel a still pending request or a request whose day is yet to come.
 - **Route:**/cancelRequest
 - **Request type:** GET
 - **Request body:** user must input
         - reqType
         - ,submission_date,
         - .id


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
