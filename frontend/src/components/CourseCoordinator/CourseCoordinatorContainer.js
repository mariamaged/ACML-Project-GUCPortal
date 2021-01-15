// Our Components
// React Components
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
// React
import React from 'react'

// Reacter Router and axios
import { LinkContainer } from 'react-router-bootstrap'

const CourseCoordinatorContainer = () => {
    return (
        <Accordion>
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="0">
                    Slots
                     </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                    <div>
                        <LinkContainer to='/assistant/postCourseSlots'><Card.Body>Add Course Slot</Card.Body></LinkContainer>
                        <LinkContainer to='/assistant/deleteCourseSlots'><Card.Body>Delete Course Slot</Card.Body></LinkContainer>
                        <LinkContainer to='/assistant/updateCourseSlots'><Card.Body>Update Course Slot</Card.Body></LinkContainer>
                    </div>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    );
}

export default CourseCoordinatorContainer;

