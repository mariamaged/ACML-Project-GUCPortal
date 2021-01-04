// Our Components
// React Components
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
// React
import React from 'react'

// Reacter Router and axios
import { LinkContainer } from 'react-router-bootstrap'

const StaffContainer = () => {
    return (
        <Accordion>
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="0">
                    Department
                     </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                    <div>
                        <LinkContainer to='/viewDepartmentStaff'><Card.Body>View Staff</Card.Body></LinkContainer>
                        <LinkContainer to='/viewDepartmentStaffDayOff'><Card.Body>View Staff Day Off</Card.Body></LinkContainer>
                    </div>
                </Accordion.Collapse>
            </Card>
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="1">
                    Course
                    </Accordion.Toggle>
                <Accordion.Collapse eventKey="1">
                <div>
                        <LinkContainer to='/viewCourseStaff'><Card.Body>View Course Staff</Card.Body></LinkContainer>
                    </div>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    );
}

export default StaffContainer;

