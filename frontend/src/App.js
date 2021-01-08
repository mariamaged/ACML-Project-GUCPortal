// Our Components
import Login from './components/Login.js';
import InstructorNavbar from './components/HOD/InstructorNavbar.js';
import StaffContainer from './components/HOD/StaffContainer.js';
import DepartmentStaff from './components/HOD/DepartmentStaff.js';
import SingleCourseStaff from './components/HOD/SingleCourseStaff.js';
import CourseStaff from './components/HOD/CourseStaff.js';
import Search from './components/HOD/Search.js';
import DepartmentStaffDayOff from './components/HOD/DepartmentStaffDayOff.js';
import SingleDepartmentStaffDayOff from './components/HOD/SingleDepartmentDayOff.js';

// React Components

// React
import React from 'react';

// Reacter Router and axios
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// CSS and images


// Component
const App = () => {
  const propsCourse = {placeholder: "Course ID"};
  const propsAcademic = {placeholder: "Academic Member ID"};

  return (
    <BrowserRouter>
      <div className="App">
        <Route exact path="/" component={Login} />
        <Route path='/instructor' component={InstructorNavbar} />
        <Route path='/instructor/hod' component={StaffContainer} />
        <Route path='/instructor/hodDepartmentStaff' component={DepartmentStaff} />
        <Route path='/instructor/hodCourseStaff' render={(props) => (
          <Search {...props} placeholder="Course ID"/>
        )} />
        <Switch>
          <Route path='/instructor/hodCourseStaff/all' component={CourseStaff} />
          <Route path='/instructor/hodCourseStaff/:courseID' component={SingleCourseStaff} />
        </Switch>
        <Route path='/instructor/hodDepartmentStaffDayOff' render={(props) => (
          <Search {...props} placeholder="Academic Member ID"/>
        )} />
        <Switch>
          <Route path='/instructor/hodDepartmentStaffDayOff/all' component={DepartmentStaffDayOff} />
          <Route path='/instructor/hodDepartmentStaffDayOff/:academicMemberID' component={SingleDepartmentStaffDayOff} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
