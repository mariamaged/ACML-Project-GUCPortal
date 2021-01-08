// Our Components

// React Components
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

// React
import React, { Component } from 'react'

// Reacter Router and axios
import { LinkContainer } from 'react-router-bootstrap'

class Search extends Component {
    state = {
        id: null
    }

    handleChange = (e) => {
        this.setState({ id: e.target.value });
    }

    render() {
        let urlPrefix = "";
        switch(this.props.placeholder) {
            case 'Course ID': urlPrefix = '/instructor/hodCourseStaff/';break;
            case 'Academic Member ID': urlPrefix = '/instructor/hodDepartmentStaffDayOff/';
        }
        return (
            <div>
                <br />
                <InputGroup className="mb-3" size="lg" style={{ width: "400px" }}>
                    <FormControl
                        placeholder={this.props.placeholder}
                        aria-label="Course ID"
                        aria-describedby="basic-addon2"
                        onChange={this.handleChange}
                    />
                    <InputGroup.Append>
                        <LinkContainer to={urlPrefix + this.state.id}>
                            <Button variant="outline-secondary">Search!</Button>
                        </LinkContainer>
                    </InputGroup.Append>
                </InputGroup>
            </div>
        )
    }
}

export default Search;

