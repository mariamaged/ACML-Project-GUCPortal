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

class getRequestsForms extends Component{
    render(){

        const r=
        <div>
        <div className="reqForm">
            <span className="maternityH">Requests Forms</span>
            <DropdownButton id="dropdown-basic-button" title="Dropdown button" className="reqFormDrop">
            <Dropdown.Item><Link to= {{pathname:'/requestsForms',state:{formType:"Accidental Leave",formTitle:"Accidental Leave Request Form"}}} >Accidental Leave Request</Link></Dropdown.Item>
            <Dropdown.Item><Link to= {{pathname:'/requestsForms',state:{formType:"Annual Leave",formTitle:"Annual Leave Request Form"}}}>Annual Leave Request</Link></Dropdown.Item>
            <Dropdown.Item><Link to= {{pathname:'/requestsForms',state:{formType:"Change Day off",formTitle:"Change Day Off Request Form"}}}>Change Day Off Request</Link></Dropdown.Item>
            <Dropdown.Item><Link to= {{pathname:'/requestsForms',state:{formType:"Compensation Leave",formTitle:"Compensation Request Form"}}}>Compensation Request</Link></Dropdown.Item>
            <Dropdown.Item><Link to= {{pathname:'/requestsForms',state:{formType:"Maternity Leave",formTitle:"Maternity Leave Request Form"}}}>Maternity Leave Request</Link></Dropdown.Item>
            <Dropdown.Item><Link to= {{pathname:'/requestsForms',state:{formType:"Replacement",formTitle:"Replacement Request Form"}}}>Replacement Request</Link></Dropdown.Item>
            <Dropdown.Item><Link to= {{pathname:'/requestsForms',state:{formType:"Sick Leave",formTitle:"Sick Leave Request Form"}}}>Sick Leave Request</Link></Dropdown.Item>
            <Dropdown.Item><Link to= {{pathname:'/requestsForms',state:{formType:"Slot Linking",formTitle:"Slot Linking Request Form"}}}>Slot Linking Request</Link></Dropdown.Item>
            
           
            
            </DropdownButton>
            </div>



        </div>








        return(
            <div>
                {r}
            </div>

        )
    }
}

export default getRequestsForms