import React, {Component} from "react";
import axios from "axios";

export default class Weather extends Component {
    constructor() {
        super();
        this.state = {
            weather: "Not known yet"
        }
    }

    getWeather = () => {
        axios.get('/trialEndpoint').then(response => {
            this.setState({weather: response.data.value});
        });
    }

    render() {
        return (
            <div>
                <button onClick={this.getWeather}>Get weather in toronto</button>
                <h1>The weather in toronto is: {this.state.weather}</h1>
            </div>
        )
    }
}