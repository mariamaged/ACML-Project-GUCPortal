import React, { useState } from 'react'
import axios from 'axios'

function MemberAttendance() {
    const [length,setlength]=useState(-1);
    var attendance=[]    
    let theAttendance=<h1>hwa mabytl3sh leeh</h1>;
    var getTuples=(attendance,index)=>{
        return(<tr>
      <th scope="row">attendance[index].date</th>
      <td>{attendance.day}</td>
      <td>{attendance.time}</td>
      <td>{attendance.dayOffBool}</td>
      <td>{attendance.signedIn}</td>
      <td>{attendance.signedOut}</td>
      <td>{attendance.attended}</td>
      <td>{attendance.accepted_leave}</td>
      <td>{attendance.last_signIn}</td>
      <td>{attendance.last_signOut}</td>
      <td>{attendance.hours}</td>
      <td>{attendance.minutes}</td>
    </tr>);
    }
    if(length!=-1){
        theAttendance= <div>
        <table className="table table-hover">
      <thead>
      <tr>
       <th scope="col">Date</th>
       <th scope="col">Day</th>
       <th scope="col">Time</th>
       <th scope="col">Day off</th>
       <th scope="col">Signed in</th>
       <th scope="col">Signed out</th>
       <th scope="col">Attended</th>
       <th scope="col">Accepted leave</th>
       <th scope="col">Last Sign in</th>
       <th scope="col">Last Sign out</th>
       <th scope="col">Hours</th>
       <th scope="col">Minutes</th>
      </tr>
      </thead>
      <tbody>{attendance.map(getTuples)}</tbody>
      </table>
      </div>
    }
    return(
        <div>
            {theAttendance}
          <div className="form-group">
           <label className="col-form-label">Staff Member id:</label>
           <input type="Text" min="1" className="form-control" placeholder="Default input" id="inputDefault1" required></input>
         </div>
        <button type="button" className="btn btn-primary" onClick={()=>{ var id = document.getElementById("inputDefault1").value;
        axios.get('http://localhost:5000/HR/attendance/'+id,{headers:{"auth-token":localStorage.getItem('auth-token')},params:{id:id}}
        ).then(async(response)=>{
        console.log("fel thennnnn");
        console.log(response.data)
        attendance=response.data;
           setlength(1); 
        console.log("w b3deen");
     } ).catch((error) => {
       console.log("fel catchhhh");
       if (error.response) {
        alert(error.response.data.msg);
      } else {
        alert(error.msg);
      }
    });
    }}>View Attendance</button>

    
    </div>
    );
}
export default MemberAttendance;