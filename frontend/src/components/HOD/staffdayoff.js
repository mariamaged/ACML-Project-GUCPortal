// Our Components
import Loading from './loading.js';
// React Components
// React
import React from 'react'
// Reacter Router and axios
// CSS and images
import './HODNavbar.css';

const staffdayoff = ({ members, role }) => {
    const departmentStaffList = members.length ? (members.map(staff => {
        return (
            <div class="card border-secondary mb-3" key={staff.academicStaffMemberID}>
                <div class="card-header">{staff.academicStaffMemberID}</div>
                <div class="card-body">
                    <h4 class="card-title" style={{color: "#4d4d4d"}}>{staff.academicStaffMemberName}</h4>
                    <p class="card-text">{'Day Off: ' + staff.dayOff}</p>
                </div>
            </div>)
    })) :
        (<Loading role={role} />);

    return (
        <div>
            <br/>
            <br/>
            {departmentStaffList}
        </div>
    )
}

export default staffdayoff;

