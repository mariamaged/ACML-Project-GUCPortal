import React from 'react'
import axios from 'axios'

function EditCourse() {
    return (
        <div>
        <div className="form-group">
            <label className="col-form-label">Course id:</label>
            <input type="text" className="form-control" placeholder="Default input" id="inputDefault0" required></input>
        </div>
        <div className="form-group">
            <label className="col-form-label">Updated Course id:</label>
            <input type="text" className="form-control" placeholder="Default input" id="inputDefault1"required></input>
        </div>
        <div className="form-group">
            <label className="col-form-label">Updated Course name:</label>
            <input type="text" min="1" className="form-control" placeholder="Default input" id="inputDefault2"required></input>
        </div>
        <div className="form-group">
            <label className="col-form-label">Updated department name:</label>
            <input type="text" className="form-control" placeholder="Default input" id="inputDefault3"required></input>
        </div>
        
        <div className="form-group">
           <label className="col-form-label">Updated slots needed:</label>
           <input type="number" className="form-control" placeholder="Default input" id="inputDefault4"></input>
        </div>

        <div className="form-group">
           <label className="col-form-label">Updated slots covered:</label>
           <input type="number" className="form-control" placeholder="Default input" id="inputDefault5"></input>
        </div>
        
        <button type="button" className="btn btn-primary" onClick={()=>{var oldid = document.getElementById("inputDefault0").value; 
         var id = document.getElementById("inputDefault1").value;
         var name = document.getElementById("inputDefault2").value;
         var departmentname = document.getElementById("inputDefault3").value;
         var slots_needed = document.getElementById("inputDefault4").value;
         var slots_covered = document.getElementById("inputDefault5").value;
         //no schedule
         axios.put('http://localhost:5000/HR/course',{oldid:oldid,id:id,name:name,departmentname:departmentname,slotsneeded:slots_needed,slotscovered:slots_covered},{headers:{"auth-token":localStorage.getItem('auth-token')}},
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

        }}>Edit Member</button>
       </div>
    );
}
export default EditCourse;