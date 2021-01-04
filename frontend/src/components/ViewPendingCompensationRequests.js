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
// import Button from 'react-bootstrap/Button'

class ViewPendingCompensationRequests extends Component{
    state={
        requests:[]
    }
    componentDidMount(){
    console.log("in view")
        axios.get('http://localhost:5000/academic/pendingCompensationRequest',
        {
            headers:{
                'x-auth-token':localStorage.getItem('jwtToken')
            }
        }
        ).then(res=>{
            // console.log(res.data[0].reqType)
            this.setState({requests:res.data})
            console.log("new state= "+this.state.requests)

        }).catch(console.log("error"))
    }

         handleClick(e,value){
            e.preventDefault();
            console.log("in click "+value)
            

        }
        
        renderRequest=(request, index)=> {
            console.log("reqState= "+request.state)
            return (
                
                <tr key={request.requestID} className="reqTr" class='clickable-row' onClick={(e)=>this.handleClick(e,request.requestID)}>
                <td className="reqTd" >{request.counter}</td>
                <td className="reqTd" >{request.requestID}</td>
                <td className="reqTd" >{request.reqType}</td>
                <td className="reqTd">{request.sentBy}</td>
                <td className="reqTd">{request.sentTo}</td>
                <td className="reqTd">{request.state}</td>
                <td className="reqTdSick">{request.missedDay}</td>
                <td className="reqTd">{request.reason}</td>
                <td className="reqTd">{request.submission_date}</td>
                <td className="reqTdRes">
                {/* <Button variant="outline-success" className="buttonResponse">Accept</Button> */}
               
                <Button variant="outline-danger" className="buttonResponse3">Cancel</Button>
              </td>

                </tr>
                
            )
            }    
       skip(){

       }
    render(){
        const reqs=this.state.requests;
        var empty=["one"]
            const reqList=reqs.length?(
            empty.map(request=>{
            console.log("in mapping "+request.reqType)
            return(
                <div className="containAll">

                 <div className="containDrop">
                
                    <Dropdown as={ButtonGroup} className="buttons1">
                    <Dropdown.Toggle id="dropdown-custom-1"  >State</Dropdown.Toggle>
                    <Dropdown.Menu className="drop1">
                    <Dropdown.Item ><Link to="/ViewAcceptedCompensationRequests">Accepted</Link></Dropdown.Item>
                    <Dropdown.Item><Link to="/ViewRejectedCompensationRequests">Rejected</Link></Dropdown.Item>
                    <Dropdown.Item active><Link to="/ViewPendingCompensationRequests">Pending</Link></Dropdown.Item>
                
                    
                    <Dropdown.Divider />
                    </Dropdown.Menu>
                </Dropdown>{' '}
                <Dropdown as={ButtonGroup}className="buttons2" >
                <Dropdown.Toggle id="dropdown-custom-2" >R/S</Dropdown.Toggle>
                    <Dropdown.Menu className="drop2"></Dropdown.Menu>
                    <Dropdown.Menu className="super-colors">
                    <Dropdown.Item eventKey="1">Sent</Dropdown.Item>
                    <Dropdown.Item eventKey="2">Received</Dropdown.Item>
                
                    <Dropdown.Divider />
                    <Dropdown.Item eventKey="4" >Separated link</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
              
                </div> 

                

                <div className="container containSickTable">
                <Table striped bordered hover size="sm" className="reqTable">
                <thead className="reqHead">
                    <tr className="reqTr">
                    <th className="reqTh">#</th>
                    <th className="reqTh">Request ID</th>
                    <th className="reqTh">Request Type</th>
                    <th className="reqTh">Sender</th>
                    <th className="reqTh">Receiver</th>
                    <th className="reqTh">State</th>
                    <th className="reqTh">Missed Day</th>
                    <th className="reqTh">Reason</th>
                    <th className="reqTh">Submission Date</th>
                    <th className="reqTh">Response</th>
                    </tr>
                </thead>
                <tbody className="reqBody">
                {reqs.map(this.renderRequest)}
                </tbody>
                </Table>
                </div>
                </div>
                        
            
              )
            })
        ):
        (
        <div className="center">No requests yet</div>
        )

        
        return (
           
           reqList
        )
    }
}

export default ViewPendingCompensationRequests