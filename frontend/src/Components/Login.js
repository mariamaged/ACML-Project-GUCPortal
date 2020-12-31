import React from "react";
import "./Login.css"
import GUC from "../assets/GUC.jpeg"
import axios from "axios";

class Login extends React.Component{
    state={
        email:"",
        password:""
    }
    handleChange=(e)=>{
      this.setState({[e.target.name]:e.target.value});
    }
    handleClick=(e)=>{
     console.log(this.state.email+"  " +this.state.password);
     let response=axios.post('http://localhost:5000/staff/login',{
       email:"lol",
       password:3
     }).then((res)=>{
       console.log("WORKING")
       console.log(res);
     }).catch((err)=>{
       console.log("errrrrrr")
       console.log(err);
     })
    }


    render(){
        return(
      <div className="container text-center parent">

        <main className="form-signin">
        <form>
    <img className="mb-4" src={GUC} alt="eeehhh" width="72" height="72"/>
    <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
    <label for="inputEmail" className="visually-hidden">Email address</label>
    <input value={this.state.email} name="email" onChange={this.handleChange} type="email" id="inputEmail" className="form-control" placeholder="Email address" required autoFocus/>
    <label for="inputPassword" className="visually-hidden">Password</label>
    <input value={this.state.password} name="password" onChange={this.handleChange} type="password" id="inputPassword" className="form-control" placeholder="Password" required/>
   
    <button onClick={this.handleClick} className="w-100 btn btn-lg btn-primary">Sign in</button>
     
            
          </form>
        </main>
        </div>
        )
    }

}
/*

<input type="submit" className="w-100 btn btn-lg btn-primary" onSubmit={this.handleClick.bind(this)}/>
*/



export default Login;