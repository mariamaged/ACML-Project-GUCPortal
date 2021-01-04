// Our Components
// React Components
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

// React
import React from 'react'

// Reacter Router and axios
import { LinkContainer } from 'react-router-bootstrap'

//import './HODNavbar.css';
const HODNavbar = () => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Navbar.Brand>HOD</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" /> 
            <Navbar.Collapse id="responsive-navbar-nav"> 
            <Nav className="mr-auto">
                <NavDropdown title="Department" id="hod-dropdown-department">
                    <LinkContainer to='/homepage/hod/department-staff'>
                        <NavDropdown.Item>Staff</NavDropdown.Item>
                    </LinkContainer>

                    <LinkContainer to='/homepage/hod/department-course-staff'>
                        <NavDropdown.Item>Course Staff</NavDropdown.Item>
                    </LinkContainer>
                </NavDropdown>

                <NavDropdown title="Course" id="hod-dropdown-course">
                    <LinkContainer to='/homepage/hod/course-coverage'>
                        <NavDropdown.Item>Course Coverage</NavDropdown.Item>
                    </LinkContainer>

                    <LinkContainer to='/homepage/hod/course-teaching-assignment'>
                        <NavDropdown.Item>Teaching Assignment</NavDropdown.Item>
                    </LinkContainer>
                </NavDropdown>
            </Nav>
           </Navbar.Collapse> 
        </Navbar>
    )
}

export default HODNavbar;