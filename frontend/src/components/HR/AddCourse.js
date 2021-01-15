import React from 'react'
import axios from 'axios'

function AddCourse() {
    return (
        <div>
<div className="form-group">
            <label className="col-form-label">Course Name:</label>
            <input type="Text" min="1" className="form-control" placeholder="Default input" id="inputDefault0" required></input>
           </div>

           <div className="form-group">
            <label className="col-form-label">Course id:</label>
            <input type="Text" min="1" className="form-control" placeholder="Default input" id="inputDefault1" required></input>
           </div> 

           <div className="form-group">
            <label className="col-form-label">Department name:</label>
            <input type="Text" min="1" className="form-control" placeholder="Default input" id="inputDefault2"></input>
           </div>
        <button type="button" className="btn btn-primary" onClick={()=>{ var name = document.getElementById("inputDefault0").value;
        var id = document.getElementById("inputDefault1").value;
        var departmentname = document.getElementById("inputDefault2").value;
         axios.post('http://localhost:5000/HR/course',{name:name,id:id,departmentname:departmentname},{headers:{"auth-token":localStorage.getItem('auth-token')}},
        ).then(async(response)=>{
            console.log("fel thennnnn");
               alert(response.data.msg);}
         ).catch((error) => {
             console.log("fel catchhhh");
            if (error.response) {
              alert(error.response.data.msg);
            } else {
              alert(error.msg);
            }
          });
          }}>Add Course</button>
        </div>
    );
}
export default AddCourse;