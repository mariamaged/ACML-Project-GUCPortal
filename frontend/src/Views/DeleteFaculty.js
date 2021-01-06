import React from 'react'
import axios from 'axios'

function DeleteFaculty() {
    return (
        <div>
          <div className="form-group">
            <label className="col-form-label">Faculty Name:</label>
            <input type="text" className="form-control" placeholder="Default input" id="inputDefault0"></input>
          </div>
          <button type="button" className="btn btn-primary" onClick={()=>{var name = document.getElementById("inputDefault0").value; 
         axios.delete('http://localhost:5000/HR/Faculty',{headers:{"auth-token":localStorage.getItem('auth-token')},data:{name:name}},
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

        }}>Delete Faculty</button> 
        </div>
    );
}
export default DeleteFaculty;