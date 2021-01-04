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
                'x-auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmZGUzNTdiMWEzYTg0MWRiYzg4YTI5YiIsInJvbGUiOiJBY2FkZW1pYyBNZW1iZXIiLCJhY2FkZW1pY19yb2xlIjoiQ291cnNlIEluc3RydWN0b3IiLCJpc0hlYWQiOmZhbHNlLCJpYXQiOjE2MDg4NDU2NjJ9.wZOAEpuR_ie9ALNlHMHs8kFSDm8GYQpKh26oW5Kh01o'
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
            <Staff members={this.state.departmentStaff} />
        </div>
        );
    }
}

export default DepartmentStaff;

