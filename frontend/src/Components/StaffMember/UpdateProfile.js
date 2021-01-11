import axios from "axios";
import React from "react";

class UpdateProfile extends React.Component {
  state = {
    loading: true,
    offices: [],
    selectedOffice: "",
    email: "",
    oldPass:"",
    newPass:"",
    checkPass:""
  };

  componentDidMount() {
    axios
      .get("http://localhost:5000/staff/offices")
      .then((res) => {
       // console.log(res.data);
        this.setState({ loading: false, offices: res.data });
      })
      .catch((error) => {
        console.log(error);
        alert("ERROR OCCURED :\n" + error.message);
      });
  }
  handleDropdown = async (e) => {
    await this.setState({ selectedOffice: e.target.value });
    //
    // console.log(this.state.selectedOffice);
  };
  handleEmail = async (e) => {
    await this.setState({ email: e.target.value });
    //console.log(this.state.email)
  };
  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state.email+"   "+this.state.selectedOffice)
    axios.put("http://localhost:5000/staff/updateProfile",{
        email:this.state.email,
        office:this.state.selectedOffice
    },{
        headers: {
          "auth-token": localStorage.getItem("auth-token"),
        },
      }).then((res)=>{
        alert("INFO CHANGED SUCCESSFULLY")
    }).catch((error)=>{
        console.log();
        alert("ERROR\n"+error.response.data.msg)
    })
  };
  handlePass=async(e)=>{
    await this.setState({[e.target.name]:e.target.value})
    // console.log(this.state.pass);
    // console.log(this.state.pass1);

  }

  submitPass=(e)=>{
      e.preventDefault();
      if(this.state.pass!==this.state.pass1){
          alert("ERROR:\nPASSWORDS MUST MATCH");
      }else{
          axios.put("http://localhost:5000/staff/resetPassword",{
            oldPass:this.state.oldPass,
            newPass:this.state.newPass,
            checkPass:this.state.checkPass
          },{
            headers: {
                "auth-token": localStorage.getItem("auth-token"),
              },
          }).then((res)=>{
              alert("SUCCESS")
          }).catch((error)=>{
              
              console.log(error.response);
              console.error(error.message);
              console.log(error)
              if(error.response){
                alert(error.response.data.msg)    
              }else{
                  alert("ERROR OCCURED\n"+error.message )
              }
              
          })
      }
  }


  passwordReset = () => {
    return (<div>
        <form onSubmit={this.submitPass}>
            <h3>Change Password</h3>
            <label className="mt-2" htmlFor="oldPass">Old Password:</label>
            <input className="form-control"
            style={{ width: "15rem" }} id="oldPass" name="oldPass" type="password" value={this.state.oldPass}  placeholder="Old Password" onChange={this.handlePass}/>

            <label  className="mt-2" htmlFor="newPass">New Password:</label>
            <input  className="form-control"
            style={{ width: "15rem" }} name="newPass" type="password" value={this.state.newPass} id="newPass" placeholder="New Password" onChange={this.handlePass}  />

            <label  className="mt-2" htmlFor="checkPass">Confirm New Password:</label>
            <input  className="form-control"
            style={{ width: "15rem" }} id="checkPass" name="checkPass" type="password" value={this.state.checkPass} placeholder="Confirm New Password" onChange={this.handlePass}/>
           
            <input className="btn btn-primary mt-4" type="submit" onSubmit={this.submitPass}/>
        </form>
    </div>);
  };
  emailChange = () => {
    return (
      <div className="col-sm">
        <div className="form-group">
          <label htmlFor="email" className="">
            New Email:&nbsp;&nbsp;
          </label>

          <input
            id="email"
            value={this.state.email}
            onChange={this.handleEmail}
            type="email"
            placeholder="Enter New Email"
            className="form-control"
            style={{ width: "15rem" }}
          />
        </div>
      </div>
    );
  };
  officeChange = () => {
    return (
      <div className="col-sm">
        <label className="" htmlFor="select">
          New Office:&nbsp;&nbsp;
        </label>
        <select
          id="select"
          className="form-control"
          onChange={this.handleDropdown}
          style={{ width: "15rem" }}
        >
          <option value="">Select an Office</option>
          {this.state.offices.map((o) => {
            return <option key={o._id}>{o.id}</option>;
          })}
          <option>7amada</option>
        </select>
      </div>
    );
  };

  render() {
    return (
      <div>
        <h1 className="text-center mt-5 mb-5">Update profile</h1>
        {this.state.loading ? (
          loading()
        ) : (
          <div>
            <div className="container">
              <form onSubmit={this.handleSubmit}>
                <div className="row">
                  {this.emailChange()}
                  <div
                    className="col-sm"
                    style={{ width: "", background: "" }}
                  ></div>
                  {localStorage.getItem("role") !== "HR"
                    ? this.officeChange()
                    : null}
                </div>
               
                <div className="text-center mt-1">
                  <input
                    onSubmit={this.handleSubmit}
                    className="text-center btn btn-primary"
                    type="submit"
                  />
                </div>
              </form>
              <hr className=""/>
            <div className="mt-5">
              {this.passwordReset()}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

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

export default UpdateProfile;
