// Our Components
// React Components
// React
import React from 'react';

// Reacter Router and axios
// CSS and images
const slotstable = ({ slots, isReplaced, courseIDExists, academicMemberIDExists }) => {
    const tableItems = slots.length ? (slots.map(slot => {
        return (
            <tr key={slot.date + slot.number + slot.location}>
                <td>{slot.date}</td>
                <td>{slot.day}</td>
                <td>{slot.number}</td>
                {slot.locationID !== undefined &&<td>{slot.locationID}</td>}
                {slot.location !== undefined &&<td>{slot.location}</td>}
                {slot.isReplaced !== undefined && <td>{slot.isReplaced.toString()}</td> }
                {slot.isReplaced === undefined && <td>{isReplaced.toString()}</td> }
                {courseIDExists && <td>{slot.courseID}</td> }
                {academicMemberIDExists && <td>{slot.academicMemberID}</td> }
            </tr>)
    })) :
        (<div />);

    return (
        <div className="container">
            <table class="table table-hover">
                <thead>
                    <tr class="table-dark">
                        <th scope="col">Slot Date</th>
                        <th scope="col">Slot Day</th>
                        <th scope="col">Slot Number</th>
                        <th scope="col">Slot Location</th>
                        <th scope="col">Is Replaced</th>
                        {courseIDExists  && <th scope="col">Course ID</th>}
                        {academicMemberIDExists && <th scope="col">Academic Member ID</th>}
                    </tr>
                </thead>
                <tbody>
                    {tableItems}
                </tbody>
            </table>
        </div>
    )
}

export default slotstable;

