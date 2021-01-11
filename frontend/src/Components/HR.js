import React from "react";
import ViewProfile from "./StaffMember/ViewProfile";
import UpdateProfile from "./StaffMember/UpdateProfile";
import Attendance from "./StaffMember/Attendance";
import axios from "axios";

class HR extends React.Component{
    state={
        user:{},
        newMember:localStorage.getItem("newMember"),
        newPassword:"",
        passCheck:""

    }

    componentDidMount(){
        console.log(this.state.newMember)
    //const user=localStorage.getItem('user');
   // const parsed= JSON.parse(user);
    //this.setState({user:parsed})
  
}


    render(){
        if(!localStorage.getItem("auth-token")){
            this.props.history.push('/');
        }
       
        return(
          <div>
              
              {this.state.newMember==="true"?this.passwordReset():this.routes()}
             
          </div>
        )
    }


    routes=()=>{
        return(
            <div>
                tmam
            </div>


        )
    }
    passwordReset=()=>{
        return(
      <div className="container">
          <h2 className="text-center mt-5 mb-5">Rest Password:</h2>
          <p>You have to reset your password on your first Login</p>
          <form onSubmit={this.resetPass}>
          <label  htmlFor="newPassword">New Password</label>
          <input style={{width:"15rem"}} className="form-control mb-3" id="newPassword" name="newPassword" type="password" placeholder="NEW PASSWORD" value={this.state.newPassword} onChange={this.passChange}/>
          <label htmlFor="passCheck">Confirm New Password</label>
          <input style={{width:"15rem"}} className="form-control mb-3" id="passCheck" name="passCheck" type="password" placeholder="CONFIRM NEW PASSWORD" value={this.state.passCheck} onChange={this.passChange}  />
          <input style={{width:"7rem"}} className=" btn btn-primary form-control" onSubmit={this.resetPass} type="submit"/>
          </form>
      </div>

        )
    }
    passChange=(e)=>{
        this.setState({[e.target.name]:e.target.value});
    }
    resetPass=(e)=>{
        e.preventDefault();
        if(this.state.newPassword!==this.state.passCheck){
            alert("Passwords must be the same");
            return;
        }
       axios.put("http://localhost:5000/staff/enterNewPass",{
           passCheck:this.state.passCheck,
           newPassword:this.state.newPassword
       },{
           headers:{
               "auth-token":localStorage.getItem("auth-token")
           }
       }).then(res=>{
           alert("Password changed successfully");
           this.setState({newMember:false});
       }).catch(err=>{
           if(err.response){
               alert(err.response.data.msg);
               console.log(err.message);
           }else{
               alert("Error Ocurred\n"+err.message);
               console.log(err)
           }
       })
    }
}
export default HR