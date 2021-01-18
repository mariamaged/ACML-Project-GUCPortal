/* eslint-disable */
import React, { useState, Component } from 'react'
import axios from 'axios'
class MemberAttendance extends Component {
    state = {
        attendance: [],
    }

    request(id) {
        axios.get('http://localhost:5000/HR/attendance/' + id,
            {
                headers: {
                    'x-auth-token': localStorage.getItem('auth-token')
                }
            }
        ).then(res => {
            console.log(res.data);
            this.setState({ attendance: res.data })

        }).catch(console.log("error"))
    }

    handleClick(e, value) {
        e.preventDefault();
        console.log("in click " + value)
    }

    renderattendance = (attend, index) => {
        return (
            <tr key={attend.minutes} className="reqTr">
                <td className="reqTd" >{attend.date}</td>
                <td className="reqTd" >{attend.day}</td>
                {/* <td className="reqTd" >{attend.time}</td>
                <td className="reqTd">{attend.dayOffBool}</td>
                <td className="reqTd">{attend.signedIn}</td>
                <td className="reqTd">{attend.signedOut}</td>
                <td className="reqTd">{attend.attended}</td>
                <td className="reqTd">{attend.accepted_leave}</td>
                <td className="reqTd">{attend.last_signIn}</td>
                <td className="reqTd">{attend.last_signout}</td> */}
                <td className="reqTd">{attend.hours}</td>
                <td className="reqTd">{attend.minutes}</td>
            </tr>

        )
    }

    render() {
        const reqs = this.state.attendance;
        return (
            <div>
                <div>
                    <div className="form-group">
                        <label className="col-form-label">Staff Member id:</label>
                        <input type="Text" min="1" className="form-control" placeholder="Default input" id="inputDefault1" required></input>
                    </div>
                </div>
                <button type="button" className="btn btn-primary" onClick={() => { var id = document.getElementById("inputDefault1").value; this.request(id); }}>View Attendance</button>

                <div> <table className="table table-hover">
                    <thead>
                        <tr>

                            <th scope="col">date</th>
                            <th scope="col">day</th>
                            {/* <th scope="col">time</th>
                         <th scope="col">day off</th>
                         <th scope="col">signed in</th>
                         <th scope="col">signed out</th>
                         <th scope="col">attended</th>
                         <th scope="col">Accepted leave</th>
                         <th scope="col">Last sign in</th>
                         <th scope="col">Last sign out</th> */}
                            <th scope="col">Hours</th>
                            <th scope="col">Minutes</th>
                        </tr>
                    </thead>
                    <tbody className="reqBody">
                        {reqs.map(this.renderattendance)}
                    </tbody>
                </table>
                </div>
            </div>
        )
    }

}

export default MemberAttendance;