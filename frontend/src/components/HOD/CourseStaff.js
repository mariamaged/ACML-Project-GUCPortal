// Our Components
import Staff from './staff.js';
// React Components

// React
import React, { Component } from 'react'

// Reacter Router and axios
import axios from 'axios';

class CourseStaff extends Component {
    state = {
        courseStaff: []
    }

    componentDidMount() {
        axios.get('http://localhost:5000/HOD/viewDepartmentStaffAllCourses', {
            headers: {
                'x-auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmZjUxNDNmMDg0ZDY3MGNmODA5MjBlNSIsInJvbGUiOiJBY2FkZW1pYyBNZW1iZXIiLCJhY2FkZW1pY19yb2xlIjoiQ291cnNlIEluc3RydWN0b3IiLCJpc0hlYWQiOnRydWUsImlhdCI6MTYxMDExODgzN30.ZLMWayyNy5SaRrnvk3daCEeVt5vK6pEiSCaxER-yNtE'
            }
        })
            .then(response => {
                this.setState({ courseStaff: response.data });
                console.log(response.data);
                console.log(this.state);
            })
            .catch(error => {
                console.log('Error with getting staff for all courses in department for HOD.');
                console.log(error);
            });
    }

    handleChange = (e) => {
        [e.target.name] = e.target.value;
    }

    render() {
        const departmentStaffList = this.state.courseStaff.length ? (this.state.courseStaff.map(course => {
            return (
                <div key={course.courseID}>
                    <div>
                        <p>Course Name: {course.courseName}</p>
                        <p>Course ID: {course.courseID}</p>
                    </div>
                    <Staff members={course.academicStaff} />
                </div>
            )
        })) :
            (<div className="center">AAAA</div>);

        return (
            <div>
                {departmentStaffList}
            </div>
        )
    }
}

export default CourseStaff;

