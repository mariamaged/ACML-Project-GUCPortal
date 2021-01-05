import React from 'react'
import axios from 'axios'
function DeleteLocation() {
    return (
        <div>
          <div className="form-group">
            <label className="col-form-label">Location Number:</label>
            <input type="text" className="form-control" placeholder="Default input" id="inputDefault0"></input>
          </div>
          <button type="button" className="btn btn-primary" onClick={()=>{var id = document.getElementById("inputDefault0").value; 
         var maximum_capacity = document.getElementById("inputDefault1").value;
         var type=document.getElementById("exampleSelect1").value;
         axios.post('http://localhost:3000/Location',{headers:{'x-auth-token':localStorage.getItem('jwtToken')}},
         {
            id:id,type:type,maximum_capacity:maximum_capacity
            
         }).catch(err=>{
             alert(err.response.data);
            })

        }}>Add Location</button> 
        </div>
    );
}
export default DeleteLocation;