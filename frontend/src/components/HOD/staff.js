// Our Components
import Loading from './loading';
// React Components
// React
import React from 'react';

// Reacter Router and axios
// CSS and images
import './cardcss.css';

const staff = ({ members, role }) => {
    const departmentStaffList = members.length ? (members.map(staff => {
        return (
            <div class="card border-secondary mb-3" key={staff.id}>
                <div class="card-header">{staff.id}</div>
                <div class="card-body">
                    <h4 class="card-title" style={{ color: "#4d4d4d" }}>{staff.name}</h4>
                    <p class="card-text">{'Email: ' + staff.email}</p>
                    <p class="card-text">{'Salary: ' + staff.salary}</p>
                    <p class="card-text">{'Office: ' + staff.office}</p>
                    <p class="card-text">{'Gender: ' + staff.gender}</p>
                    <p class="card-text">{'Department: ' + staff.department}</p>
                    <p class="card-text">{'Faculty: ' + staff.faculty}</p>
                    <p class="card-text">{'Academic Role: ' + staff.academicType}</p>
                </div>
            </div>)
    })) :
        (<Loading role={role}/>);

    return (
        <div>
            <br />
            <br />
            {departmentStaffList}
        </div>
    )
}

export default staff;

