// Our Components
import SlotsTable from '../Other/slotstable.js';
// React Components
// React
import React, { Component } from 'react';

// Reacter Router and axios
// CSS and images
import '../../css/cardcss.css';
import axios from 'axios';

class scheduleoptions extends Component {
    state = {
        scheduleThisWeekReplaced: [],
        scheduleThisWeekNotReplaced: [],
        scheduleAllSemesterReplaced: [],
        scheduleAllSemesterNotReplaced: []
    }
    componentDidMount() {
        axios.get('http://localhost:5000/academic/viewScheduleAllSemester', {
            headers: {
                'x-auth-token': localStorage.getItem("auth-token")
            }
        })
            .then(response => {
                this.setState({ scheduleAllSemesterNotReplaced: response.data.normalSlots, scheduleAllSemesterReplaced: response.data.replacementSlots });
                console.log(response.data);
                console.log(this.state);
            })
            .catch(error => {
                console.log('Error with getting schedule for the entire semester.');
                console.log(error);
            });

        axios.get('http://localhost:5000/academic/viewScheduleThisWeek', {
            headers: {
                'x-auth-token': localStorage.getItem("auth-token")
            }
        })
            .then(response => {
                this.setState({ scheduleThisWeekNotReplaced: response.data.normalSlots, scheduleThisWeekReplaced: response.data.replacementSlots });
                console.log(response.data);
                console.log(this.state);
            })
            .catch(error => {
                console.log('Error with getting schedule for the this week.');
                console.log(error);
            });
    }
    render() {
        return (
            <div className="container">
                <br />
                <br />
                <ul class="nav nav-tabs">
                    <li class="nav-item">
                        <a class="nav-link active" data-toggle="tab" href="#allsemester">Schedule All Semester</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-toggle="tab" href="#thisweek">Schedule This Week</a>
                    </li>
                </ul>
                <div id="myTabContent" class="tab-content">
                    <div class="tab-pane fade show active" id="allsemester">
                        <br />
                        <h2>Normal Slots</h2>
                        <br />
                        <SlotsTable slots={this.state.scheduleAllSemesterNotReplaced} isReplaced="false" courseIDExists={true} academicMemberIDExists={false}/>
                        <h2>Replacement Slots</h2>
                        <br />
                        <SlotsTable slots={this.state.scheduleAllSemesterReplaced} isReplaced="true" courseIDExists={true} academicMemberIDExists={false} />
                    </div>
                    <div class="tab-pane fade" id="thisweek">
                        <br />
                        <h2>Normal Slots</h2>
                        <br />
                        <SlotsTable slots={this.state.scheduleThisWeekNotReplaced} isReplaced="false" courseIDExists={true} academicMemberIDExists={false}  />
                        <h2>Replacement Slots</h2>
                        <br />
                        <SlotsTable slots={this.state.scheduleThisWeekReplaced} isReplaced="true" courseIDExists={true} academicMemberIDExists={false}  />
                    </div>
                </div>
            </div>
        )
    }
}

export default scheduleoptions;

