// Our Components

// React Components
// React
import React, { Component } from 'react'

// Reacter Router and axios
import axios from "axios";

class Login extends Component {
  state = {
    email: null,
    password: null
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state.email + "  " + this.state.password);

    axios.post('http://localhost:5000/staff/login',
      { email: this.state.email, password: this.state.password })

      .then(res => {
        console.log("login successfull.")
        console.log(res);
        const token = res.data.token;
        console.log("token= " + token);
        localStorage.setItem('jwtToken', token);
        this.props.history.push('/homepage');
      })

      .catch(err => {
          if(err.response) {
            console.log(err.response.data);
          }
      });

  }

  render() {
    return (
      <div className="container text-center parent">

        <main className="form-signin">
          <form onSubmit={this.handleSubmit}>
            <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
            <label htmlFor="inputEmail" className="visually-hidden">Email address</label>
            <input value={this.state.email} name="email" onChange={this.handleChange} type="email" id="inputEmail" className="form-control" placeholder="Email address" required autoFocus />
            <label htmlFor="inputPassword" className="visually-hidden">Password</label>
            <input value={this.state.password} name="password" onChange={this.handleChange} type="password" id="inputPassword" className="form-control" placeholder="Password" required />

            <button className="w-100 btn btn-lg btn-primary">Sign in</button>


          </form>
        </main>
      </div>
    );
  }

}

export default Login;