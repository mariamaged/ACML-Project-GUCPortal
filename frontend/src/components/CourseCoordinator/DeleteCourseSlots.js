// Our Components
import AddCourseSlot from './addCourseSlot.js';
import Warning from '../Other/warning.js';

// React Components
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Jumbotron from 'react-bootstrap/Jumbotron';

// React
import React, { Component } from 'react';

// Reacter Router and axios
import axios from 'axios';

// CSS and images
import moment from 'moment';

class DeleteCourseSlots extends Component {
    state = {
        locations: [],
        slots: [],
        number: 1,
        showButtons: [true],
        warningFlag: false,
        warning: null,
        courseID: null
    }

    componentDidMount() {
        axios.get('http://localhost:5000/academic/teachingLocations', {
            headers: {
                'x-auth-token': localStorage.getItem("auth-token")
            }
        })
            .then(response => {
                this.setState({ locations: response.data });
                console.log(response.data);
                console.log(this.state);
            })
            .catch(error => {
                console.log('Error with getting tutorial rooms/lecture halls.');
                console.log(error);
            });

    }

    addSlot = async (date, number, location, ind, flag) => {
        const oldSlots = this.state.slots;
        const slot = { date: moment(date).format('YYYY-MM-DD'), number: number, locationID: location };
        const newSlots = [...oldSlots, slot];

        const oldShowButtons = this.state.showButtons;
        oldShowButtons[ind] = false;
        oldShowButtons.push(true);

        if (!flag) {
            await this.setState({ slots: newSlots, number: this.state.number + 1 });
            console.log("Post", this.state);
        }
        else {
            await this.setState({ slots: newSlots });
            console.log("Post", this.state);
            console.log('To submit!');

            const requestBody = { courseID: this.state.courseID, details: this.state.slots };
            console.log(requestBody);

            axios.delete('http://localhost:5000/coursecoordinator/courseSlots', {
                data: requestBody,
                headers: {
                    'x-auth-token': localStorage.getItem("auth-token")
                }
            })
                .then(response => {
                    this.setState({ warningFlag: true, warning: response.data });
                    console.log(response.data);
                    console.log(this.state);
                })
                .catch(error => {
                    this.setState({ warningFlag: true, warning: error.response.message })
                    console.log(error);
                    console.log(error.response.data);
                });
        }

    }

    handleOnChange = (e) => {
        this.setState({ courseID: e.target.value });
    }
    render() {
        const allEntries = [];
        for (var i = 0; i < this.state.number; i++) {
            allEntries.push(<div key={i}>
                <AddCourseSlot locations={this.state.locations} showButton={this.state.showButtons[i]} addSlot={this.addSlot} ind={i} />
            </div>);
        }

        let colorLabel = { color: "#4d4d4d" };
        let frameStyle = {
            borderRadius: "10px",
            border: "1.5px solid #78c2ad",
            paddingTop: "25px"
        }
        return (
            <div className="container">
                <br />
                <br />
                <div style={frameStyle}>
                    {!this.state.warningFlag &&
                        <Container>
                            <Row>
                                <Col md="auto"> <h4 class="card-title" style={colorLabel} >Course ID: </h4></Col>
                                <Col md="auto">
                                    <div class="form-group">
                                        <input type="text" class="form-control" id="courseID" onChange={this.handleOnChange} />
                                    </div>
                                </Col>
                            </Row>
                            <Jumbotron>
                                {allEntries}
                            </Jumbotron>
                        </Container>

                    }

                    {
                        this.state.warningFlag &&
                        <Warning warning={this.state.warning} />
                    }
                </div>
            </div >
        )
    }
}

export default DeleteCourseSlots;

