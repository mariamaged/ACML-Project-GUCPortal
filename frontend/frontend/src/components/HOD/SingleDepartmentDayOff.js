// Our Components
import StaffDayOff from './staffdayoff.js';
import Warning from '../Other/warning.js';

// React Components
// React
import React, { Component } from 'react'

// Reacter Router and axios
import axios from 'axios';

class SingleDepartmentDayOff extends Component {
    state = {
        departmentStaffDayOff: [],
        warning: null,
        warningFlag: false
    }

    componentDidMount() {
        const academicMemberID = this.props.match.params.academicMemberID;
        console.log(academicMemberID);
        axios.get('http://localhost:5000/HOD/viewDepartmentStaffMemberDayOff/' + academicMemberID, {
            headers: {
                'x-auth-token': localStorage.getItem("auth-token")
            }
        })
            .then(response => {
                const departmentStaffDayOffUpdated = [response.data];
                departmentStaffDayOffUpdated[0].academicMemberID = academicMemberID;
                this.setState({ departmentStaffDayOff: departmentStaffDayOffUpdated, warningFlag: false });
                console.log('Response for GET viewDepartmentStaffMemberDayOff/:academicMemberID: ', response.data);
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
        const academicMemberID = this.props.match.params.academicMemberID;;
        console.log(academicMemberID);
        axios.get('http://localhost:5000/HOD/viewDepartmentStaffMemberDayOff/' + academicMemberID, {
            headers: {
                'x-auth-token': localStorage.getItem("auth-token")
            }
        })
            .then(response => {
                const departmentStaffDayOffUpdated = [response.data];
                departmentStaffDayOffUpdated[0].academicStaffMemberID = academicMemberID;
                this.setState({ departmentStaffDayOff: departmentStaffDayOffUpdated, warningFlag: false });
                console.log('Response for GET viewDepartmentStaffMemberDayOff/:academicMemberID: ', response.data);
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
                {!this.state.warningFlag && <StaffDayOff members={this.state.departmentStaffDayOff} role="the department you are the head of." />}
                {this.state.warningFlag && <Warning warning={this.state.warning} />}
            </div>
        )
    }
}

export default SingleDepartmentDayOff;

