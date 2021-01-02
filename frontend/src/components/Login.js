import React from "react";
//import "./Login.css"
//import GUC from "../assets/GUC.jpeg"
import axios from "axios";
import setAuthorizationToken from './setAuthorizationToken'
import jwt from 'jsonwebtoken'
import setCurrentUser from '../actions/authActions'

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



     axios({method:'POST',url:'http://localhost:5000/staff/login',
     //headers:{'auth-token':token},
      data:{email:'nancy3@gmail.com',password:'nancy'} }).then((res)=>{
       console.log("WORKING")
       console.log(res);
       const token=res.data.token
       console.log("token= "+token)
       localStorage.setItem('jwtToken',token)
      //  setAuthorizationToken(token)
        // console.log(jwt.decode(token))
        //dispatch(setCurrentUser((jwt.decode(token))))
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
    <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
    <label htmlFor="inputEmail" className="visually-hidden">Email address</label>
    <input value={this.state.email} name="email" onChange={this.handleChange} type="email" id="inputEmail" className="form-control" placeholder="Email address" required autoFocus/>
    <label htmlFor="inputPassword" className="visually-hidden">Password</label>
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