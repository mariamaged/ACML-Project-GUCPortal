import axios from "axios";
import React from "react";

class Notifications extends React.Component {
    state = {
        loading: false,
        notifications: []
    }

    componentDidMount = () => {
        axios.get("http://localhost:5000/staff/allNotifications", {
            headers: {
                "x-auth-token": localStorage.getItem("auth-token")
            }
        }).then(res => {
            console.log(res.data)
            this.setState({ loading: false, notifications: res.data })

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
    displayNots = () => {
        return (

            <div className="container mt-5">
                <table className="table table-hover text-center">
                    <tbody>
                        {this.state.notifications.map(n => {
                            return (
                                <tr className="table-info ">
                                    <td className="text-center">
                                        {n}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
    }

    render() {
        return (
            <div className="container">
                <h1 className="text-center mt-5">Notifications</h1>
                {this.state.loading ? loading() : this.displayNots()}
            </div>
        )
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

export default Notifications