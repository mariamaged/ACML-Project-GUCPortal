import React,{Component} from 'react'
import axios from 'axios'
import { Button, Table } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown'

import '../css/bootstrap.min.css'
import '../css/notifications.css'
import DropdownButton from 'react-bootstrap/DropdownButton'
// import Dropdown from 'react-bootstrap/Dropdown'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import history from '../history';
import {Link,NavLink} from 'react-router-dom'
import  { Redirect } from 'react-router-dom'
import { CheckCircle, XCircle, XCircleFill, Bell,BellFill } from 'react-bootstrap-icons';
import Form from 'react-bootstrap/Form'
import Toast from 'react-bootstrap/Toast'

class notifications extends Component{
        state={
            unseenNot:1,
            newNotifications:["new"],
            allNotifications:[]

        }


    componentDidMount(){
        const timer = setTimeout(() => {
            console.log('This will run after 3 seconds!')
            axios.request({
                method: 'GET',
                url: 'http://localhost:5000/academic/newNotifications',
                headers: {
                    'x-auth-token':localStorage.getItem('jwtToken')
                }
              
              }).then(res=>{
                console.log("successfull");
                this.setState({successMsg:true});
            }).catch(error=>{
                console.log("cancel error= "+error.response.data)
                this.setState({warningMsg:error.response.data});
                })
          }, 3000);
    }

    render(){

        const g=
        <div>
        <a href="" class="notif"><span class="num">
       <Button className="notifyBtn"> <BellFill color="blue" className="notifyIcon" size={26} /></Button>
       {this.state.newNotifications.length>0 &&
       <div>
       <h7 className="notNum">{this.state.unseenNot}</h7>
       <Toast autoClose={"2000"}>
        <Toast.Header>
            <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
            <strong className="mr-auto">Bootstrap</strong>
            <small>11 mins ago</small>
        </Toast.Header>
        <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
        </Toast>
        </div>
       }
       </span></a>



       {/* {this.state.newNotifications.length>0 &&
       } */}
        </div>

        return(
            <div>
            {g}
            </div>

        )
    }
}

export default notifications