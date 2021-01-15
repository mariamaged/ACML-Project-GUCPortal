import React from "react";

import axios from "axios";

class HR extends React.Component {
    state = {
        user: {},
        newMember: localStorage.getItem("newMember"),
        newPassword: "",
        passCheck: ""

    }
    routes = () => {
        return (
            <div>

            </div>
        )
    }
    passwordReset = () => {
        return (
            <div className="container">
                <h2 className="text-center mt-5 mb-5">Rest Password:</h2>
                <p>You have to reset your password on your first Login</p>
                <form onSubmit={this.resetPass}>
                    <label htmlFor="newPassword">New Password</label>
                    <input style={{ width: "15rem" }} className="form-control mb-3" id="newPassword" name="newPassword" type="password" placeholder="NEW PASSWORD" value={this.state.newPassword} onChange={this.passChange} />
                    <label htmlFor="passCheck">Confirm New Password</label>
                    <input style={{ width: "15rem" }} className="form-control mb-3" id="passCheck" name="passCheck" type="password" placeholder="CONFIRM NEW PASSWORD" value={this.state.passCheck} onChange={this.passChange} />
                    <input style={{ width: "7rem" }} className=" btn btn-primary form-control" onSubmit={this.resetPass} type="submit" />
                </form>
            </div>

        )
    }
    passChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    resetPass = (e) => {
        e.preventDefault();
        if (this.state.newPassword !== this.state.passCheck) {
            alert("Passwords must be the same");
            return;
        }
        axios.put("http://localhost:5000/staff/enterNewPass", {
            passCheck: this.state.passCheck,
            newPassword: this.state.newPassword
        }, {
            headers: {
                "auth-token": localStorage.getItem("auth-token")
            }
        }).then(res => {
            alert("Password changed successfully");
            this.setState({ newMember: false });
        }).catch((error) => {
            if (error.response) {
                console.log(error.response);
                alert(error.response.data.msg);
            } else {
                console.log(error);
                alert("ERROR OCCURED:\n" + error.message);
            }

        })
    }

    render() {
        if (!localStorage.getItem("auth-token")) {
            this.props.history.push('/');
        }
        if (localStorage.getItem("role") != "HR") {
            this.props.history.push('/');
        }


        return (
            <div>
                {this.state.newMember === "true" ? this.passwordReset() : this.routes()}
            </div>
        )
    }
}
export default HR