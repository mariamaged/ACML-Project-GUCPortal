import React from 'react'
import axios from 'axios'
function UpdateSalary() {
    return (
        <div>
        <div className="form-group">
           <label className="col-form-label">Staff Member id:</label>
           <input type="text" className="form-control" placeholder="Default input" id="inputDefault0" required></input>
           </div>
           <div className="form-group">
           <label className="col-form-label">Updated Salary:</label>
           <input type="number" className="form-control" placeholder="Default input" id="inputDefault1" required></input>
       </div>
       <div>  
       <button type="button" className="btn btn-primary" onClick={()=>{var id = document.getElementById("inputDefault0").value;
        var salary = document.getElementById("inputDefault1").value;
        axios.put('http://localhost:5000/HR/updatesalary',{id:id,salary:salary},{headers:{"auth-token":localStorage.getItem('auth-token')}},
        ).then(async(response)=>{
               alert(response.data.msg);}
         ).catch((error) => {
             console.log(localStorage);
            if (error.response) {
              alert(error.response.data.msg);
            } else {
              alert(error.msg);
            }
          });

       }}>Update Salary</button>
      </div>
       </div>
    );
}
export default UpdateSalary;