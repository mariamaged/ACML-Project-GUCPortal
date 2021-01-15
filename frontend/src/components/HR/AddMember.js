import React, { useState } from 'react'
import axios from 'axios'

function AddMember() {
    return (
        <div>
            <div className="form-group">
                <label className="col-form-label">Name:</label>
                <input type="text" className="form-control" placeholder="Default input" id="inputDefault0" required></input>
            </div>
            <div className="form-group">
                <label className="col-form-label">Email Address:</label>
                <input type="text" className="form-control" placeholder="Default input" id="inputDefault1" required></input>
            </div>
            <div className="form-group">
                <label className="col-form-label">Salary:</label>
                <input type="Number" min="1" className="form-control" placeholder="Default input" id="inputDefault2" required></input>
            </div>
            <div className="form-group">
                <label className="col-form-label">Office Location:</label>
                <input type="text" className="form-control" placeholder="Default input" id="inputDefault3" required></input>
            </div>
            <div className="form-group">
                <label>Type:</label>
                <select className="form-control" id="exampleSelect1" required>
                    <option>HR</option>
                    <option>Course Instructor</option>
                    <option>Teaching Assistant</option>
                </select>
            </div>
            <div className="form-group">
                <label>Day Off:</label>
                <select className="form-control" id="exampleSelect2">
                    <option>Saturday</option>
                    <option>Sunday</option>
                    <option>Monday</option>
                    <option>Tuesday</option>
                    <option>Wednesday</option>
                    <option>Thurseday</option>
                </select>
            </div>
            <div className="form-group">
                <label>Gender:</label>
                <select className="form-control" id="exampleSelect3" required>
                    <option>Female</option>
                    <option>Male</option>
                </select>
            </div>
            <h6>In case of Academic Member please fill these fields:</h6>
            <div className="form-group">
                <label className="col-form-label">Department Name:</label>
                <input type="text" className="form-control" placeholder="Default input" id="inputDefault4" required></input>
            </div>
            <div className="form-group">
                <label className="col-form-label">Faculty Name:</label>
                <input type="text" className="form-control" placeholder="Default input" id="inputDefault5" required></input>
            </div>
            <button type="button" className="btn btn-primary" onClick={() => {
                var name = document.getElementById("inputDefault0").value;
                var email = document.getElementById("inputDefault1").value;
                var salary = document.getElementById("inputDefault2").value;
                var office = document.getElementById("inputDefault3").value;
                var type = document.getElementById("exampleSelect1").value;
                var actype;
                if (type != "HR") {
                    actype = type;
                    type = "Academic Member";
                }
                var dayoff = document.getElementById("exampleSelect2").value;
                var gender = document.getElementById("exampleSelect3").value;
                var facultyname = document.getElementById("inputDefault5").value;
                var departmentname = document.getElementById("inputDefault4").value;
                console.log(departmentname);
                console.log(facultyname);
                axios.post('http://localhost:5000/HR/staffmember', { name: name, email: email, salary: salary, officelocation: office, type: type, actype: actype, dayoff: dayoff, gender: gender, facultyname: facultyname, departmentname: departmentname }, { headers: { "auth-token": localStorage.getItem('auth-token') } },
                ).then(async (response) => {
                    console.log("fel thennnnn");
                    alert(response.data.msg);
                }
                ).catch((error) => {
                    console.log("fel catchhhh");
                    if (error.response) {
                        alert(error.response.data.msg);
                    } else {
                        alert(error.msg);
                    }
                });

            }}>Add Member</button>
        </div>

    );
}
export default AddMember;