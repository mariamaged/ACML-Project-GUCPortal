// Our Components
import Warning from '../Other/warning.js';
// React Components
// React
import React, { Component } from 'react'

// Reacter Router and axios
import axios from 'axios';

// CSS and images
import '../../css/cardcss.css';

class OneCourseCoverage extends Component {
    state = {
        courseCoverage: null,
        warningFlag: false,
        warning: null
    }

    componentDidMount() {
        const courseID = this.props.match.params.courseID;
        console.log(courseID);
        axios.get('http://localhost:5000/HOD/courseCoverage/' + courseID, {
            headers: {
                'x-auth-token': localStorage.getItem("auth-token")
            }
        })
            .then(response => {
                this.setState({ courseCoverage: response.data, warningFlag: false });
                console.log(response.data);
                console.log(this.state);
            })
            .catch(error => {
                this.setState({ warning: error.response.data, warningFlag: true });
                console.log('Error with getting course coverage for a certain course under your department.');
                console.log(error);
            });
    }

    componentDidUpdate(prevProps) {
        if(prevProps !== this.props) {
        const courseID = this.props.match.params.courseID;
        console.log(courseID);
        axios.get('http://localhost:5000/HOD/courseCoverage/' + courseID, {
            headers: {
                'x-auth-token': localStorage.getItem("auth-token")
            }
        })
            .then(response => {
                this.setState({ courseCoverage: response.data, warningFlag: false });
                console.log(response.data);
                console.log(this.state);
            })
            .catch(error => {
                this.setState({ warning: error.response.data, warningFlag: true });
                console.log('Error with getting course coverage for a certain course under your department.');
                console.log(error);
            });
    }
}
    render() {  
        return (
            <div className="container">
                <br />
                <br />
                {!this.state.warningFlag && <div class="card border-secondary mb-3">
                    <div class="card-header">{this.props.match.params.courseID}</div>
                    <div class="card-body">
                        <h4 class="card-title" style={{ color: "#4d4d4d" }}>{this.state.courseCoverage}</h4>
                    </div>
                </div>}
                {this.state.warningFlag && <Warning warning={this.state.warning} />}
            </div>
        )
    }
}

export default OneCourseCoverage;

