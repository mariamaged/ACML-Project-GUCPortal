import React from 'react'
import axios from 'axios'
import { Redirect } from 'react-router-dom';

function AddLocation() {
    return (
       <div>
        <div className="form-group">
            <label className="col-form-label">Location Number:</label>
            <input type="text" className="form-control" placeholder="Default input" id="inputDefault0"></input>
        </div>
        <div className="form-group">
          <label>Location Type</label>
            <select className="form-control" id="exampleSelect1">
                <option>Lecture Hall</option>
                <option>Tutorial Room</option>
                <option>Lab</option>
                <option>Office</option>
            </select>
        </div>
        <div className="form-group">
            <label className="col-form-label">Maximum Capacity:</label>
            <input type="Number" min="1" className="form-control" placeholder="Default input" id="inputDefault1"></input>
        </div>
        <button type="button" className="btn btn-primary" onClick={()=>{var id = document.getElementById("inputDefault0").value; 
         var maximum_capacity = document.getElementById("inputDefault1").value;
         var type=document.getElementById("exampleSelect1").value;
         axios.post('http://localhost:3000/Location',
         {
             
         });

        }}>Add Location</button>
       </div>
       
    );
}
export default AddLocation;