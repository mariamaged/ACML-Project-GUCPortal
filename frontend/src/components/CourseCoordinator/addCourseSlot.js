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

class addCourseSlot extends Component {
    state = {
        number: null,
        location: null,
        date: new Date()
    }

    handleOnChange = (e) => {
        [e.target.name] = e.target.value;
    }

    handleOnClick = (e) => {
        this.setState({ number: e.target.innerHTML })
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
        return (
            <Container>
                <Row>
                    <Col md="auto">
                        <h4 class="card-title" style={{ color: "#4d4d4d" }} >Slot Number: </h4>
                        <div class="btn-group mr-2" role="group" aria-label="First group" id="buttons">
                            <button type="button" className="btn btn-secondary active" onClick={this.handleOnClick} id="button1">1</button>
                            <button type="button" className="btn btn-secondary" onClick={this.handleOnClick} id="button2">2</button>
                            <button type="button" className="btn btn-secondary" onClick={this.handleOnClick} id="button3">3</button>
                            <button type="button" className="btn btn-secondary" onClick={this.handleOnClick} id="button4">4</button>
                            <button type="button" className="btn btn-secondary" onClick={this.handleOnClick} id="button5">5</button>
                        </div>
                    </Col>
                    <Col md="auto">
                        <h4 class="card-title" style={{ color: "#4d4d4d" }}> Location: </h4>
                        <div class="form-group">
                            <select class="form-control" id="exampleSelect1" onChange={this.handleChange} name="location">
                                {locations}
                            </select>
                        </div>
                    </Col>

                    <Col md="auto">
                        <h4 class="card-title" style={{ color: "#4d4d4d" }} > Date: </h4>
                        <DatePicker selected={this.state.date} onChange={this.handleChange} name="date" value={this.state.date}/>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default addCourseSlot;

