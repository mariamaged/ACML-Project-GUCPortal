/* eslint-disable */
import React, { useState,Component } from 'react'
import axios from 'axios'











class MemberAttendance extends Component{
    state={
        attendance:[],
    }

    request(id){

            axios.get('http://localhost:5000/HR/attendance/'+id,
            {
                headers:{
                    'auth-token':localStorage.getItem('auth-token')
                }
            }
            ).then(res=>{
                console.log(res.data);
                this.setState({attendance:res.data})
    
            }).catch(console.log("error"))
        }
        //msh 3arfa dy eh?
        handleClick(e,value){
            e.preventDefault();
            console.log("in click "+value)
        }

        renderattendance=(attend, index)=> {
            return ( 
                <tr key={attend.minutes} className="reqTr">
                <td className="reqTd" >{attend.date}</td>  
                <td className="reqTd" >{attend.day}</td>
                {/* <td className="reqTd" >{attend.time}</td>
                <td className="reqTd">{attend.dayOffBool}</td>
                <td className="reqTd">{attend.signedIn}</td>
                <td className="reqTd">{attend.signedOut}</td>
                <td className="reqTd">{attend.attended}</td>
                <td className="reqTd">{attend.accepted_leave}</td>
                <td className="reqTd">{attend.last_signIn}</td>
                <td className="reqTd">{attend.last_signout}</td> */}
                <td className="reqTd">{attend.hours}</td>
                <td className="reqTd">{attend.minutes}</td>
                </tr>
                
            )
            }  
 
            render(){
                const reqs=this.state.attendance;
                    return(
                      <div>
                      <div>
                        <div className="form-group">
                        <label className="col-form-label">Staff Member id:</label>
                        <input type="Text" min="1" className="form-control" placeholder="Default input" id="inputDefault1" required></input>
                     </div>
                     </div>
                     <button type="button" className="btn btn-primary" onClick={()=>{ var id = document.getElementById("inputDefault1").value; this.request(id);}}>View Attendance</button>
                      
                        <div> <table className="table table-hover">
                        <thead>
                        <tr>
                          
                         <th scope="col">date</th>
                         <th scope="col">day</th>
                         {/* <th scope="col">time</th>
                         <th scope="col">day off</th>
                         <th scope="col">signed in</th>
                         <th scope="col">signed out</th>
                         <th scope="col">attended</th>
                         <th scope="col">Accepted leave</th>
                         <th scope="col">Last sign in</th>
                         <th scope="col">Last sign out</th> */}
                         <th scope="col">Hours</th>
                         <th scope="col">Minutes</th>
                        </tr>
                        </thead>
                        <tbody className="reqBody">
                        {reqs.map(this.renderattendance)}
                        </tbody>
                        </table>
                        </div>
                        </div>
                      )
        
                
                return (
                   
                   reqList
                )
            }

}










// function MemberAttendance() {
//     const [length,setlength]=useState(-1);
//     var attendance;
//     let theAttendance=null;
//     var getTuples=(attendance,index)=>{
//         return(<tr>
//       <th scope="row">{attendance.date}</th>
//       <td>{attendance.day}</td>
//       <td>{attendance.time}</td>
//       <td>{attendance.dayOffBool}</td>
//       <td>{attendance.signedIn}</td>
//       <td>{attendance.signedOut}</td>
//       <td>{attendance.attended}</td>
//       <td>{attendance.accepted_leave}</td>
//       <td>{attendance.last_signIn}</td>
//       <td>{attendance.last_signOut}</td>
//       <td>{attendance.hours}</td>
//       <td>{attendance.minutes}</td>
//     </tr>);
//     }
//     if(length!=-1){
//         theAttendance= <div>
//         <table className="table table-hover">
//       <thead>
//       <tr>
//        <th scope="col">Date</th>
//        <th scope="col">Day</th>
//        <th scope="col">Time</th>
//        <th scope="col">Day off</th>
//        <th scope="col">Signed in</th>
//        <th scope="col">Signed out</th>
//        <th scope="col">Attended</th>
//        <th scope="col">Accepted leave</th>
//        <th scope="col">Last Sign in</th>
//        <th scope="col">Last Sign out</th>
//        <th scope="col">Hours</th>
//        <th scope="col">Minutes</th>
//       </tr>
//       </thead>
//       <tbody>{attendance.map(getTuples)}</tbody>
//       </table>
//       </div>
//     }
//     return(
//         <div>
//           <div className="form-group">
//            <label className="col-form-label">Staff Member id:</label>
//            <input type="Text" min="1" className="form-control" placeholder="Default input" id="inputDefault1" required></input>
//          </div>
//         <button type="button" className="btn btn-primary" onClick={()=>{ var id = document.getElementById("inputDefault1").value;
//         axios.get('http://localhost:5000/HR/attendance/'+id,{headers:{"auth-token":localStorage.getItem('auth-token')},params:{id:id}}
//         ).then(async(response)=>{
//         console.log("fel thennnnn");
//         console.log(response.data)
//         attendance=response.data;
//            setlength(1); 
//         console.log("w b3deen");
//      } ).catch((error) => {
//        console.log("fel catchhhh");
//        if (error.response) {
//         alert(error.response.data.msg);
//       } else {
//         alert(error.msg);
//       }
//     });
//     }}>View Attendance</button>
//    <hr></hr>
// {theAttendance}
//     </div>
//     );
// }
export default MemberAttendance;