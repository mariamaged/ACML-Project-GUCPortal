import React from 'react'
import axios from 'axios'

function AddFaculty() {
    return (
        <div>
          <div className="form-group">
            <label className="col-form-label">Faculty Name:</label>
            <input type="Text" min="1" className="form-control" placeholder="Default input" id="inputDefault1" required></input>
           </div>
        <button type="button" className="btn btn-primary" onClick={()=>{ var name = document.getElementById("inputDefault1").value;
         axios.post('http://localhost:5000/HR/Faculty',{name:name},{headers:{"auth-token":localStorage.getItem('auth-token')}},
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
          }}>Add Faculty</button>
       </div>
    );
}
export default AddFaculty;