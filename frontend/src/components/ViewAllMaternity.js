import React,{Component} from 'react'
import axios from 'axios'
import { Button, Table } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown'
import '../css/test44.css'
import DropdownButton from 'react-bootstrap/DropdownButton'
// import Dropdown from 'react-bootstrap/Dropdown'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import history from '../history';
import {Link,NavLink} from 'react-router-dom'
import  { Redirect } from 'react-router-dom'
import { CheckCircle, XCircle } from 'react-bootstrap-icons';
import ViewAcceptedMaternityRequests from './ViewAcceptedMaternityRequests'
import ViewRejectedMaternityRequests from './ViewRejectedMaternityRequests'
import ViewPendingMaternityRequests from './ViewPendingMaternityRequests'
class ViewAllMaternity extends Component{
    state={
        sickRequests:[],
        maternityRequests:[],
        accidentalRequests:[],
        compensationRequests:[],
        changeDayRequests:[]
    }
    componentDidMount(){
    console.log("in view")
    //get sick
        // axios.get('http://localhost:5000/academic/acceptedSickRequests',
        // {
        //     headers:{
        //         'x-auth-token':localStorage.getItem('jwtToken'),
        //         'gender':'female'
        //     }
        // }
        // ).then(res=>{
        //     console.log(res.data[0].reqType)
        //     this.setState({sickRequests:res.data})
        //     console.log("new state= "+this.state.requests)

        // }).catch(console.log("error"))

        // //get accidental
        // axios.get('http://localhost:5000/academic/acceptedAccidentalRequests',
        // {
        //     headers:{
        //         'x-auth-token':localStorage.getItem('jwtToken')
        //     }
        // }
        // ).then(res=>{
        //     // console.log(res.data[0].reqType)
        //     this.setState({accidentalRequests:res.data})
        //     console.log("new state= "+this.state.requests)

        // }).catch(console.log("error"))


        // //get compensation 
        //  axios.get('http://localhost:5000/academic/acceptedCompensationRequests',
        // {
        //     headers:{
        //         'x-auth-token':localStorage.getItem('jwtToken')
        //     }
        // }
        // ).then(res=>{
        //     console.log(res.data[0].reqType)
        //     this.setState({compensationRequests:res.data})
        //     console.log("new state= "+this.state.requests)

        // }).catch(console.log("error"))


    }








       
    render(){
        const sickReqs=this.state.sickRequests;
        // const maternityReqs=this.state.maternityRequests;
        // const annualReqs=this.state.sickRequests;
       const reqList=
        <div>

        <div>
        <h1>Accepted</h1>
        <ViewAcceptedMaternityRequests/>
        </div>

        <div>
        <h1>Rejected</h1>
        <ViewRejectedMaternityRequests/>
        </div>

        <div>
        <h1>Pending</h1>
        <ViewPendingMaternityRequests/>
        </div>

        </div>
        return (
           
           reqList
        )
    }
}

export default ViewAllMaternity