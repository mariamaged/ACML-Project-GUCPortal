// Our Components
import StaffDayOff from './staffdayoff.js';
// React Components
// React
import React, { Component } from 'react'

// Reacter Router and axios
import axios from 'axios';

class DepartmentStaffDayOff extends Component {
    state = {
        departmentStaffDayOff: []
    }

    componentDidMount() {
        axios.get('http://localhost:5000/HOD/viewDepartmentStaffDayOff', {
            headers: {
                'x-auth-token': localStorage.getItem("auth-token")
            }
        })
            .then(response => {
                this.setState({departmentStaffDayOff: response.data });
                console.log(response.data);
                console.log(this.state);
            })
            .catch(error => {
                console.log('Error with getting staff day off in department for HOD.');
                console.log(error);
            });
    }

    render() {
        return (
        <div className='container'>
            <StaffDayOff members={this.state.departmentStaffDayOff} role="the department you are the head of."/>
        </div>
        );
    }
}

export default DepartmentStaffDayOff;

