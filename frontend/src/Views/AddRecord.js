import React from 'react'
import axios from 'axios'

function AddRecord() {
    return (
        <div>
           <div className="form-group">
            <label className="col-form-label">User id:</label>
            <input type="Text" min="1" className="form-control" placeholder="Default input" id="inputDefault0" required></input>
           </div>

           <div className="form-group">
            <label className="col-form-label">Date:</label>
            <input type="Date" min="1" className="form-control" placeholder="Default input" id="inputDefault1" required></input>
           </div>

           <div className="form-group">
            <label className="col-form-label">Sign in time:</label>
            <input type="time" min="1" className="form-control" placeholder="Default input" id="inputDefault2"></input>
           </div>

           <div className="form-group">
            <label className="col-form-label">Sign out time:</label>
            <input type="time" min="1" className="form-control" placeholder="Default input" id="inputDefault3"></input>
           </div>

           <button type="button" className="btn btn-primary" onClick={()=>{var userid = document.getElementById("inputDefault0").value; 
         var thedate = document.getElementById("inputDefault1").value;
         var signintime = document.getElementById("inputDefault2").value+"";
         var signouttime = document.getElementById("inputDefault3").value+"";
         axios.put('http://localhost:5000/HR/addrecord',{userid:userid,thedate:thedate,signintime:signintime,signouttime:signouttime},{headers:{"auth-token":localStorage.getItem('auth-token')}},
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

        }}>Add Record</button>
        </div>
    );
}
export default AddRecord;