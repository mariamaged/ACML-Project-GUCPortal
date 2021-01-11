import axios from "axios";
import React from "react";
import male from "../../assets/male.png";
import female from "../../assets/female.png";

class ViewProfile extends React.Component {
  state = {
    loading: true,
    user: {},
  };

  componentDidMount() {
    axios
      .get("http://localhost:5000/staff/profile", {
        headers: {
          "auth-token": localStorage.getItem("auth-token"),
        },
      })
      .then((res) => {
        console.log(res.data);
        this.setState({
          loading: false,
          user: res.data,
        });
        console.log(this.state.user);
      })
      .catch((error) => {
        console.error(error.response);
        alert(error.response.data);
      });
  }

  render() {
    return (
      <div>
        {this.state.loading ? (
          loading()
        ) : (
          <div>
            <div>{picture(this.state.user)}</div>
            <h1 className="text-center mt-3 d-block">{this.state.user.name}</h1>
            <div className="container">
              <div className="row mb-3">
                <div
                  className="d-inline-flex col-sm "
                  style={{
                    background: "",
                    display: "flex",
                    alignItems: "flex-end",
                  }}
                >
                  <h6 className="">Email:&nbsp;&nbsp;</h6>
                  <h5>{this.state.user.email}</h5>
                </div>
                <div
                  className="col-sm"
                  style={{ width: "5rem", background: "" }}
                ></div>

                <div
                  className="d-inline-flex col-sm"
                  style={{
                    background: "",
                    display: "flex",
                    alignItems: "flex-end",
                  }}
                >
                  <h6 className="">Office:&nbsp;&nbsp;</h6>
                  <h5>{this.state.user.office}</h5>
                </div>
                <br/>
                <br/>
              </div>
              <div className="row mb-3">
                <div
                  className="d-inline-flex col-sm "
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                  }}
                >
                  <h6 className="">ID:&nbsp;&nbsp;</h6>
                  <h5>{this.state.user.id}</h5>
                </div>
                <div
                  className="col-sm"
                  style={{ width: "5rem", background: "" }}
                ></div>

                <div
                  className="d-inline-flex col-sm "
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                  }}
                >
                  <h6 className="">Salary:&nbsp;&nbsp;</h6>
                  <h5>{this.state.user.salary}</h5>
                </div>
              </div>
              <div className="row">
                <div
                  className="d-inline-flex col-sm "
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                  }}
                >
                  <h6 className="">Day off:&nbsp;&nbsp;</h6>
                  <h5>{this.state.user.dayOff}</h5>
                </div>
                <div
                  className="col-sm"
                  style={{ width: "5rem", background: "" }}
                ></div>

                <div
                  className="d-inline-flex col-sm "
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                  }}
                >
                 
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

function picture(user) {
  console.log(user.gender);
  if (user.gender === "Male") {
    return (
        <div className="text-center mt-5 d-block" >
        <img alt="profile img" style={picStyle} src={male}></img>
      </div>
    );
  }
  if (user.gender === "Female") {
    return (
        <div className="text-center mt-5 d-block" alt="profile img">
          <img alt="profile img" style={picStyle} src={female}></img>
        </div>
      
    );
  }
  return <div>7aga 8ALAT</div>;
}

// function profile(user){
//     return(
//         <div>
//           {user}
//         </div>
//     )
// }
function loading() {
  return (
    <div className="d-flex justify-content-center">
      <div className="spinner-border" style={loadingStyle} role="status">
        <span className="sr-only"></span>
      </div>
    </div>
  );
}

const loadingStyle = {
  marginTop: "200px",
  width: "5rem",
  height: "5rem",
};

const picStyle = {
  width: "10rem",
  height: "10rem",
};
export default ViewProfile;
