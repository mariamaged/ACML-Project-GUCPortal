// Our Components
// React Components
// React
import React from 'react';

// Reacter Router and axios
// CSS and images
const slotstable = ({ slots }) => {
    const tableItems = slots.length ? (slots.map(slot => {
        return (
            <tr key={slot.date + slot.number + slot.location}>
                <td>{slot.date}</td>
                <td>{slot.day}</td>
                <td>{slot.number}</td>
                <td>{slot.location}</td>
                <td>{slot.isReplaced.toString()}</td>
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

