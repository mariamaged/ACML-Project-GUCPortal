import React from "react";
import home from "../../assets/home.jpg"
import axios from "axios";
import { withRouter } from "react-router-dom"

class Homepage extends React.Component {
    state = {
        loading: true,
        nots: []
    }

    componentDidMount = () => {
        console.log(this.props.history)
        axios.get("http://localhost:5000/staff/allNotifications", {
            headers: {
                "x-auth-token": localStorage.getItem("auth-token")
            }
        }).then(res => {
            console.log(res.data);
            this.setState({ loading: false, nots: res.data })
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
    displayPicture = () => {
        return (
            <div className="container-fluid">
                <img style={{ width: "100%" }} src={home} />
            </div>
        );
    };
    displayCards = () => {
        return (<div className="row">
            <div className="card text-white bg-info mb-3 mr-auto col-m" style={{ maxWidth: "20rem" }}>
                <div className="card-header">Your Notifications</div>
                <div className="card-body">
                    {this.state.loading ? loading() :
                        (<div>
                            {this.state.nots.length === 0 ? (<div>

                                <p>You have no notifications!</p>
                            </div>) :
                                (<div>
                                    <p>{this.state.nots[0]}</p>
                                    <br />
                                    <p>...</p>


                                </div>)}
                        </div>
                        )}
                </div>
            </div>



            <div className="card text-white bg-info mb-3  col-m" style={{ maxWidth: "20rem" }}>
                <div className="card-header">Events</div>
                <div className="card-body">
                    <ul>
                        <li>
                            <p className="card-text">Food @ platform</p>
                        </li>
                        <br />
                        <li>
                            <p className="card-text">Mesh 3aref</p>
                        </li>
                    </ul>
                </div>
            </div>





        </div>)
    }
    render() {
        return <div>

            {this.displayPicture()}
            <div className="container mt-5">
                {this.displayCards()}
            </div>

        </div>;
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
    marginTop: "20px",
    width: "5rem",
    height: "5rem",
};


export default withRouter(Homepage);