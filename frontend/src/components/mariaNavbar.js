
  
// Our Components
// React Components

// React
import React, { Component } from 'react'

// Reacter Router and axios
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';

class InstructorNavbar extends Component {
    state = {
        isCourseCoordinator: false,
        courses: []
    }

    componentDidMount() {
        axios.get('http://localhost:5000/CourseCoordinator/isCourseCoordinator', {
            headers: {
                'x-auth-token': localStorage.getItem("auth-token")
            }
    })
            .then(response => {
                if(response.data.courses) this.setState({ isCourseCoordinator: response.data.isCourseCoordinator, courses: response.data.courses });
                else this.setState({ isCourseCoordinator: response.data.isCourseCoordinator});
                console.log(this.state);
            })

            .catch(error => {
                console.log('Error in determining whether the user is a course coordinator or not.');
                console.log(error);
            });
    }
    render() {
        return (
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
                <NavLink to='/instructor'><a class="navbar-brand">Teaching Assistant</a>
                    {this.state.isCourseCoordinator &&
                        <a class="navbar-brand" style={{fontSize: "0.8em"}}>Course Coordinator of {this.state.courses.toString()}</a>}
                </NavLink>

                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarColor01">
                    <ul class="navbar-nav mr-auto">
                        {this.state.isCourseCoordinator &&
                            <NavLink to='/instructor/hod'><li class="nav-item">
                                <a class="nav-link" >My Courses</a>
                            </li></NavLink>}
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Courses</a>
                            <div class="dropdown-menu">
                            <NavLink to='/instructor/instructorCoursesCoverage'><a class="dropdown-item">Courses Coverage</a></NavLink>
                                <a class="dropdown-item">Another action</a>
                                <a class="dropdown-item">Something else here</a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item">Separated link</a>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Staff</a>
                            <div class="dropdown-menu">
                                <a class="dropdown-item">Action</a>
                                <a class="dropdown-item">Another action</a>
                                <a class="dropdown-item">Something else here</a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item">Separated link</a>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Schedule</a>
                            <div class="dropdown-menu">
                                <a class="dropdown-item">Action</a>
                                <a class="dropdown-item">Another action</a>
                                <a class="dropdown-item">Something else here</a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item">Separated link</a>
                            </div>
                        </li>

                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Attendance</a>
                            <div class="dropdown-menu">
                                <a class="dropdown-item">Action</a>
                                <a class="dropdown-item">Another action</a>
                                <a class="dropdown-item">Something else here</a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item">Separated link</a>
                            </div>
                        </li>


                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Requests</a>
                            <div class="dropdown-menu">
                                <a class="dropdown-item"><Link to= {{pathname:'/assistant/submittedRequests',state:{reqType:"Sick Leave",reqTitle:"Sick Leave Requests"}}}>View Submitted Requests</Link></a>
                                <a class="dropdown-item"><Link to= {{pathname:'/assistant/receivedRequests',state:{reqType:"Sick Leave",reqTitle:"Sick Leave Requests"}}}>View Received Requests</Link></a>
                                <a class="dropdown-item"><Link to= {{pathname:'/assistant/requestsForms',state:{formType:"Accidental Leave",formTitle:"Accidental Leave Request Form"}}} >Submit Requests</Link></a>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav >
        )
    }
}


