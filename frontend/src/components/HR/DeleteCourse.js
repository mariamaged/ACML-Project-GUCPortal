
import React from 'react'
import axios from 'axios'

function DeleteCourse() {
    return (
        <div>
            <div className="form-group">
                <label className="col-form-label">Course id:</label>
                <input type="text" className="form-control" placeholder="Default input" id="inputDefault0"></input>
            </div>
            <button type="button" className="btn btn-primary" onClick={() => {
                var id = document.getElementById("inputDefault0").value;
                axios.delete('http://localhost:5000/HR/course', { headers: { "auth-token": localStorage.getItem('auth-token') }, data: { id: id } },
                ).then(async (response) => {
                    alert(response.data.msg);
                }
                ).catch((error) => {
                    if (error.response) {
                        alert(error.response.data.msg);
                    } else {
                        alert(error.msg);
                    }
                });

            }}>Delete Course</button>
        </div>
    );
}
export default DeleteCourse;