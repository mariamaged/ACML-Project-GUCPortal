import React, { Component } from 'react'
import axios from 'axios';


class RemoveAcMem extends Component {
    state = {
        courseID: "",
        memID: "",
        warning: "-1",
        warningmsg: ""
    }
    changecid(event) {
        this.setState({
            courseID: event.target.value
        })
    }
    changemem(event) {
        this.setState({
            memID: event.target.value
        })
    }

    changeclick(event) {
        event.preventDefault();
        console.log(this.state);

        axios.post('http://localhost:5000/Instructor/removeAssignedAcademic', {
            courseID: this.state.courseID,
            academicMemberID: this.state.memID
        },
            {
                headers: {
                    'auth-token': localStorage.getItem("auth-token")
                }
            })

            .then(res => {
                this.setState({ warning: 1 });
                let result = res.data;
                console.log(result);
            })
            .catch(e => {
                this.setState({ warning: 0, warningmsg: e.response.data.msg });
                console.log(e.response);
            });



    }

    render() {
        const warning = this.state.warning;
        let button;
        if (warning === -1) {
            button = <div></div>
        }
        else {
            if (warning === 0) {
                button = <div class="alert alert-dismissible alert-danger">
                    <button type="button" class="close" data-dismiss="alert">&times;</button>
                    <strong>Oh snap!</strong> <a href="#" class="alert-link">{this.state.warningmsg}</a>.
        </div>;

            } else {
                if (warning === 1) {
                    button = <div class="alert alert-dismissible alert-success">
                        <button type="button" class="close" data-dismiss="alert">&times;</button>
                        <strong>Operation Successfull!</strong> You successfully deleted a member from the {this.state.courseId} course <a href="#" class="alert-link"></a>.
        </div>;
                }
            }
        }

        return (
            <div>

                <h1 >Remove an Academic Member From a Course</h1>

                <div class="form-group">
                    <label for="exampleInputEmail1">Course ID:</label>
                    <input class="form-control" placeholder="Enter Course ID" onChange={this.changecid.bind(this)}></input>
                </div>

                <div class="form-group">
                    <label for="exampleInputEmail1">Member ID:</label>
                    <input class="form-control" placeholder="Enter Member ID" onChange={this.changemem.bind(this)}></input>
                </div>

                <button type="button" class="btn btn-primary btn-lg btn-block" onClick={this.changeclick.bind(this)} >Delete</button>

                {button}

            </div>
        )
    }
}

export default RemoveAcMem