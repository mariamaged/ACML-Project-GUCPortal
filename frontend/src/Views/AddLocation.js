import React from 'react'
import axios from 'axios'
import { Redirect } from 'react-router-dom';

function AddLocation() {
    return (
       <div>
        <div className="form-group">
            <label className="col-form-label">Location Number:</label>
            <input type="text" className="form-control" placeholder="Default input" id="inputDefault0" required></input>
        </div>
        <div className="form-group">
          <label>Location Type</label>
            <select className="form-control" id="exampleSelect1" required>
                <option>Lecture Hall</option>
                <option>Tutorial Room</option>
                <option>Lab</option>
                <option>Office</option>
            </select>
        </div>
        <div className="form-group">
            <label className="col-form-label">Maximum Capacity:</label>
            <input type="Number" min="1" className="form-control" placeholder="Default input" id="inputDefault1" required></input>
        </div>
        <button type="button" className="btn btn-primary" onClick={()=>{var id = document.getElementById("inputDefault0").value; 
         var maximum_capacity = document.getElementById("inputDefault1").value;
         var type=document.getElementById("exampleSelect1").value;
        //  {
            // id:id,type:type,maximum_capacity:maximum_capacity
        // }
         axios.post('http://localhost:5000/HR/Location',{id:id,type:type,maximum_capacity:maximum_capacity},{headers:{"auth-token":localStorage.getItem('auth-token')}},
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

        }}>Add Location</button>
       </div>
       
    );
}
export default AddLocation;