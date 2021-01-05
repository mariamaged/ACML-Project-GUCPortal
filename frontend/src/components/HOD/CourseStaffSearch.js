// Our Components

// React Components
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

// React
import React, { Component } from 'react'

// Reacter Router and axios
import { LinkContainer } from 'react-router-bootstrap'

class CourseStaffSearch extends Component {
    state = {
        courseID: null
    }

    handleChange = (e) => {
        this.setState({ courseID: e.target.value });
    }

    render() {
        const url = '/instructor/hodCourseStaff/' + this.state.courseID;
        return (
            <div>
                <br />
                <InputGroup className="mb-3" size="lg" style={{ width: "400px" }}>
                    <FormControl
                        placeholder="Course ID"
                        aria-label="Course ID"
                        aria-describedby="basic-addon2"
                        onChange={this.handleChange}
                    />
                    <InputGroup.Append>
                        <LinkContainer to={url}>
                            <Button variant="outline-secondary">Search!</Button>
                        </LinkContainer>
                    </InputGroup.Append>
                </InputGroup>
            </div>
        )
    }
}

export default CourseStaffSearch;

