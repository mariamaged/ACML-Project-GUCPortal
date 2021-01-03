import React,{Component} from 'react'
import axios from 'axios'
import {Link,NavLink} from 'react-router-dom'
import  { Redirect } from 'react-router-dom'


class getRequest extends Component{
    state={
        request_id:"0"
    }



componentDidMount(props){
        console.log(this.props.location.state.request_id)
        // console.log("request_id",this.props.location.state.request_id);}
}

        render(){

<div id="wrapper">
   
    <div class="right-section">
       
        <div class="container">44 years old, 6 ft 0 in, 175 lbs
            <p class="blue">Manage My Personal Health Record</p>
            <hr class="line"/>
            <div class="info-box"><span class="fontawesome-envelope fa-icon-lg"></span>Messages (0)
                <br/><span class="status">No New Messages</span>
            </div>
            <div class="info-box"><span class="fontawesome-file-alt fa-icon-lg"></span>
              Chart (1)
                <br/><span class="status">Clinical Summary (1)<br />Education (0)</span>
            </div>
            <div class="info-box"><span class="fontawesome-calendar fa-icon-lg"></span>
              Appointments (0)
                <br/><span class="status">No Future Appt.</span>
            </div>
            <div class="info-box"><span class="fontawesome-money fa-icon-lg"></span>
              Account Balance (0) 
                <br/><span class="status">No Outstanding Balance</span>
            </div>

        </div>
     </div>
</div>

            return(
                
                <div>Get requests</div>
            )
        }

}
export default getRequest