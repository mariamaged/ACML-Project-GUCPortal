// Our Components
import Login from './components/Login.js'
import InstructorNavbar from './components/HOD/InstructorNavbar.js';
import StaffContainer from './components/HOD/StaffContainer.js';
import DepartmentStaff from './components/HOD/DepartmentStaff.js';
import SingleCourseStaff from './components/HOD/SingleCourseStaff.js';
import CourseStaff from './components/HOD/CourseStaff.js';
import CourseStaffSearch from './components/HOD/CourseStaffSearch.js';
import DepartmentStaffDayOff from './components/HOD/DepartmentStaffDayOff.js';
// React Components
// React
import React from 'react'

// Reacter Router and axios
import { BrowserRouter, Route, Switch } from 'react-router-dom'
//import history from './history';

// CSS and images


// Component
const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Route exact path="/" component={Login} />
        <Route path='/instructor' component={InstructorNavbar} />
        <Route path='/instructor/hod' component={StaffContainer} />
        <Route path='/instructor/hodDepartmentStaff' component={DepartmentStaff} />
        <Route path='/instructor/hodCourseStaff' component={CourseStaffSearch} />
        <Switch>
        <Route path='/instructor/hodCourseStaff/all' component={CourseStaff} />
        <Route path='/instructor/hodCourseStaff/:courseID' component={SingleCourseStaff} />
        </Switch>
        <Route path='/instructor/hodDepartmentStaffDayOff' component={DepartmentStaffDayOff} />
      </div>
    </BrowserRouter>
  );
}

export default App;
