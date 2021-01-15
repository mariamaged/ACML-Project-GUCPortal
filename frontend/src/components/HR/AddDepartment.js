import React from 'react'
import axios from 'axios'

function AddDepartment() {
    return (
        <div>
            <div className="form-group">
                <label className="col-form-label">Department Name:</label>
                <input type="Text" min="1" className="form-control" placeholder="Default input" id="inputDefault0" required></input>
            </div>

            <div className="form-group">
                <label className="col-form-label">Faculty Name:</label>
                <input type="Text" min="1" className="form-control" placeholder="Default input" id="inputDefault1" required></input>
            </div>

            <div className="form-group">
                <label className="col-form-label">Head of department id:</label>
                <input type="Text" min="1" className="form-control" placeholder="Default input" id="inputDefault2"></input>
            </div>
            
            <button type="button" className="btn btn-primary" onClick={() => {
                var name = document.getElementById("inputDefault0").value;
                var facultyname = document.getElementById("inputDefault1").value;
                var hod = document.getElementById("inputDefault2").value;
                axios.post('http://localhost:5000/HR/department', { name: name, facultyname: facultyname, hod: hod }, { headers: { "auth-token": localStorage.getItem('auth-token') } },
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
            }}>Add Department</button>
        </div>
    );
}
export default AddDepartment;