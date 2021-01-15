import axios from "axios";
import React from "react";
import {withRouter} from "react-router-dom"

class Logout extends React.Component{

    handleClick=()=>{
        axios.get("http://localhost:5000/staff/logout",{
            headers:{
                "auth-token":localStorage.getItem("auth-token")
            }
        }).then((res)=>{
            alert(res.data.msg);
            
            localStorage.removeItem("role");
            localStorage.removeItem("newMember");
            localStorage.removeItem("auth-token")
            
            this.props.history.push("/");
        }).catch((err)=>{
            if(err.response){
                alert(err.response.data.msg)
                console.log(err.response)
            }else{
                alert(err.message);
                console.log(err)
            }
        })
    }
    render(){
        return(
            <div>
                <button className="btn btn-danger" onClick={this.handleClick}>Logout</button>
            </div>
        )
    }

}

export default withRouter(Logout)