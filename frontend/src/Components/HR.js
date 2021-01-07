import React, { useState } from 'react'
import { Link } from "react-router-dom"
import axios from 'axios'

function  HR(props) {
    const [locationsMenu, setLocationsMenu]=useState(false);
    const [FacultiesMenu, setFacultiesMenu]=useState(false);
    const [departmentsMenu, setdepartmentsMenu]=useState(false);
    const [staffmembersMenu, setstaffmembersMenu]=useState(false);
    const [attendanceMenu,  setattendanceMenu]=useState(false);
    const [coursesMenu,setcoursesMenu]=useState(false);

    // locations drop down
    let Locationsdropdown=<li className="nav-item dropdown">
    <a className="nav-link dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" onClick={()=> {setLocationsMenu(!locationsMenu); setFacultiesMenu(false); setdepartmentsMenu(false); setcoursesMenu(false); setstaffmembersMenu(false); setattendanceMenu(false);}}>Locations</a>
    <div className="dropdown-menu">
      <a className="dropdown-item" href="#">Add a location</a>
      <a className="dropdown-item" href="#">Delete a location</a>
      <a className="dropdown-item" href="#">Edit a location</a>
    </div>
  </li>
    
    if(locationsMenu){
       Locationsdropdown=<li className="nav-item dropdown show">
       <a className="nav-link dropdown-toggle" data-toggle="dropdown"  role="button" aria-haspopup="true" aria-expanded="true" onClick={()=> setLocationsMenu(!locationsMenu)}>Locations</a>
       <div className="dropdown-menu show">
         <Link to='/HR/AddLocation' className="dropdown-item">Add a location</Link>
         <Link to='/HR/DeleteLocation' className="dropdown-item">Delete a location</Link>
         <Link to='/HR/EditLocation' className="dropdown-item">Edit a location</Link>
       </div>
     </li>
    }

   
    //Faculties
    let Facultiesdropdown=<li className="nav-item dropdown">
    <a className="nav-link dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" onClick={()=>{ setFacultiesMenu(!FacultiesMenu); setLocationsMenu(false); setdepartmentsMenu(false); setcoursesMenu(false); setstaffmembersMenu(false); setattendanceMenu(false);}}>Faculties</a>
    <div className="dropdown-menu">
      <a className="dropdown-item">Add a faculty</a>
      <a className="dropdown-item">Delete a faculty</a>
      <a className="dropdown-item">Edit a faculty</a>
    </div>
  </li>
    
    if(FacultiesMenu){
       Facultiesdropdown=<li className="nav-item dropdown show">
       <a className="nav-link dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true" onClick={()=> setFacultiesMenu(!FacultiesMenu) }>Faculties</a>
       <div className="dropdown-menu show">
         <Link to='/HR/AddFaculty' className="dropdown-item">Add a faculty</Link>
         <Link to='/HR/DeleteFaculty' className="dropdown-item">Delete a faculty</Link>
         <Link to='/HR/EditFaculty' className="dropdown-item">Edit a faculty</Link>
       </div>
     </li>
    }


    //departments
    let departmentsdropdown=<li className="nav-item dropdown">
    <a className="nav-link dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" onClick={()=> {setdepartmentsMenu(!departmentsMenu); setFacultiesMenu(!FacultiesMenu); setLocationsMenu(false); setFacultiesMenu(false); setcoursesMenu(false); setstaffmembersMenu(false); setattendanceMenu(false);}}>Departments</a>
    <div className="dropdown-menu">
      <a className="dropdown-item">Add a department</a>
      <a className="dropdown-item">Delete a department</a>
      <a className="dropdown-item">Edit a department</a>
    </div>
  </li>
    
    if(departmentsMenu){
     
       departmentsdropdown=<li className="nav-item dropdown show">
       <a className="nav-link dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true" onClick={()=> setdepartmentsMenu(!departmentsMenu)}>Departments</a>
       <div className="dropdown-menu show">
         <Link to='/HR/AddDepartment' className="dropdown-item">Add a department</Link>
         <Link to='/HR/DeleteDepartment' className="dropdown-item">Delete a department</Link>
         <Link to='/HR/EditDepartment' className="dropdown-item">Edit a department</Link>
       </div>
     </li>
    }


    //courses
    // locations drop down
    let coursesdropdown=<li className="nav-item dropdown">
    <a className="nav-link dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" onClick={()=> {setcoursesMenu(!coursesMenu); setFacultiesMenu(!FacultiesMenu); setLocationsMenu(false); setdepartmentsMenu(false); setFacultiesMenu(false); setstaffmembersMenu(false); setattendanceMenu(false);}}>Courses</a>
    <div className="dropdown-menu">
      <a className="dropdown-item" href="#">Add a course</a>
      <a className="dropdown-item" href="#">Delete a course</a>
      <a className="dropdown-item" href="#">Edit a course</a>
    </div>
  </li>
    
    if(coursesMenu){
       coursesdropdown=<li className="nav-item dropdown show">
       <a className="nav-link dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true" onClick={()=> setcoursesMenu(!coursesMenu)}>Courses</a>
       <div className="dropdown-menu show">
         <Link to='/HR/AddCourse' className="dropdown-item">Add a course</Link>
         <Link to='/HR/DeleteCourse' className="dropdown-item">Delete a course</Link>
         <Link to='/HR/EditCourse' className="dropdown-item">Edit a course</Link>
       </div>
     </li>
    }

    //StaffMembers
    let staffmembersdropdown=<li className="nav-item dropdown">
    <a className="nav-link dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" onClick={()=> {setstaffmembersMenu(!staffmembersMenu); setFacultiesMenu(!FacultiesMenu); setLocationsMenu(false); setdepartmentsMenu(false); setcoursesMenu(false); setFacultiesMenu(false); setattendanceMenu(false);}}>Staff Members</a>
    <div className="dropdown-menu">
      <a className="dropdown-item" href="#">Add a staff member account</a>
      <a className="dropdown-item" href="#">Delete a staff member account</a>
      <a className="dropdown-item" href="#">Edit a staff member account</a>
      {/* could remove this */}
      <a className="dropdown-item" href="#">Update the salary of a staff member</a>
    </div>
  </li>
    
    if(staffmembersMenu){
       staffmembersdropdown=<li className="nav-item dropdown show">
       <a className="nav-link dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true" onClick={()=> setstaffmembersMenu(!staffmembersMenu)}>Staff Members</a>
       <div className="dropdown-menu show">
         <Link to='/HR/AddMember' className="dropdown-item">Add a staff member account</Link>
         <Link to='/HR/DeleteMember' className="dropdown-item">Delete a staff member account</Link>
         <Link to='/HR/EditMember' className="dropdown-item">Edit a staff member account</Link>
         {/* could remove this */}
         <Link to='/HR/UpdateSalary' className="dropdown-item">Update the salary of a staff member</Link>
       </div>
     </li>
    }


    //Attendance
    let attendancedropdown=<li className="nav-item dropdown">
    <a className="nav-link dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" onClick={()=>{ setattendanceMenu(!attendanceMenu); setFacultiesMenu(!FacultiesMenu); setLocationsMenu(false); setdepartmentsMenu(false); setcoursesMenu(false); setstaffmembersMenu(false); setFacultiesMenu(false);}}>Attendance</a>
    <div className="dropdown-menu">
      <a className="dropdown-item">View a member's attendance record</a>
      <a className="dropdown-item">View staff members with missing hours</a>
      <a className="dropdown-item">View staff members with missing days</a>
      <a className="dropdown-item">Add a missing record</a>
    </div>
  </li>
    
    if(attendanceMenu){
       attendancedropdown=<li className="nav-item dropdown show">
       <a className="nav-link dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true" onClick={()=> setattendanceMenu(!attendanceMenu)}>Attendance</a>
       <div className="dropdown-menu show">
          <Link to='/HR/ViewMemberAttendance' className="dropdown-item">View a member's attendance record</Link>
          <Link to='/HR/ViewStaffWithMissingHours' className="dropdown-item" >View staff members with missing hours</Link>
          <Link to='/HR/ViewStaffWithMissingDays' className="dropdown-item" >View staff members with missing days</Link>
          <Link to='/HR/AddMissingRecord' className="dropdown-item">Add a missing record</Link>
       </div>
     </li>
    }








    return(
    
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <a className="navbar-brand" href="#">Hi, {props.name}</a>
      
        <div className="collapse navbar-collapse" id="navbarColor03">
          <ul className="navbar-nav mr-auto">
            {Locationsdropdown}
            {Facultiesdropdown}
            {departmentsdropdown}
            {coursesdropdown}
            {staffmembersdropdown}
            {attendancedropdown}
          </ul>
        </div>
      </nav>
    
      )
}

export default HR