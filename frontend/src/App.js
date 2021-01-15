// Our Components
import Login from './components/Login.js';

import InstructorNavbar from './components/Other/InstructorNavbar.js';
import TeachingAssistantNavbar from './components/Other/TeachingAssistantNavbar.js';

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
import InstructorOneTeachingAssignment from './components/CourseInstructor/CourseTeachingAssignment.jsjs';

import Schedule from './components/Academic/ScheduleOptions.js';

import Toast from './components/Toasts/toast.js';

import PostCourseSlots from './components/CourseCoordinator/PostCourseSlots.js';
import DeleteCourseSlots from './components/CourseCoordinator/DeleteCourseSlots.js';
import UpdateCourseSlots from './components/CourseCoordinator/UpdateCourseSlots.js';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// React Components

// React
import React from 'react';

// Reacter Router and axios
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// CSS and images

// Component
const App = () => {
  let token = localStorage.getItem("auth-token");
  return (
    <BrowserRouter>

      {token ? (
        <div className="App">

          {/*Navbars*/}
          <Route path='/instructor' component={InstructorNavbar} />
          <Route path='/assistant' component={TeachingAssistantNavbar} />
          {/*<Route path='/hr' component={} />*/}

          {/*Homepages*/}
          <Route path='/instructor/homepage' component={Toast} />

          {/*Course Instructor Navbar*/}
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

          <Route path="/(instructor|assistant|hr)/schedule" component={Schedule} />

          {/*Teaching Assistant Navbar*/}
          <Route path='/assistant/postCourseSlots' component={PostCourseSlots} />
          <Route path='/assistant/deleteCourseSlots' component={DeleteCourseSlots} />
          <Route path='/assistant/updateCourseSlots' component={UpdateCourseSlots} />

          {/*HR Navbar */}

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
      ) : (<div className="App">
        <Route exact path="/" component={Login} />
      </div>)
      }
    </BrowserRouter >
  );
}

export default App;
