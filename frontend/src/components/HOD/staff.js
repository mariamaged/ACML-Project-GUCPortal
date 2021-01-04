// Our Components
// React Components
// React
import React from 'react'
// Reacter Router and axios
// CSS and images.

const staff = ({ members }) => {
    const departmentStaffList = members.length? (members.map(staff => {
        return (<div className="post card" key={staff.id}>
            <div className="card-content">
                <span className="card-title">{staff.id}</span>
                <p>{staff.name}</p>
                <p>{staff.email}</p>
                <p>{staff.salary}</p>
                <p>{staff.faculty}</p>
                <p>{staff.office}</p>
                <p>{staff.gender}</p>
                <p>{staff.department}</p>
                <p>{staff.academicType}</p>
            </div>
        </div>) })) :
        (<div className="center">AAAA</div>);

    return (
        <div>
        <div className="container">
            {departmentStaffList}
        </div>
        </div>
    )
}

export default staff;

