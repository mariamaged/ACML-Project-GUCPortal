// Our Components
import UpdateCourseSlot from './updateCourseSlot.js';

// React Components
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

// React
import React, { Component } from 'react';

// Reacter Router and axios

// CSS and images
import moment from 'moment';
import '../../css/somebuttoncss.css'

class twoSlots extends Component {
    state = {
        slots: {},
        showButtonsTwo: [true, true]
    }

    addSlot = async (date, number, location, ind) => {
        const oldSlots = this.state.slots;
        const slot = { date: moment(date).format('YYYY-MM-DD'), number: number, locationID: location };
        if (ind == 0) oldSlots.oldSlot = slot;
        else oldSlots.newSlot = slot;

        const oldShowButtons = this.state.showButtonsTwo;
        oldShowButtons[ind] = false;
        this.setState({showButtonsTwo: oldShowButtons});
    }

    render() {
        const allEntries = [];
        for (var i = 0; i < 2; i++) {
            allEntries.push(<div key={i}>
                <UpdateCourseSlot locations={this.props.locations} showButton={this.state.showButtonsTwo[i]} addSlot={this.addSlot} ind={i} />
            </div>);
        }
        return (
            <div>
                <Container>
                    <Row>
                        <Col md="auto">
                            {allEntries}
                        </Col>

                        <Col md="auto">
                            <Row>
                                <Col md="auto">
                                    <button type="button" class="btn roundButton"
                                        onClick={() => { this.props.addTwoSlots(this.state.slots, this.props.ind, false) }}>+</button>
                                </Col>

                                <Col md="auto">
                                    <button type="button" class="btn submitButton"
                                        onClick={() => { this.props.addTwoSlots(this.state.slots, this.props.ind, true) }}>Submit</button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div >
        )
    }
}

export default twoSlots;

