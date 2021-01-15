import React, { Component } from 'react'
import axios from 'axios';


class UpdateAssignment extends Component{
    state = {
        courseId:"",
        memid:"",
        number:"",
        slocation:"",
        day:"",
        
        warning:"-1",
        warningmsg:""
    }
    changecid(event) {
        this.setState({
            courseId: event.target.value
        })
    }
    changeday(event) {
        this.setState({
            day: event.target.value
        })
    }
    changeslot(event) {
        this.setState({
            number: event.target.value
        })
    }
    changeLocation(event) {
        this.setState({
            slocation: event.target.value
        })
    }
    changemid(event) {
        this.setState({
            memid: event.target.value
        })
    }
    changeclick(event) {
        event.preventDefault();
        console.log(this.state);
        
        

        axios.post('http://localhost:5000/Instructor/Assignment', {
            courseid:this.state.courseId,
            day:this.state.day,
            number:this.state.number,
            slocation:this.state.slocation,
            memid:this.state.memid},
            {
            headers: {
                'auth-token': localStorage.getItem("auth-token")
            }
        })
        
            .then(res => {
                this.setState({warning:1});
                let result = res.data;
                console.log(result);
            })
            .catch(e => {
                this.setState({warning:0,warningmsg:e.response.data.msg});
                console.log(e.response);
            });



    }


    render(){

        const warning = this.state.warning;
        let button;
        if(warning===-1){
            button = <div></div>
        }
        else{

        if (warning===0) {
          button = <div class="alert alert-dismissible alert-danger">
          <button type="button" class="close" data-dismiss="alert">&times;</button>
          <strong>Oh snap!</strong> <a href="#" class="alert-link">{this.state.warningmsg}</a>.
        </div>;
        
        } else {
            if(warning===1){
          button = <div class="alert alert-dismissible alert-success">
          <button type="button" class="close" data-dismiss="alert">&times;</button>
          <strong>Operation Successfull!</strong> You successfully assigned a member to this assignment slot <a href="#" class="alert-link"></a>.
        </div>;
            }
        }
    }
        
        return(
            <div>

                <h1 >Assign an Acadmeic Member To an Unassigned Slot</h1>

                <div class="form-group">
                    <label for="exampleInputEmail1">Course Name:</label>
                    <input class="form-control" placeholder="Enter Course ID" onChange={this.changecid.bind(this)}></input>
                </div>

                <div class="form-group">
                    <label for="exampleSelect1">Slot:</label>
                    <select class="form-control" id="exampleSelect1" onChange={this.changeslot.bind(this)}>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                    </select>
                </div>


                <div class="form-group">
                    <label for="exampleSelect1">Day:</label>
                    <select class="form-control" id="exampleSelect1" onChange={this.changeday.bind(this)}>
                        <option>Sunday</option>
                        <option>Monday</option>
                        <option>Tuesday</option>
                        <option>Wednsday</option>
                        <option>Thursday</option>
                        <option>Saturday</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="exampleInputEmail1">Slot Location:</label>
                    <input class="form-control" placeholder="Enter Slot Location" onChange={this.changeLocation.bind(this)}></input>
                </div>

                <div class="form-group">
                    <label for="exampleInputEmail1">Member ID:</label>
                    <input class="form-control" placeholder="Enter Member ID" onChange={this.changemid.bind(this)}></input>
                </div>

                <button type="button" class="btn btn-primary btn-lg btn-block" onClick={this.changeclick.bind(this)} >Submit</button>

              {button}

            </div>
        )
    }
}

export default UpdateAssignment