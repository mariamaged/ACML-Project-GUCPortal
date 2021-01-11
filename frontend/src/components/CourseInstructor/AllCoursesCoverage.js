// Our Components
import Loading from '../HOD/loading.js';
// React Components
// React
import React, { Component } from 'react'

// Reacter Router and axios
import axios from 'axios';

// CSS and images
import '../HOD/HODNavbar.css';

class AllCoursesCoverage extends Component {
    state = {
        coursesCoverage: []
    }

    componentDidMount() {
        axios.get('http://localhost:5000/Instructor/coursecoverage', {
            headers: {
                'x-auth-token': localStorage.getItem("auth-token")
            }
        })
            .then(response => {
                this.setState({ coursesCoverage: response.data });
                console.log(response.data);
                console.log(this.state);
            })
            .catch(error => {
                console.log('Error with getting course coverage for all courses the course instructor is assigned to.');
                console.log(error);
            });
    }

    render() {
        const coursesCoverageList = this.state.coursesCoverage.length ? (this.state.coursesCoverage.map(course => {
            return (
                <div class="card border-secondary mb-3" key={course["course id"]}>
                    <div class="card-header">{course["course id"]}</div>
                    <div class="card-body">
                        {course.coverage && <h4 class="card-title" style={{ color: "#4d4d4d" }}>Course Coverage: {course.coverage}</h4>}
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

