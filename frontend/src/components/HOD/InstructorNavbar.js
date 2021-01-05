// Our Components
// React Components

// React
import React, { Component } from 'react'

// Reacter Router and axios
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';

import './HODNavbar.css';
class InstructorNavbar extends Component {
    state = {
        isHOD: false,
        departmentName: null
    }

    componentDidMount() {
        axios.get('http://localhost:5000/HOD/isHOD', {
            headers: {
                'x-auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmZGUzNTdiMWEzYTg0MWRiYzg4YTI5YiIsInJvbGUiOiJBY2FkZW1pYyBNZW1iZXIiLCJhY2FkZW1pY19yb2xlIjoiQ291cnNlIEluc3RydWN0b3IiLCJpc0hlYWQiOmZhbHNlLCJpYXQiOjE2MDg4NDU2NjJ9.wZOAEpuR_ie9ALNlHMHs8kFSDm8GYQpKh26oW5Kh01o'
            }
        })
            .then((response) => {
                this.setState({ isHOD: response.data.isHOD, departmentName: response.data.departmentName });
                console.log(this.state);
            })

            .catch((error) => {
                console.log('Error in determining whether the user is an HOD or not.');
                console.log(error);
            });
    }
    render() {
        return (
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
                <NavLink to='/instructor'><a class="navbar-brand">Instructor</a>
                    {this.state.isHOD &&
                        <a class="navbar-brand department">Head of {this.state.departmentName}</a>}
                </NavLink>

                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarColor01">
                    <ul class="navbar-nav mr-auto">
                        {this.state.isHOD &&
                            <NavLink to='/instructor/hod'><li class="nav-item">
                                <a class="nav-link" >My Department</a>
                            </li></NavLink>}
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Courses</a>
                            <div class="dropdown-menu">
                                <a class="dropdown-item">Action</a>
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
                                <a class="dropdown-item">Action</a>
                                <a class="dropdown-item">Another action</a>
                                <a class="dropdown-item">Something else here</a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item">Separated link</a>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav >
        )
    }
}

export default InstructorNavbar;