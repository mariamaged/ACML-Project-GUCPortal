// Our Components
import Login from './components/Login.js'
import HODNavbar from './components/HOD/HODNavbar.js';
import StaffContainer from './components/HOD/StaffContainer.js';
import DepartmentStaff from './components/HOD/DepartmentStaff.js';
import CourseStaff from './components/HOD/CourseStaff';
import DepartmentStaffDayOff from './components/HOD/DepartmentStaffDayOff';
// React Components
// React
import React from 'react'

// Reacter Router and axios
import { BrowserRouter, Route} from 'react-router-dom'
//import history from './history';

// CSS and images
import 'bootstrap/dist/css/bootstrap.min.css';

// Component
const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
     {/*<Route exact path="/" component={Login} />
       <Route path='/homepage' component={ViewRejectedRequests} />*/}
      {/* <HODNavbar/> */}
      <Route exact path='/' component={StaffContainer} />
      <Route exact path='/viewDepartmentStaff' component={DepartmentStaff} />
      <Route exact path='/viewCourseStaff' component={CourseStaff} />
      <Route exact path='/viewDepartmentStaffDayOff' component={DepartmentStaffDayOff} />
      </div>
    </BrowserRouter>
  );
}

export default App;
