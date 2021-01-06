import React from 'react'
import axios from 'axios'

function EditMember() {
    return (
        <div>
        <div className="form-group">
            <label className="col-form-label">id:</label>
            <input type="text" className="form-control" placeholder="Default input" id="inputDefault0" required></input>
        </div>
        <div className="form-group">
            <label className="col-form-label">Updated Email Address:</label>
            <input type="text" className="form-control" placeholder="Default input" id="inputDefault1"></input>
        </div>
        <div className="form-group">
            <label className="col-form-label">Updated Password:</label>
            <input type="Number" min="1" className="form-control" placeholder="Default input" id="inputDefault2"></input>
        </div>
        <div className="form-group">
            <label className="col-form-label">Updated Office Location:</label>
            <input type="text" className="form-control" placeholder="Default input" id="inputDefault3"></input>
        </div>
        {/* <div className="form-group">
          <label>Type:</label>
            <select className="form-control" id="exampleSelect1" onSubmit={()=>{if(document.getElementById("exampleSelect1")!="HR"){
        setACtype(true);
        setDepartmentname(true);
        setFacultyname(true);
    }}} required>
                <option>HR</option>
                <option>Instructor</option>
                <option>Teaching Assistant</option>
            </select>
        </div> */}
         <div className="form-group">
          <label>New Staff Member:</label>
            <select className="form-control" id="exampleSelect1">
                <option>true</option>
                <option>false</option>
            </select>
        </div>
        <div className="form-group">
           <label className="col-form-label">Annual days:</label>
           <input type="number" className="form-control" placeholder="Default input" id="inputDefault4"></input>
        </div>

        <div className="form-group">
           <label className="col-form-label">Last updated annual date:</label>
           <input type="Date" className="form-control" placeholder="Default input" id="inputDefault5"></input>
        </div>

        <div className="form-group">
           <label className="col-form-label">Accidental days left:</label>
           <input type="number" className="form-control" placeholder="Default input" id="inputDefault6"></input>
        </div>
        
        <div className="form-group">
          <label>Attend compensation day:</label>
            <select className="form-control" id="exampleSelect2">
                <option>true</option>
                <option>false</option>
            </select>
        </div>
       
        <button type="button" className="btn btn-primary" onClick={()=>{var id = document.getElementById("inputDefault0").value; 
         var email = document.getElementById("inputDefault1").value;
         var password = document.getElementById("inputDefault2").value;
         var office = document.getElementById("inputDefault3").value;
         var newstaffmember=document.getElementById("exampleSelect1").value;
         var attendcompensationday=document.getElementById("exampleSelect2").value;
         var annualdays = document.getElementById("inputDefault4").value;
         var lastUpdatedannual = document.getElementById("inputDefault5").value;
         var accidentaldaysleft = document.getElementById("inputDefault6").value;
         axios.put('http://localhost:5000/HR/staffmember',{id:id,email:email,password:password,office:office,newStaffMember:newstaffmember,attendcompensationday:attendcompensationday,annualdays:annualdays,lastUpdatedannual:lastUpdatedannual,accidentaldaysleft:accidentaldaysleft},{headers:{"auth-token":localStorage.getItem('auth-token')}},
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

        }}>Edit Member</button>
       </div>
    );
}
export default EditMember;