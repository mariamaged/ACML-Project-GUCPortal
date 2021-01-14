// Our Components
import Loading from '../Other/loading.js';
import SlotsStaff from '../HOD/slotsstaff.js';

// React Components
// React
import React, { Component } from 'react'

// Reacter Router and axios
import axios from 'axios';

// CSS and images
import '../../css/cardcss.css';

class TeachingAssignment extends Component {
    state = {
        teachingAssignment: []
    }

    componentDidMount() {
        axios.get('http://localhost:5000/instructor/slotsAssignment', {
            headers: {
                'x-auth-token': localStorage.getItem("auth-token")
            }
        })
            .then(response => {
                this.setState({ teachingAssignment: response.data.msg });
                console.log(response.data);
                console.log(this.state);
            })
            .catch(error => {
                console.log('Error with getting teaching assignment for all courses that the course instructor is assigned to.');
                console.log(error);
            });
    }

    render() {
        const teachingAssignmentList = this.state.teachingAssignment.length ? (this.state.teachingAssignment.map(course => {
            return (
                <div class="card border-secondary mb-3" key={course.courseID}>
                    <div class="card-header">{course.courseID}</div>
                    <div class="card-body">
                        <h4 class="card-title" style={{ color: "#4d4d4d" }}>{course.courseName}</h4>
                        <SlotsStaff members={course.oneCourseTeachingAssignment}/>
                    </div>
                </div>)
        })) :
            (<Loading role="the teaching assignment of all courses you are assigned."/>);
    
        return (
            <div className='container'>
                <br />
                <br />
                {teachingAssignmentList}
            </div>
        )
    }
}

export default TeachingAssignment;

