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
        slots: [],
        showButtons: [true, true]
    }

    addSlot = async (date, number, location, ind) => {
        const oldSlots = this.state.slots;
        const slot = { date: moment(date).format('YYYY-MM-DD'), number: number, locationID: location };
        const newSlots = [...oldSlots, slot];

        const oldShowButtons = this.state.showButtons;
        oldShowButtons[ind] = false;

        this.setState({ slots: newSlots })
    }

    render() {
        return (
            <div>
                <Container>
                    <Row>
                        <Col md="auto">
                            <UpdateCourseSlot locations={this.props.locations} showButton={this.state.showButtons[0]} addSlot={this.addSlot} ind={0} />
                            <UpdateCourseSlot locations={this.props.locations} showButton={this.state.showButtons[1]} addSlot={this.addSlot} ind={1} />
                        </Col>

                        <Col md="auto">
                            <Row>
                                <Col md="auto">
                                    <button type="button" class="btn roundButton"
                                        onClick={() => {this.props.addTwoSlots(this.state.slots, this.props.ind, false)}}> </button>
                                </Col>

                                <Col md="auto">
                                    <button type="button" class="btn SubmitButton"
                                        onClick={() => {this.props.addTwoSlots(this.state.slots, this.props.ind, true)}}> </button>
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

