// Our Components
import Login from './components/Login.js';
import InstructorNavbar from './components/Navbars/InstructorNavbar.js';
import TeachingAssistantNavbar from './components/Navbars/TeachingAssistantNavbar.js';
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

import Schedule from './components/Academic/ScheduleOptions.js';
// React Components

// React
import React from 'react';

// Reacter Router and axios
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// CSS and images


// Component
const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Route exact path="/" component={Login} />
        <Route path='/instructor' component={InstructorNavbar} />
        <Route path='/assistant' component={TeachingAssistantNavbar} />
        <Route path='/instructor/schedule' component={Schedule} />
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
      </div>


    </BrowserRouter>
  );
}

export default App;
