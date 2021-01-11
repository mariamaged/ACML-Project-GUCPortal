// Our Components
import Staff from './staff.js';
import Warning from './warning.js';

// React Components
// React
import React, { Component } from 'react'

// Reacter Router and axios
import axios from 'axios';

class SingleCourseStaff extends Component {
    state = {
        courseStaff: [],
        warning: null,
        warningFlag: false
    }

    componentDidMount() {
        const courseID = this.props.match.params.courseID;
        console.log(courseID);
        axios.get('http://localhost:5000/HOD/viewDepartmentStaffPerCourse/' + courseID, {
            headers: {
                'x-auth-token': localStorage.getItem("auth-token")
            }
        })
            .then(response => {
                this.setState({ courseStaff: response.data, warningFlag: false });
                console.log('Response for GET /viewDepartmentStaffPerCourse/:courseID: ', response.data);
                console.log('State for getting staff for course with certain id: ', this.state);
            })
            .catch(error => {
                this.setState({ warning: error.response.data, warningFlag: true });
                console.log('Error with getting staff for course with certain id.');
                console.log(error);
            });
    }

    componentDidUpdate(prevProps) {
        if(this.props !== prevProps) {
        const courseID = this.props.match.params.courseID;
        console.log(courseID);
        axios.get('http://localhost:5000/HOD/viewDepartmentStaffPerCourse/' + courseID, {
            headers: {
                'x-auth-token': localStorage.getItem("auth-token")
            }
        })
            .then(response => {
                this.setState({ courseStaff: response.data, warningFlag: false });
                console.log('Response for GET /viewDepartmentStaffPerCourse/:courseID: ', response.data);
                console.log('State for getting staff for course with certain id: ', this.state);
            })
            .catch(error => {
                this.setState({ warning: error.response.data, warningFlag: true });
                console.log('Error with getting staff for course with certain id.');
                console.log(error);
            });
        }
    }

    render() {
        return (
            <div className='container'>
                {!this.state.warningFlag && <Staff members={this.state.courseStaff} role="the department you are the head of." />}
                {this.state.warningFlag && <Warning warning={this.state.warning} />}
            </div>
        )
    }
}

export default SingleCourseStaff;

