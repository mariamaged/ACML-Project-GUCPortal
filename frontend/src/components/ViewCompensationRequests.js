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

class ViewCompensationRequests extends Component{
    state={
        requests:[],
        stateRequests:[],
        stateBool:false
        ,warning:"",
        cancelWarning:"",
        cancelSuccess:"",
        reqState:""
    }
    componentDidMount(){
    console.log("in maternity view")
        axios.get('http://localhost:5000/academic/compensationRequest',
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
        handleStateClick(e,value){
            e.preventDefault();
            if(value=="All"){
               return this.setState({stateBool:false,reqState:""})
                console.log("all= "+this.state.requests)
            }
            if(this.state.requests.length>0){
               const accept=this.state.requests.filter(request=>{
                   return request.state==value
               })
               console.log("accept= "+accept)
                this.setState({stateRequests:accept,stateBool:true,reqState:value})
                // var reqs=this.state.stateRequests
            }

        }
        renderRequest=(request, index)=> {
            return (
                
                <tr key={request.requestID} className="reqTr" className='clickable-row' onClick={(e)=>this.handleClick(e,request.requestID)}>
                
                <td className="reqTd" >{request.counter}</td>
                 <td className="reqTd">{request.submission_date}</td>
                <td className="reqTd">{request.missedDay}</td>
                <td className="reqTd">{request.reason}</td>
                <td className="reqTd">{request.state}</td>
                <td className="reqTd">
                {/* <Button variant="outline-success" className="buttonResponse">Accept</Button> */}
               <a > <XCircleFill color="darkred" className="cancelBtn" size={15} /></a>
                {/* <Button variant="outline-danger" className="buttonResponse3">Cancel</Button> */}
              </td>

                </tr>
                
            )
            }    
       
    render(){
        var reqs=[];
        if(!this.state.stateBool){
            console.log("here")
         reqs=this.state.requests;
        }
        else if(this.state.stateBool){
            console.log("other")
         reqs=this.state.stateRequests;
        }
        var empty=["one"]
            const reqList=reqs.length?(
            empty.map(request=>{
            console.log("in mapping "+request.reqType)
            return(

                <div className="containAll">
                
            
            
            <div className="containDrop">
            <span className="maternityH">Maternity Requests</span>
                      <Dropdown as={ButtonGroup}className="buttons2" >
                <Dropdown.Toggle id="dropdown-custom-2" className="pickBtn">Request Type</Dropdown.Toggle>
                    <Dropdown.Menu className="super-colors">
                    <Dropdown.Item ><Link to="/ViewSickRequests">Sick Leave Requests</Link></Dropdown.Item>
                    <Dropdown.Item active> <Link to="/ViewCompensationRequests">Compensation Requests</Link></Dropdown.Item>
                    <Dropdown.Item ><Link to="/ViewMaternityRequests">Maternity Leave Requests</Link></Dropdown.Item>
                    <Dropdown.Item ><Link to="/ViewSlotLinkingRequests">Slot Linking Requests</Link></Dropdown.Item>
                    <Dropdown.Item ><Link to="/ViewReplacementRequests">Replacement Requests</Link></Dropdown.Item>
                    <Dropdown.Item ><Link to="/ViewChangeRequests">Change Day-Off Requests</Link></Dropdown.Item>
             
             
                    </Dropdown.Menu>
                </Dropdown>{' '} 

                    <Dropdown as={ButtonGroup} className="buttons1">
                    <Dropdown.Toggle id="dropdown-custom-1" className="pickBtn" >State</Dropdown.Toggle>
                    <Dropdown.Menu className="drop1">
                    <Dropdown.Item > <Button variant="outline-light" size="sm" className="acceptButton" onClick={(e)=>this.handleStateClick(e,"All")}>All</Button></Dropdown.Item >
                    <Dropdown.Item > <Button variant="outline-light" size="sm" className="acceptButton" onClick={(e)=>this.handleStateClick(e,"Accepted")}>Accepted</Button></Dropdown.Item >
                    <Dropdown.Item > <Button variant="outline-light" size="sm" className="rejectButton" onClick={(e)=>this.handleStateClick(e,"Rejected")}>Rejected</Button></Dropdown.Item >
                    <Dropdown.Item > <Button variant="outline-light" size="sm" className="pendingButton" onClick={(e)=>this.handleStateClick(e,"Pending")}>Pending</Button></Dropdown.Item >
                    </Dropdown.Menu>
                </Dropdown>
               
              
                </div>      

                

                <div className=" containMaternityTable  ">
                {/* <span id="spanSurrounder"> */}
                <Table striped bordered variant="dark" hover size="sm" className="reqTable " >
                <thead className="reqHead">
                <tr className="reqTr">
                    <th className="reqTh">#</th>
                    <th className="reqTh">Submission Date</th>
                    <th className="reqTh">Missed Day</th>
                    <th className="reqTh">Reason</th>
                    <th className="reqTh">State</th>
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

export default ViewCompensationRequests