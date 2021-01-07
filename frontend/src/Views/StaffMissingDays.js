/* eslint-disable */
import React, { useState,Component } from 'react'
import axios from 'axios'











class StaffMissingDays extends Component{
    state={
        profiles:[]
    }

    componentDidMount(){
            axios.get('http://localhost:5000/HR/viewMissingdays',
            {
                headers:{
                    'auth-token':localStorage.getItem('auth-token')
                }
            }
            ).then(res=>{
                console.log(res.data);
                this.setState({profiles:res.data})
    
            }).catch(console.log("error"))
        }
        //msh 3arfa dy eh?
        handleClick(e,value){
            e.preventDefault();
            console.log("in click "+value)
        }

        renderprofile=(profile, index)=> {
            return (
                
                <tr key={profile.id} className="reqTr">
                <td className="reqTd" >{profile.name}</td>
                <td className="reqTd" >{profile.id}</td>
                <td className="reqTd">{profile.email}</td>
                <td className="reqTd">{profile.missing_days}</td>
                </tr>
                
            )
            }  
 
            render(){
                const reqs=this.state.profiles;
                    return(
                        <div> <table className="table table-hover">
                        <thead>
                        <tr>
                         <th scope="col">name</th>
                         <th scope="col">id</th>
                         <th scope="col">email</th>
                         <th scope="col">missing days</th>
                        </tr>
                        </thead>
                        <tbody className="reqBody">
                        {reqs.map(this.renderprofile)}
                        </tbody>
                        </table>
                        </div>
                      )
        
                
                return (
                   
                   reqList
                )
            }

}












// function StaffMissingDays() {
//    // const[length,setlength]=useState(0);
//       var toDisplay=[];

//       console.log("dakhalt.")
//   axios.get('http://localhost:5000/HR/viewMissingdays',{headers:{"auth-token":localStorage.getItem('auth-token')}}
//     ).then(async(response)=>{
//     console.log("fel thennnnn");
//    // console.log(response.data)
//     // result=response.data.map(getTuples);
//    toDisplay=[{name:"mayoya",id:5,email:"maya@hopa",missing_days:4},{name:"mayoya",id:45,email:"maya@hopa",missing_days:16}];
//    console.log(toDisplay);
// //       setlength(1); 
//  }).catch((error) => {
//    console.log("fel catchhhh");
//    if (error.response) {
//     alert(error.response.data.msg);
//   } else {
//     alert(error.msg);
//   }
// });

// //result=[1];
// var getTuples=(user,index)=>{
//     return(<tr>
//   <td key={user.id}>{user.name}</td>
//   <td key={user.id}>{user.id}</td>
//   <td key={user.id}>{user.email}</td>
//   <td key={user.id}>{user.missing_hours}</td>
//   <td key={user.id}>{user.missing_minutes}</td>
// </tr>);
// }
//     return (
//         <div>
//         <div>
//         <table className="table table-hover"><thead><tr>
//         <th scope="col">name</th>
//         <th scope="col">id</th>
//        <th scope="col">email</th>
//        <th scope="col">missing hours</th>
//        <th scope="col">missing minutes</th>
//        </tr>
//        </thead>
//       <tbody>{toDisplay.map(getTuples)}</tbody>
//      </table>
//      </div>
// </div>);
// }
export default StaffMissingDays;