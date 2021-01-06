import React from 'react'
import axios from 'axios'

function EditFaculty() {
    return (
        <div>
        <div className="form-group">
           <label className="col-form-label">Faculty Name:</label>
           <input type="text" className="form-control" placeholder="Default input" id="inputDefault0" required></input>
           </div>
           <div className="form-group">
           <label className="col-form-label">Updated Faculty Name:</label>
           <input type="text" className="form-control" placeholder="Default input" id="inputDefault1" required></input>
       </div>
       <div>  
       <button type="button" className="btn btn-primary" onClick={()=>{var oldname = document.getElementById("inputDefault0").value;
        var name = document.getElementById("inputDefault1").value;
        axios.put('http://localhost:5000/HR/Faculty',{oldname:oldname,name:name},{headers:{"auth-token":localStorage.getItem('auth-token')}},
        ).then(async(response)=>{
               alert("done");}
         ).catch((error) => {
             console.log(localStorage);
            if (error.response) {
              alert(error.response.data.msg);
            } else {
              alert(error.msg);
            }
          });

       }}>Edit Faculty</button>
      </div>
       </div>
    );
}
export default EditFaculty;