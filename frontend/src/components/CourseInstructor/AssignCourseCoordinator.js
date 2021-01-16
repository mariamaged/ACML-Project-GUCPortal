import axios from "axios";
import React from "react";

class AssignCoord extends React.Component {
    state = {
        loadingCourses: true,
        courses: [],
        selectCourse: "",
        curCor: {},

        loadingStaff: false,
        staff: []
    };

    loadCourses = () => {
        axios
            .get("http://localhost:5000/Instructor/coursecoverage", {
                headers: {
                    "x-auth-token": localStorage.getItem("auth-token"),
                },
            })
            .then((res) => {
                console.log(res.data);
                this.setState({ courses: res.data, loadingCourses: false });
            })
            .catch((err) => {
                console.log(err);
                console.log(err.message);
                console.log(err.response)
            });
    };
    componentDidMount = () => {
        this.loadCourses();
    };
    displayCoursesDropdown = () => {
        return (
            <div>
                {this.state.loadingCourses ? loading() : (
                    <div>
                        <label>Selected Course</label>
                        <select onChange={this.handleCourse}>
                            <option value=""> Select A Course</option>
                            {this.state.courses.map((c) => {
                                return <option key={c["course id"]}>{c["course id"]}</option>;
                            })}
                        </select>
                        {this.displayCurCor()}
                    </div>
                )}
            </div>
        );
    };
    displayCurCor = () => {
        let c = this.state.curCor;
        return (
            <div>

                <label>Current Coordinator:</label>
                <div className="col">
                    <div className="row">
                        <div className="col">
                            <label>Name:{c.name}</label>
                        </div></div>
                    <label>Id:{c.id}</label>
                </div>
            </div>
        )
    }
    displayStaff = () => {
        if (this.state.loadingCourses) {
            return null;
        }
        return (<div>

            <table className="table table-hover">
                <thead>
                    <tr className="table-dark">
                        <th scope="col"> Name</th>
                        <th scope="col">Id</th>
                        <th scope="col">Assign</th>


                    </tr>
                </thead>
                <tbody>
                    {this.state.staff.map((s) => {
                        return (
                            <tr className="table-info" key={s.id}>
                                <td>
                                    {s.name}
                                </td>
                                <td>
                                    {s.id}
                                </td>
                                <td >
                                    <button className="btn btn-warning" onClick={() => {
                                        console.log(s.id);
                                        console.log(this.state.selectCourse);
                                        axios.put("http://localhost:5000/Instructor/assigncoordinator", {
                                            courseid: this.state.selectCourse,
                                            coordinatorid: s.id
                                        }, {
                                            headers: {
                                                "x-auth-token": localStorage.getItem("auth-token")
                                            }
                                        }).then((res) => {
                                            alert(res.data.msg);
                                            this.loadStaff()
                                        }).catch((err) => {
                                            if (err.response) {
                                                alert(err.response.data.msg);
                                                console.log(err.response);
                                            } else {
                                                alert(err.message);
                                                console.log(err)
                                            }
                                        })
                                    }}  >Select </button>
                                </td>
                            </tr>

                        )
                    })}
                </tbody>
            </table>


            {this.state.loadingStaff ? loading2() : (this.state.staff.length === 0 ? (
                <h4 className="text-center">No Staff to display</h4>
            ) : (null))}






        </div>)
    }

    handleCourse = async (e) => {
        await this.setState({ selectCourse: e.target.value, loadingStaff: true });
        this.loadStaff();
    }
    loadStaff = () => {
        if (this.state.selectCourse === "") {
            this.setState({ staff: [], loadingStaff: false, curCor: {} });
            return;
        }

        axios.get("http://localhost:5000/Instructor/getcoursestaff", {
            headers: {
                "x-auth-token": localStorage.getItem("auth-token")
            },
            params: {
                cid: this.state.selectCourse
            }
        }).then((res) => {
            console.log(res);
            this.setState({ staff: res.data.staff, loadingStaff: false, curCor: res.data.curCor })
        }).catch((err) => {
            console.log(err);
            console.log(err.message);
            console.log(err.response)
        })
    }

    render() {
        return (
            <div>
                <div className="container">
                    <h1 className="text-center mt-5 mb-5">Assign Course Coordinator</h1>
                    {this.displayCoursesDropdown()}

                    {this.displayStaff()}
                </div>
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

function loading2() {
    return (
        <div className="d-flex justify-content-center">
            <div className="spinner-border" style={loadingStyle2} role="status">
                <span className="sr-only"></span>
            </div>
        </div>
    );
}

const loadingStyle2 = {
    marginTop: "10px",
    width: "3rem",
    height: "3rem",
};
export default AssignCoord;