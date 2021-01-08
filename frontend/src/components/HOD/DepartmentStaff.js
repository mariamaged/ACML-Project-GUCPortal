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
                'x-auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmZjUxNDNmMDg0ZDY3MGNmODA5MjBlNSIsInJvbGUiOiJBY2FkZW1pYyBNZW1iZXIiLCJhY2FkZW1pY19yb2xlIjoiQ291cnNlIEluc3RydWN0b3IiLCJpc0hlYWQiOnRydWUsImlhdCI6MTYxMDExODgzN30.ZLMWayyNy5SaRrnvk3daCEeVt5vK6pEiSCaxER-yNtE'
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

