import React,{Component} from 'react'
import axios from 'axios'
import { Button, Table } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown'
import '../css/test44.css'
// import '../css/bootstrap.min.css'
import DropdownButton from 'react-bootstrap/DropdownButton'
// import Dropdown from 'react-bootstrap/Dropdown'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import history from '../history';
import {Link,NavLink} from 'react-router-dom'
import  { Redirect } from 'react-router-dom'
import { CheckCircle, XCircle, XCircleFill } from 'react-bootstrap-icons';

class callGetRequets extends Component{
    render(){
     const g=   <Link to= {{pathname:'/submittedRequests',state:{reqType:"Sick Leave",reqTitle:"Sick Leave Requests"}}}>Click me</Link>
   
    return (
                <div>
                  {g} 
                </div>
    )
}
 }

 export default callGetRequets