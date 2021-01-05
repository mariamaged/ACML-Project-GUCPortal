// Our Components
// React Components
import Spinner from 'react-bootstrap/Spinner';
// React
import React from 'react';

// Reacter Router and axios
// CSS and images.
import './HODNavbar.css';
import './staff.css';
import GUC from '../../GUC.png';

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
        (<div>
            <div style={{ float: "left" }}>
                <h3>
                    Loading
            &nbsp;<small class="text-muted">the staff members of {role}</small>
                </h3></div>

            <div id="rightSpinner">
                &nbsp;
        <Spinner animation="border" style={{ color: "red", width: "50px", height: "50px", position: "absolute", top: "-8px", left: "-2px" }} />
                <img src={GUC} alt="GUCimage" width="30px" height="30px" />
            </div>

        </div>);

    return (
        <div>
            <br />
            <br />
            {departmentStaffList}
        </div>
    )
}

export default staff;

