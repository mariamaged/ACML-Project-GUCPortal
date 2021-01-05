import React,{Component} from 'react'
import axios from 'axios'
import { Button, Table } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown'
// import '../css/test44.css'
// import '../css/bootstrap.min.css'
import DropdownButton from 'react-bootstrap/DropdownButton'
// import Dropdown from 'react-bootstrap/Dropdown'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import history from '../history';
import {Link,NavLink} from 'react-router-dom'
import  { Redirect } from 'react-router-dom'
import { CheckCircle, XCircle } from 'react-bootstrap-icons';
import '../css/sentList.css'
class sentList extends Component{
    render(){
        return(

        <div className="sentDrop d-inline-block">
            <DropdownButton id="dropdown-basic-button" className="dropSent" title="Dropdown button">
            <Dropdown.Item href="#/action-1">Sick Leave Requests</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Compensation Requests</Dropdown.Item>
            {/* <Dropdown.Item href="#/action-3">Annaul Leave Requests</Dropdown.Item> */}
            <Dropdown.Item href="#/action-1">Maternity Leave Requests</Dropdown.Item>
            <Dropdown.Item href="#/action-1">Slot Linking Requests</Dropdown.Item>
            <Dropdown.Item href="#/action-1">Change Day-Off Requests</Dropdown.Item>
            <Dropdown.Item href="#/action-1">Replacement Requests</Dropdown.Item>
            
            </DropdownButton>
        </div>

        

        )
    }
}

export default sentList