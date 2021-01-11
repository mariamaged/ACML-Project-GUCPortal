import axios from "axios";
import React from "react";

class Attendance extends React.Component {
  state = {
    loadingTable: true,
    table: [],
    days: [],
    laodingDays: true,
    hours: {},
    loadingHours: true,
    month: "",
  };
  singIn = () => {
    return (
      <div className="col-sm">
        <button
          className="btn btn-success float-right"
          onClick={this.submitSignin}
        >
          Sign In
        </button>
      </div>
    );
  };
  submitSignin = () => {
    // console.log("IN");
    console.log(localStorage.getItem("auth-token"));
    axios
      .put(
        "http://localhost:5000/staff/signin",
        {},
        {
          headers: {
            "auth-token": localStorage.getItem("auth-token"),
          },
        }
      )
      .then((res) => {
        //console.log(res.data);
        alert("Sign in successful");
        this.updateMissing();
      })
      .catch((error) => {
        console.log(error);
        alert("ERROR OCCURED:\n" + error.response.data.msg);
      })
      .catch((error) => {
        alert(error.message);
      });
  };
  signOut = () => {
    return (
      <div className="col-sm">
        <button
          className="btn btn-secondary float-left"
          onClick={this.submitSignout}
        >
          Sign Out
        </button>
      </div>
    );
  };
  submitSignout = () => {
    // console.log("OUT");
    axios
      .put(
        "http://localhost:5000/staff/signout",
        {},
        {
          headers: {
            "auth-token": localStorage.getItem("auth-token"),
          },
        }
      )
      .then((res) => {
        //console.log(res.data)
        alert(res.data.msg);
        this.updateMissing();
      })
      .catch((error) => {
        console.log(error.message);
        console.log(error);
        if (error.response.data) {
          alert(error.response.data.msg);
        } else {
          alert(error.message);
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  };
  viewAttendance = () => {
    return (
      <div>
        <div
          className="text-center d-flex justify-content-center mb-4"
          style={{
            background: "",
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <label className=" text-center">
            View Month's Attendance:&nbsp;&nbsp;{" "}
          </label>
          <select
            className="custom-select  text-center"
            onChange={this.handleDown}
            style={{ width: "13rem" }}
          >
            <option value="">All</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
            <option>7</option>
            <option>8</option>
            <option>9</option>
            <option>10</option>
            <option>11</option>
            <option>12</option>
          </select>
        </div>
        <table className="table table-hover">
          <thead>
            <tr className="table-dark">
              <th scope="col">Date</th>
              <th scope="col">Attended</th>
              <th scope="col">Hours</th>
              <th scope="col">Minutes</th>
              <th scope="col">Last Sign In </th>
              <th scope="col">Last Sign Out </th>
            </tr>
          </thead>
          <tbody>
            {this.state.table.map((r) => {
              return (
                <tr>
                  <td>{r.date}</td>
                  <td>{r.attended.toString().toUpperCase()}</td>
                  <td>{r.hours}</td>
                  <td>{r.minutes}</td>
                  <td>{r.last_signIn}</td>
                  <td>{r.last_signOut}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };
  handleDown = async(e) => {
    console.log(e.target.value);
   await  this.setState({month:e.target.value});
    this.getRecords();
  };
  getRecords = () => {
    axios
      .get("http://localhost:5000/staff/attendanceRecords", {
        params: {
          month: this.state.month,
        },
        headers: {
          "auth-token": localStorage.getItem("auth-token"),
        },
      })
      .then((res) => {
        console.log("data:");
        console.log(res.data);
        this.setState({table:res.data.records})
      })
      .catch((error) => {
        console.log(error);
        console.log(error.response);
      });
  };
  missingDays = () => {
    //console.log(this.state.days)
    return (
      <div className="col-sm">
        <label>Missing Days: {this.state.days.length}</label>
        <br />
        <div style={{ width: "10rem" }}>
          <table className="table table-hover">
            <tbody>
              {this.state.days.map((day) => {
                return (
                  <tr key={day} className="table-danger">
                    <td>{day}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  missingHours = () => {
    return (
      <div className="col-sm">
        <label>Extra Hours:</label>
        <div style={{ width: "12rem" }}>
          <table className="table table-hover">
            <tbody>
              <tr className="table-danger">
                <td>
                  Missing Hours:&nbsp;&nbsp;{this.state.hours.missingHours}
                </td>
              </tr>
              <tr className="table-danger">
                <td>
                  Missing Minutes:&nbsp;&nbsp;{this.state.hours.missingMinutes}
                </td>
              </tr>
              <tr className="table-success">
                <td>Extra Hours:&nbsp;&nbsp;{this.state.hours.extraHours}</td>
              </tr>
              <tr className="table-success">
                <td>
                  Extra Minutes:&nbsp;&nbsp;{this.state.hours.extraMinutes}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  getHours = () => {
    axios
      .get("http://localhost:5000/staff/missingHours", {
        headers: {
          "auth-token": localStorage.getItem("auth-token"),
        },
      })
      .then((res) => {
        //console.log("MISSING HOURS");
        //console.log(res.data);
        this.setState({ hours: res.data });
      })
      .catch((err) => {
        console.log(err);
        console.log(err.message);
      });
  };
  getDays = () => {
    axios
      .get("http://localhost:5000/staff/missingDays", {
        headers: {
          "auth-token": localStorage.getItem("auth-token"),
        },
      })
      .then((res) => {
        // console.log(res.data);
        this.setState({ days: res.data });
      })
      .catch((err) => {
        console.log(err.message);
        console.log(err.response);
      });
  };

  updateMissing = () => {
    this.getHours();
    this.getDays();
    this.getRecords();
  };
  componentDidMount = () => {
    this.updateMissing();
    this.getRecords();
  };

  render() {
    return (
      <div className="container">
        <h1 className="text-center mt-5 mb-5">Attendance Records</h1>
        <div className="row mb-5">
          {this.singIn()}
          {this.signOut()}
        </div>

        <div className="row mb-4">
          {this.missingDays()}
          {this.missingHours()}
        </div>

        {this.viewAttendance()}
      </div>
    );
  }
}

export default Attendance;
