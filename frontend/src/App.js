// Our Components
import Login from './components/Login.js';

import InstructorNavbar from './components/Other/InstructorNavbar.js';
import TeachingAssistantNavbar from './components/Other/TeachingAssistantNavbar.js';
import HRNavbar from './components/Other/HRNavbar.js';

import AddCourse from './components/HR/AddCourse.js';
import DeleteCourse from './components/HR/DeleteCourse.js';
import EditCourse from './components/HR/EditCourse.js';
import AddDepartment from './components/HR/AddDepartment.js';
import DeleteDepartment from './components/HR/DeleteDepartment.js';
import EditDepartment from './components/HR/EditDepartment.js';
import AddFaculty from './components/HR/AddFaculty.js';
import DeleteFaculty from './components/HR/DeleteFaculty.js';
import EditFaculty from './components/HR/EditFaculty.js';
import AddMember from './components/HR/AddMember.js';
import DeleteMember from './components/HR/DeleteMember.js';
import EditMember from './components/HR/EditMember.js';
import UpdateSalary from './components/HR/UpdateSalary.js';
import AddLocation from './components/HR/AddLocation.js';
import DeleteLocation from './components/HR/DeleteLocation.js';
import EditLocation from './components/HR/EditLocation.js';
import MemberAttendance from './components/HR/MemberAttendance.js';
import AddRecord from './components/HR/AddRecord.js';
import StaffMissingDays from './components/HR/StaffMissingDays.js';
import StaffMissingHours from './components/HR/StaffMissingHours.js';

import StaffContainer from './components/HOD/StaffContainer.js';
import DepartmentStaff from './components/HOD/DepartmentStaff.js';
import SingleCourseStaff from './components/HOD/SingleCourseStaff.js';
import CourseStaff from './components/HOD/CourseStaff.js';
import Search from './components/HOD/Search.js';
import DepartmentStaffDayOff from './components/HOD/DepartmentStaffDayOff.js';
import SingleDepartmentStaffDayOff from './components/HOD/SingleDepartmentDayOff.js';
import AllCoursesCoverage from './components/HOD/AllCoursesCoverage.js';
import OneCourseCoverage from './components/HOD/OneCourseCoverage.js';
import TeachingAssignment from './components/HOD/TeachingAssignment.js';
import CourseTeachingAssignment from './components/HOD/CourseTeachingAssignment.js';

import InstructorAllCoursesCoverage from './components/CourseInstructor/AllCoursesCoverage.js';
import InstructorOneCourseCoverage from './components/CourseInstructor/OneCourseCoverage.js';
import InstructorAllTeachingAssignment from './components/CourseInstructor/TeachingAssignment.js';
import InstructorOneTeachingAssignment from './components/CourseInstructor/CourseTeachingAssignment.js';
import AssignCourseCoordinator from './components/CourseInstructor/AssignCourseCoordinator.js';
import AssignMember from './components/CourseInstructor/AssignMember.js';
import RemoveMember from './components/CourseInstructor/RemoveMember.js';
import DeleteMemberAssignment from './components/CourseInstructor/DeleteMemberAssignment.js';

import Schedule from './components/Academic/ScheduleOptions.js';
import ReceivedRequests from './components/Academic/receivedRequests.js';
import SubmittedRequests from './components/Academic/submittedRequests.js';
import RequestsForms from './components/Academic/requestForms.js';

import PostCourseSlots from './components/CourseCoordinator/PostCourseSlots.js';
import DeleteCourseSlots from './components/CourseCoordinator/DeleteCourseSlots.js';
import UpdateCourseSlots from './components/CourseCoordinator/UpdateCourseSlots.js';
import CourseCoordinatorContainer from './components/CourseCoordinator/CourseCoordinatorContainer.js';

import Attendance from './components/Staff/Attendance.js';
import UpdateProfile from './components/Staff/UpdateProfile.js';
import ViewProfile from './components/Staff/ViewProfile.js';

import Toast from './components/Toasts/toast.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




import Homepage from "./components/Other/Homepage";
import Notifications from "./components/Other/Notifications";
import FisrtLogin from "./components/Other/FirstLogin";

// React Components

// React
import React,{useState} from 'react';

// Reacter Router and axios
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// CSS and images

// Component
const App = () => {
  const [value, setValue] = useState(localStorage.getItem("newMember"));
  const force=()=>{
    setValue(value+1)
  }
  return (
    <BrowserRouter>


      <div className="App">

        {/*Login*/}
        <Route exact path='/' component={Login} />
        <Route exact path='/Login' component={Login} />
        
    {localStorage.getItem("newMember")=="true"?(<FisrtLogin force={force}/>):(

      <div>
        {/*Navbars*/}
        <Route path='/instructor' component={InstructorNavbar} />
        <Route path='/assistant' component={TeachingAssistantNavbar} />
        <Route path='/hr' component={HRNavbar} />

        {/*Homepages*/}
        <Route path='/instructor/homepage' component={Homepage} />
        <Route path='/assistant/homepage' component={Homepage} />
        <Route path='/hr/homepage' component={Homepage} />

        {/*HR Navbar */}
        <Route path='/hr/AddCourse' component={AddCourse} />
        <Route path='/hr/DeleteCourse' component={DeleteCourse} />
        <Route path='/hr/EditCourse' component={EditCourse} />
        <Route path='/hr/AddDepartment' component={AddDepartment} />
        <Route path='/hr/DeleteDepartment' component={DeleteDepartment} />
        <Route path='/hr/EditDepartment' component={EditDepartment} />
        <Route path='/hr/AddFaculty' component={AddFaculty} />
        <Route path='/hr/DeleteFaculty' component={DeleteFaculty} />
        <Route path='/hr/EditFaculty' component={EditFaculty} />
        <Route path='/hr/AddMember' component={AddMember} />
        <Route path='/hr/DeleteMember' component={DeleteMember} />
        <Route path='/hr/EditMember' component={EditMember} />
        <Route path='/hr/UpdateSalary' component={UpdateSalary} />
        <Route path='/hr/AddLocation' component={AddLocation} />
        <Route path='/hr/DeleteLocation' component={DeleteLocation} />
        <Route path='/hr/EditLocation' component={EditLocation} />
        <Route path='/hr/ViewMemberAttendance' component={MemberAttendance} />
        <Route path='/hr/AddMissingRecord' component={AddRecord} />
        <Route path='/hr/ViewStaffWithMissingDays' component={StaffMissingDays} />
        <Route path='/hr/ViewStaffWithMissingHours' component={StaffMissingHours} />

        {/*HOD Navbar*/}
        <Route path='/instructor/hod' component={StaffContainer} />
        <Route path='/instructor/hodDepartmentStaff' component={DepartmentStaff} />
        <Route path='/instructor/hodCourseStaff' render={(props) => (
          <Search {...props} placeholder="Course ID" roleID="1" />
        )} />
        <Switch>
          <Route path='/instructor/hodCourseStaff/all' component={CourseStaff} />
          <Route path='/instructor/hodCourseStaff/:courseID' component={SingleCourseStaff} />
        </Switch>
        <Route path='/instructor/hodDepartmentStaffDayOff' render={(props) => (
          <Search {...props} placeholder="Academic Member ID" roleID="2" />
        )} />
        <Switch>
          <Route path='/instructor/hodDepartmentStaffDayOff/all' component={DepartmentStaffDayOff} />
          <Route path='/instructor/hodDepartmentStaffDayOff/:academicMemberID' component={SingleDepartmentStaffDayOff} />
        </Switch>
        <Route path='/instructor/hodCoursesCoverage' render={(props) => (
          <Search {...props} placeholder="Course ID" roleID="3" />
        )} />
        <Switch>
          <Route path='/instructor/hodCoursesCoverage/all' component={AllCoursesCoverage} />
          <Route path='/instructor/hodCoursesCoverage/:courseID' component={OneCourseCoverage} />
        </Switch>

        <Route path='/instructor/hodteachingAssignment' render={(props) => (
          <Search {...props} placeholder="Course ID" roleID="4" />
        )} />

        <Switch>
          <Route path='/instructor/hodteachingAssignment/all' component={TeachingAssignment} />
          <Route path='/instructor/hodteachingAssignment/:courseID' component={CourseTeachingAssignment} />
        </Switch>

        <Route path='/instructor/instructorCoursesCoverage' render={(props) => (
          <Search {...props} placeholder="Course ID" roleID="5" />
        )} />

        <Switch>
          <Route path='/instructor/instructorCoursesCoverage/all' component={InstructorAllCoursesCoverage} />
          <Route path='/instructor/instructorCoursesCoverage/:courseID' component={InstructorOneCourseCoverage} />
        </Switch>

        <Route path='/instructor/instructorTeachingAssignment' render={(props) => (
          <Search {...props} placeholder="Course ID" roleID="6" />
        )} />

        <Switch>
          <Route path='/instructor/instructorTeachingAssignment/all' component={InstructorAllTeachingAssignment} />
          <Route path='/instructor/instructorTeachingAssignment/:courseID' component={InstructorOneTeachingAssignment} />
        </Switch>

        <Route path='/instructor/assignCourseCoordinator' component={AssignCourseCoordinator} />
        <Route path='/instructor/assignMember' component={AssignMember} />
        <Route path='/instructor/deleteMemberAssignment' component={DeleteMemberAssignment} />
        <Route path='/instructor/removeMember' component={RemoveMember} /> 

        {/*Course Coordinator*/}
        <Route path='/assistant/postCourseSlots' component={PostCourseSlots} />
        <Route path='/assistant/deleteCourseSlots' component={DeleteCourseSlots} />
        <Route path='/assistant/updateCourseSlots' component={UpdateCourseSlots} />
        <Route path='/assistant/coursecoordinator' component={CourseCoordinatorContainer} />

        <Route path="/(instructor|assistant)/schedule" component={Schedule} />
        {/* getReceivedRequests */}
        <Route path='/(instructor|assistant)/receivedRequests' component={ReceivedRequests} />
        {/* getSubmittedRequests */}
        <Route path='/(instructor|assistant)/submittedRequests' component={SubmittedRequests} />
        {/* get  Requests forms */}
        <Route path='/(instructor|assistant)/requestsForms' component={RequestsForms} />

        {/*Staff*/}
        <Route path='/(instructor|assistant|hr)/attendance' component={Attendance} />
        <Route path='/(instructor|assistant|hr)/updateProfile' component={UpdateProfile} />   
        <Route path='/(instructor|assistant|hr)/viewProfile' component={ViewProfile} />
           
        {/*Toast Component*/}
        <ToastContainer
          position="bottom-left"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        </div>
          )}
      </div>

    
    </BrowserRouter >
  );
}

export default App;
