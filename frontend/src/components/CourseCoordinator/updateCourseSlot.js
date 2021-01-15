// Our Components
// React Components
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// React
import React, { Component } from 'react';
import DatePicker from "react-datepicker";

// Reacter Router and axios

// CSS and images.
import "react-datepicker/dist/react-datepicker.css";
import '../../css/somebuttoncss.css';

class addCourseSlot extends Component {
    state = {
        number: 1,
        locationID: null,
        date: new Date()
    }

    componentDidMount() {
        this.setState({ locationID: this.props.locations[0] });
    }
    changeDate = (date) => {
        this.setState({ date: date });
    }

    handleOnChange = (e) => {
        console.log('target value', e.target.value);
        this.setState({ locationID: e.target.value });
    }

    handleOnClick = (e) => {
        this.setState({ number: Number(e.target.innerHTML) })
        console.log(e.target);
        console.log(this.state);

        // Get the container element
        var btnContainer = document.getElementById("buttons");

        // Get all buttons with class="btn" inside the container
        var btns = btnContainer.getElementsByClassName("btn btn-secondary");

        // Loop through the buttons and add the active class to the current/clicked button
        for (var i = 0; i < btns.length; i++) {
            var current = document.getElementsByClassName("active");
            current[0].className = current[0].className.replace(" active", "");
            e.target.className += " active";
        }
    }
    render() {
        console.log(this.props.locations);
        const locations = this.props.locations.length ? this.props.locations.map(location => {
            return (
                <option>{location}</option>
            );
        }) : (<div></div>);

        let colorLabel = { color: "#4d4d4d" };
        return (
            <Container>
                <Row>
                    <Col md="auto">
                        <h4 class="card-title" style={colorLabel} >Slot Number: </h4>
                        <div class="btn-group mr-2" role="group" aria-label="First group" id="buttons">
                            <button type="button" className="btn btn-secondary active" onClick={this.handleOnClick} id="button1">1</button>
                            <button type="button" className="btn btn-secondary" onClick={this.handleOnClick} id="button2">2</button>
                            <button type="button" className="btn btn-secondary" onClick={this.handleOnClick} id="button3">3</button>
                            <button type="button" className="btn btn-secondary" onClick={this.handleOnClick} id="button4">4</button>
                            <button type="button" className="btn btn-secondary" onClick={this.handleOnClick} id="button5">5</button>
                        </div>
                    </Col>
                    <Col md="auto">
                        <h4 class="card-title" style={colorLabel}> Location: </h4>
                        <div class="form-group">
                            <select class="form-control" onChange={this.handleOnChange}>
                                {locations}
                            </select>
                        </div>
                    </Col>

                    <Col md="auto">
                        <h4 class="card-title" style={colorLabel} > Date: </h4>
                        <DatePicker selected={this.state.date} onChange={(date) => { this.changeDate(date) }} />
                    </Col>
                    {this.props.showButton &&
                        <Col md="auto">
                            <Row>
                                <Col md="auto">
                                    <button type="button" class="btn roundButton" 
                                        onClick={() => this.props.addSlot(this.state.date, this.state.number, this.state.locationID, this.props.ind)}>
                                            <i class="fas fa-check"></i>
                                        </button>
                                </Col>
                            </Row>
                        </Col>
                    }
                </Row>
            </Container>
        )
    }
}

export default addCourseSlot;

