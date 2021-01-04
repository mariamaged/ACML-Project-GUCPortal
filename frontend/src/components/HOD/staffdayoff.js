// Our Components
// React Components
// React
import React from 'react'
// Reacter Router and axios
// CSS and images.

const staffdayoff = ({ members }) => {
    console.log(members);
    const departmentStaffList = members.length? (members.map(staff => {
        return (<div className="post card" key={staff.academicStaffMemberID}>
            <div className="card-content">
                <span className="card-title">{staff.academicStaffMemberID}</span>
                <p>{staff.academicStaffMemberName}</p>
                <p>{staff.dayOff}</p>
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

export default staffdayoff;

