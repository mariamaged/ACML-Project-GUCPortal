// Our Components
import Loading from './loading.js';
// React Components
// React
import React, { Component } from 'react'

// Reacter Router and axios
import axios from 'axios';

// CSS and images
import './HODNavbar.css';

class AllCoursesCoverage extends Component {
    state = {
        coursesCoverage: []
    }

    componentDidMount() {
        axios.get('http://localhost:5000/HOD/coursesCoverage', {
            headers: {
                'x-auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmZjUxNDNmMDg0ZDY3MGNmODA5MjBlNSIsInJvbGUiOiJBY2FkZW1pYyBNZW1iZXIiLCJhY2FkZW1pY19yb2xlIjoiQ291cnNlIEluc3RydWN0b3IiLCJpc0hlYWQiOnRydWUsImlhdCI6MTYxMDExODgzN30.ZLMWayyNy5SaRrnvk3daCEeVt5vK6pEiSCaxER-yNtE'
            }
        })
            .then(response => {
                this.setState({ coursesCoverage: response.data });
                console.log(response.data);
                console.log(this.state);
            })
            .catch(error => {
                console.log('Error with getting course coverage for all courses under the HOD department.');
                console.log(error);
            });
    }

    render() {
        const coursesCoverageList = this.state.coursesCoverage.length ? (this.state.coursesCoverage.map(course => {
            return (
                <div class="card border-secondary mb-3" key={course.courseID}>
                    <div class="card-header">{course.courseID}</div>
                    <div class="card-body">
                        {course.courseCoverage && <h4 class="card-title" style={{ color: "#4d4d4d" }}>Course Coverage: {course.courseCoverage}</h4>}
                        {course.courseDoesNotHaveSlotsAssigned && <h4 class="card-title" style={{ color: "#4d4d4d" }}>Course does not have slots assigned.</h4>}
                    </div>
                </div>)
        })) :
            (<Loading role="the course coverage of all courses under your department."/>);
    
        return (
            <div className='container'>
                <br />
                <br />
                {coursesCoverageList}
            </div>
        )
    }
}

export default AllCoursesCoverage;

