// Our Components
import SlotsTable from './slotstable.js';
// React Components
import Tab from 'react-bootstrap/Tab';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// React
import React from 'react';

// Reacter Router and axios
// CSS and images
import './cardcss.css';

const slotsstaff = ({ members }) => {
    const listItems = members.length ? (members.map(staff => {
        return (<ListGroup.Item href={staff.staffID} key={staff.staffID}>
            {staff.staffID + ' ' + staff.staffName}
        </ListGroup.Item>);
    })) : (<div />);

    const tabItems = members.length ? (members.map(staff => {
        return (<Tab.Pane eventKey={staff.staffID} key={staff.staffID}>
            <SlotsTable slots={staff.slotsTaughtbyStaff} isReplaced="undefined" courseIDExists={false} academicMemberIDExists={false}/>
        </Tab.Pane>);
    })) : (<div />);

    return (
        <div>
            <br />
            <Tab.Container id="list-group-tabs-example" defaultActiveKey={members[0].staffID}>
                <Row>
                    <Col sm={4}>
                        <ListGroup>
                            {listItems}
                        </ListGroup>
                    </Col>
                    <Col sm={8}>
                        <Tab.Content>
                            {tabItems}
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </div>
    )
}

export default slotsstaff;

