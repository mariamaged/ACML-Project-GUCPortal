// Our Components
import Warning from '../Other/warning.js';
import SlotsStaff from './slotsstaff.js';

// React Components
// React
import React, { Component } from 'react'

// Reacter Router and axios
import axios from 'axios';

// CSS and images
import '../../css/cardcss.css';

class CourseTeachingAssignment extends Component {
    state = {
        teachingAssignment: null,
        warningFlag: false,
        warning: null
    }

    componentDidMount() {
        const courseID = this.props.match.params.courseID;
        console.log(courseID);
        axios.get('http://localhost:5000/HOD/teachingAssignmentAllCourses/' + courseID, {
            headers: {
                'x-auth-token': localStorage.getItem("auth-token")
            }
        })
            .then(response => {
                this.setState({ teachingAssignment: response.data, warningFlag: false });
                console.log(response.data);
                console.log(this.state);
            })
            .catch(error => {
                this.setState({ warning: error.response.data, warningFlag: true });
                console.log('Error with getting teaching assignment for a certain course under your department.');
                console.log(error);
            });
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            const courseID = this.props.match.params.courseID;
            console.log(courseID);
            axios.get('http://localhost:5000/HOD/teachingAssignmentAllCourses/' + courseID, {
                headers: {
                    'x-auth-token': localStorage.getItem("auth-token")
                }
            })
                .then(response => {
                    this.setState({ teachingAssignment: response.data, warningFlag: false });
                    console.log(response.data);
                    console.log(this.state);
                })
                .catch(error => {
                    this.setState({ warning: error.response.data, warningFlag: true });
                    console.log('Error with getting teaching assignment for a certain course under your department.');
                    console.log(error);
                });
        }
    }
    render() {
        return (
            <div className="container">
                <br />
                <br />
                {!this.state.warningFlag && this.state.teachingAssignment && 
                    <div class="card border-secondary mb-3">
                        <div class="card-header">{this.state.teachingAssignment.courseID}</div>
                        <div class="card-body">
                            <h4 class="card-title" style={{ color: "#4d4d4d" }}>{this.state.teachingAssignment.courseName}</h4>
                            <SlotsStaff members={this.state.teachingAssignment.oneCourseTeachingAssignment} />
                        </div>
                </div>}
                {this.state.warningFlag && <Warning warning={this.state.warning} />}
            </div>
        )
    }
}

export default CourseTeachingAssignment;

