import React from 'react'
import axios from 'axios'

function EditDepartment() {
    return (
        <div>
            <div className="form-group">
                <label className="col-form-label">Department Name:</label>
                <input type="text" className="form-control" placeholder="Default input" id="inputDefault0" required></input>
            </div>
            <div className="form-group">
                <label className="col-form-label">Updated Department Name:</label>
                <input type="text" className="form-control" placeholder="Default input" id="inputDefault1" required></input>
            </div>
            <div className="form-group">
                <label className="col-form-label">Updated Faculty Name:</label>
                <input type="text" className="form-control" placeholder="Default input" id="inputDefault2" required></input>
            </div>

            <div className="form-group">
                <label className="col-form-label">Updated Head of Department id:</label>
                <input type="text" className="form-control" placeholder="Default input" id="inputDefault3"></input>
            </div>
            <div>
                <button type="button" className="btn btn-primary" onClick={() => {
                    var oldname = document.getElementById("inputDefault0").value;
                    var name = document.getElementById("inputDefault1").value;
                    var facultyname = document.getElementById("inputDefault2").value;
                    var hodid = document.getElementById("inputDefault3").value;
                    axios.put('http://localhost:5000/HR/department', { oldname: oldname, name: name, facultyname: facultyname, hodid: hodid }, { headers: { "auth-token": localStorage.getItem('auth-token') } },
                    ).then(async (response) => {
                        alert(response.data.msg);
                    }
                    ).catch((error) => {
                        console.log(localStorage);
                        if (error.response) {
                            alert(error.response.data.msg);
                        } else {
                            alert(error.msg);
                        }
                    });

                }}>Edit Department</button>
            </div>
        </div>
    );
}
export default EditDepartment;