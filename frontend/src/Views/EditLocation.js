import React from 'react'
import axios from 'axios'

function EditLocation() {
    return (
        <div>
         <div className="form-group">
            <label className="col-form-label">Location Number:</label>
            <input type="text" className="form-control" placeholder="Default input" id="inputDefault0" required></input>
            </div>
            <div className="form-group">
            <label className="col-form-label">Updated Location Number:</label>
            <input type="text" className="form-control" placeholder="Default input" id="inputDefault1" required></input>
        </div>
        <div className="form-group">
          <label>Updated Location Type</label>
            <select className="form-control" id="exampleSelect1" required>
                <option>Lecture Hall</option>
                <option>Tutorial Room</option>
                <option>Lab</option>
                <option>Office</option>
            </select>
        </div>
        <div className="form-group">
            <label className="col-form-label">Updated Maximum Capacity:</label>
            <input type="Number" min="1" className="form-control" placeholder="Default input" id="inputDefault2" required></input>
        </div> 
        <div>  
        <button type="button" className="btn btn-primary" onClick={()=>{var oldid = document.getElementById("inputDefault0").value;
         var id = document.getElementById("inputDefault1").value;
         var maximum_capacity = document.getElementById("inputDefault2").value;
         var type=document.getElementById("exampleSelect1").value;
         axios.put('http://localhost:5000/HR/Location',{oldid:oldid,id:id,type:type,maximum_capacity:maximum_capacity},{headers:{"auth-token":localStorage.getItem('auth-token')},data:{id:id}},
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

        }}>Edit Location</button>
       </div>
        </div>
    );
}
export default EditLocation;