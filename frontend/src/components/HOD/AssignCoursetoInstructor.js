import React from 'react'
import axios from 'axios'

function AssignCoursetoInstructor() {
    return (
        <div>
            <div className="form-group">
                <label className="col-form-label">Course ID:</label>
                <input type="text" className="form-control" placeholder="Default input" id="inputDefault0" required></input>
            </div>
            <div className="form-group">
                <label className="col-form-label">Academic Member ID:</label>
                <input type="text" className="form-control" placeholder="Default input" id="inputDefault1" required></input>
            </div>
            <button type="button" className="btn btn-primary" onClick={() => {
                var courseID = document.getElementById("inputDefault0").value;
                var academicMemberID = document.getElementById("inputDefault1").value;

                axios.post('http://localhost:5000/HOD/assignCoursetoCourseInstructor',
                    { courseID: courseID, academicMemberID: academicMemberID },
                    { headers: { "x-auth-token": localStorage.getItem('auth-token') } },
                ).then(async (response) => {
                    alert(response.data);
                }
                ).catch((error) => {
                    if (error.response) {
                        alert(error.response.data);
                    } else {
                        alert(error.msg);
                    }
                });

            }}>Assign Course Instructor</button>
        </div>

    );
}
export default AssignCoursetoInstructor;