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
// import Button from 'react-bootstrap/Button'

class ViewRejectedSickRequests extends Component{
    state={
        requests:[]
        ,warning:""
    }
    componentDidMount(){
    console.log("in maternity view")
        axios.get('http://localhost:5000/academic/rejectedSickRequest',
        {
            headers:{
                'x-auth-token':localStorage.getItem('jwtToken')
            }
        }
        ).then(res=>{
            // console.log(res.data[0].reqType)
            this.setState({requests:res.data.arr,warning:res.data.warning})
            console.log("new state= "+this.state.requests.reqType)
            console.log("new state= "+this.state.warning)
            console.log("new state= "+this.state.requests)

        }).catch(console.log("error"))
    }

         handleClick(e,value){
            e.preventDefault();
            console.log("in click "+value)
            

        }
        handleCancel(e){
            e.preventDefault();
            axios.post('http://localhost:5000/academic/cancelRequest',
            {
                headers:{
                    'x-auth-token':localStorage.getItem('jwtToken')
                }
            }
            ).then(res=>{
                // console.log(res.data[0].reqType)
                // this.setState({requests:res.data.arr,warning:res.data.warning})
                // console.log("new state= "+this.state.requests.reqType)
                // console.log("new state= "+this.state.warning)
                // console.log("new state= "+this.state.requests)
    
            }).catch(
                console.log("error")
                
                )
        }
        
        renderRequest=(request, index)=> {
            return (
                
                <tr key={request.requestID} className="reqTr" className='clickable-row' onClick={(e)=>this.handleClick(e,request.requestID)}>
                
               
                <td className="reqTd">{request.state}</td>
                <td className="reqTd">{request.sickDay}</td>
                <td className="reqTd">{request.reason}</td>
                <td className="reqTd">{request.submission_date}</td>
                <td className="reqTd">
                {/* <Button variant="outline-success" className="buttonResponse">Accept</Button> */}
               <a > <XCircleFill color="darkred" className="cancelBtn" size={15} /></a>
                {/* <Button variant="outline-danger" className="buttonResponse3">Cancel</Button> */}
              </td>

                </tr>
                
            )
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
            <span className="maternityH">Sick Leave Requests</span>
                      <Dropdown as={ButtonGroup}className="buttons2" >
                <Dropdown.Toggle id="dropdown-custom-2" className="pickBtn">Request Type</Dropdown.Toggle>
                    <Dropdown.Menu className="super-colors">
                    <Dropdown.Item active><Link to="/ViewSickRequests">Sick Leave Requests</Link></Dropdown.Item>
                    <Dropdown.Item> <Link to="/ViewCompensationRequests">Compensation Requests</Link></Dropdown.Item>
                    <Dropdown.Item ><Link to="/ViewMaternityRequests">Maternity Leave Requests</Link></Dropdown.Item>
                    <Dropdown.Item ><Link to="/ViewSlotLinkingRequests">Slot Linking Requests</Link></Dropdown.Item>
                    <Dropdown.Item ><Link to="/ViewReplacementRequests">Replacement Requests</Link></Dropdown.Item>
                    <Dropdown.Item ><Link to="/ViewChangeRequests">Change Day-Off Requests</Link></Dropdown.Item>
             
             
                    </Dropdown.Menu>
                </Dropdown>{' '} 

                    <Dropdown as={ButtonGroup} className="buttons1">
                    <Dropdown.Toggle id="dropdown-custom-1" className="pickBtn" >State</Dropdown.Toggle>
                    <Dropdown.Menu className="drop1">
                    <Dropdown.Item ><Link to="/ViewAcceptedSickRequests">Accepted</Link></Dropdown.Item>
                    <Dropdown.Item active><Link to="/ViewRejectedSickRequests">Rejected</Link></Dropdown.Item>
                    <Dropdown.Item ><Link to="/ViewPendingSickRequests">Pending</Link></Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
               
              
                </div>      

                

                <div className=" containMaternityTable  ">
                {/* <span id="spanSurrounder"> */}
                <Table striped bordered variant="dark" hover size="sm" className="reqTable " >
                <thead className="reqHead">
                    <tr className="reqTr">
                    <th className="reqTh">State</th>
                    <th className="reqTh">Documents</th>
                    <th className="reqTh">Reason</th>
                    <th className="reqTh">Submission Date</th>
                    <th className="reqTh">Action</th>
                    </tr>
                </thead>
                <tbody className="reqBody">
                {reqs.map(this.renderRequest)}
                </tbody>
                </Table>
                {/* </span> */}
                </div>

                
                </div>
                        
            
              )
            })
        ):
        (
        <div className="center">No requests yet</div>
        )

        
        return (
            <div>
           {reqList}
           </div>
        )
    }
}

export default ViewRejectedSickRequests