// Our Components
import AddCourseSlot from './addCourseSlot.js';

// React Components
// React
import React, { Component } from 'react';

// Reacter Router and axios
import axios from 'axios';

// CSS and images

class PostCourseSlots extends Component {
    state = {
        locations: []
    }

    componentDidMount() {
        axios.get('http://localhost:5000/academic/teachingLocations', {
            headers: {
                'x-auth-token': localStorage.getItem("auth-token")
            }
        })
            .then(response => {
                this.setState({ locations: response.data });
                console.log(response.data);
                console.log(this.state);
            })
            .catch(error => {
                console.log('Error with getting tutorial rooms/lecture halls.');
                console.log(error);
            });

    }
    render() {
        return (
            <div className = "container">
                <br />
                <br />
                <AddCourseSlot locations={this.state.locations} />
            </div>
        )
    }
}

export default PostCourseSlots;

