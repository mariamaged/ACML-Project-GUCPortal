import React from 'react'
import axios from 'axios'

function DeleteMember() {
    return (
        <div>
          <div className="form-group">
            <label className="col-form-label">Staff Member's email:</label>
            <input type="text" className="form-control" placeholder="Default input" id="inputDefault0" required></input>
          </div>
          <button type="button" className="btn btn-primary" onClick={()=>{var email = document.getElementById("inputDefault0").value; 
         axios.delete('http://localhost:5000/HR/staffmember',{headers:{"auth-token":localStorage.getItem('auth-token')},data:{email:email}},
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

        }}>Delete Faculty</button> 
        </div>
    );
}
export default DeleteMember;