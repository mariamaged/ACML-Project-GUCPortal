// Our Components
import Staff from './staff.js';
// React Components
// React
import React, { Component } from 'react'

// Reacter Router and axios
import axios from 'axios';

class DepartmentStaff extends Component {
    state = {
        departmentStaff: []
    }

    componentDidMount() {
        axios.get('http://localhost:5000/HOD/viewDepartmentStaff', {
            headers: {
                'x-auth-token': localStorage.getItem("auth-token")
            }
        })
            .then(response => {
                this.setState({ departmentStaff: response.data });
                console.log(response.data);
                console.log(this.state);
            })
            .catch(error => {
                console.log('Error with getting staff in department for HOD.');
                console.log(error);
            });
    }

    render() {
        return (
        <div className='container'>
            <Staff members={this.state.departmentStaff} role="the department you are the head of."/>
        </div>
        );
    }
}

export default DepartmentStaff;

