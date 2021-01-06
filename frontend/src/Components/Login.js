import React from "react";
import "./Login.css";
//import GUC from "../assets/GUC.jpeg";
import axios from "axios";
//import "./boot.min.css";

class Login extends React.Component {
  state = {
    email: "",
    password: "",
  };
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleClick = (e) => {
    e.preventDefault();
    console.log("SUBMITTED");

    axios
      .post("http://localhost:5000/staff/login", {
        email: this.state.email,
        password: this.state.password,
      })
      .then(async(res) => {
        console.log("REQUEST SUCCESS");
        const token=res.headers['auth-token'];
        localStorage.setItem("auth-token",token);
        const user=res.data.user;
        console.log(JSON.stringify(user));
        localStorage.setItem('user',JSON.stringify(user));
        if(user.role==="HR"){
          this.props.history.push('/HR');
        }
        if(user.role==="Course Instructor"){
          this.props.history.push('/instructor');
        }
        if(user.role==="Teaching Assistant"){
          this.props.history.push('/assistant');
        }
      })
      .catch((error) => {
        console.log("REQUEST FAILED");
        if (error.response) {
          alert(error.response.data.msg);
        } else {
          console.error(error);
          alert("ERROR???");
        }
      });
  };

  render() {
    return (
      <div className="container text-center parent">
        <main className="form-signin">
          <form onSubmit={this.handleClick.bind(this)}>
            {/* <img
              className="mb-4"
              src={GUC}
              alt="eeehhh"
              width="72"
              height="72"
            /> */}
            <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
            <label htmlFor="inputEmail" className="visually-hidden">
              Email address
            </label>
            <input
              value={this.state.email}
              name="email"
              onChange={this.handleChange}
              type="email"
              id="inputEmail"
              className="form-control"
              placeholder="Email address"
              required
              autoFocus
            />
            <label htmlFor="inputPassword" className="visually-hidden">
              Password
            </label>
            <input
              value={this.state.password}
              name="password"
              onChange={this.handleChange}
              type="password"
              id="inputPassword"
              className="form-control"
              placeholder="Password"
              required
            />

            <input type="submit" className="w-100 btn btn-lg btn-primary" />
          </form>
        </main>
      </div>
    );
  }
}
/*
    <button onClick={this.handleClick} className="w-100 btn btn-lg btn-primary">Sign in</button>
*/

export default Login;