// Our Components
// React Components
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { CheckCircleFill } from 'react-bootstrap-icons';

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
        console.log(this.props.showButton);
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
                        {this.props.ind == 0 &&<h5 class="card-title" style={colorLabel} >Old Slot Number </h5>}
                        {this.props.ind == 1 &&<h5 class="card-title" style={colorLabel} >New Slot Number </h5>}
                        <div class="btn-group mr-2" role="group" aria-label="First group" id="buttons">
                            <button type="button" className="btn btn-secondary active" onClick={this.handleOnClick} id="button1">1</button>
                            <button type="button" className="btn btn-secondary" onClick={this.handleOnClick} id="button2">2</button>
                            <button type="button" className="btn btn-secondary" onClick={this.handleOnClick} id="button3">3</button>
                            <button type="button" className="btn btn-secondary" onClick={this.handleOnClick} id="button4">4</button>
                            <button type="button" className="btn btn-secondary" onClick={this.handleOnClick} id="button5">5</button>
                        </div>
                        
                    </Col>
                    <Col md="auto">
                        <h5 class="card-title" style={colorLabel}> Location: </h5>
                        <div class="form-group">
                            <select class="form-control" onChange={this.handleOnChange}>
                                {locations}
                            </select>
                        </div>
                    </Col>

                    <Col md="auto">
                        <h5 class="card-title" style={colorLabel} > Date: </h5>
                        <DatePicker selected={this.state.date} onChange={(date) => { this.changeDate(date) }} />
                    </Col>

                    {this.props.showButton &&
                        <Col md="auto">
                            <Row>
                                {this.props.showButton &&
                                    <Col md="auto">
                                        <CheckCircleFill className="cancelBtn" size={30} color="#888" onClick={() => { this.props.addSlot(this.state.date, this.state.number, this.state.locationID, this.props.ind) }}/>
                                    </Col>
                                }
                            </Row>
                        </Col>
                    }
                </Row>
            </Container>
        )
    }
}

export default addCourseSlot;

