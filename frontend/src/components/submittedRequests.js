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

class ViewSubmittedRequests extends Component{
    
    state={
        unFilteredRequests:[],
        requests:[],
        stateRequests:[],
        stateBool:false
        ,warning:"",
        cancelWarning:"",
        cancelSuccess:"",
        reqState:"",
        reqType:"Maternity",
        reqTitle:"Maternity Requests"
    }
    componentDidMount(){
    console.log("in maternity view "+localStorage.getItem('jwtToken'))
        axios.get('http://localhost:5000/academic/submittedRequest',
        {
            headers:{
                'x-auth-token':localStorage.getItem('jwtToken')
            }
        }
        ).then(res=>{
            // console.log(res.data[0].reqType)
            const maternity=res.data.arr.filter(request=>{
                return request.reqType=="Maternity Leave"
            })
            
            this.setState({unFilteredRequests:res.data.arr,
                warning:res.data.warning,stateBool:false
            ,reqType:"Maternity Leave",reqTitle:"Maternity Requests",requests:maternity})

            console.log("new state= "+this.state.requests.reqType)
            console.log("new state= "+this.state.warning)
            console.log("new state= "+this.state.requests)
            var reqs=this.state.requests

        }).catch(console.log("error"))
    }
        handleClick(e,value){
            e.preventDefault();
            console.log("in cancel btn clicked")
            console.log("token "+localStorage.getItem('jwtToken'))
          
            axios.request({
                method: 'POST',
                url: 'http://localhost:5000/academic/cancelRequest',
                headers: {
                    'x-auth-token':localStorage.getItem('jwtToken')
                },
                data: {
                    requestID: value
                },
              
              }).then(res=>{
                console.log("successfull")
                this.setState({cancelSuccess:res.data});
    
            }).catch(error=>{
                console.log("cancel error= "+error.response.data)
                this.setState({cancelWarning:error.response.data});
                })
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
        handleTypeClick(e,value){
            e.preventDefault();
            // if(value=="Maternity"){
            //    return this.setState({reqType:"Maternity"})
            //     console.log("all= "+this.state.requests)
            // }
            if(this.state.unFilteredRequests.length>0){
               const type=this.state.unFilteredRequests.filter(request=>{
                   return request.reqType==value
               })
               console.log("type= "+type)
                this.setState({reqType:value,reqTitle:value,requests:type,reqState:""})
                // var reqs=this.state.stateRequests
            }


        }
        renderMaternityRequest=(request, index)=> {
            console.log("submissiondate= "+request.submission_date+
            "\n"+"maternityDoc= "+request.maternityDoc+"\n"+"reason= "+
            request.reason+"\n"+"state= "+request.state)
            return (
                
                <tr key={request.requestID} className="reqTr">
                <td className="reqTd" >{request.counter}</td>
                <td className="reqTd">{request.submission_date}</td>
                <td className="reqTd">{request.maternityDoc}</td>
                <td className="reqTd">{request.reason}</td>
                <td className="reqTd">{request.state}</td>

                <td className="reqTd">
               <Button variant="outline-light" size="sm" className="cancelButton" onClick={(e)=>this.handleClick(e,request.requestID)}>
               <XCircleFill color="darkred" className="cancelBtn" size={15} /></Button>
                </td>

                </tr>
                
            )
            }    
            renderSickRequest=(request, index)=> {
                return (
                    
                    <tr key={request.requestID} className="reqTr" className='clickable-row' onClick={(e)=>this.handleClick(e,request.requestID)}>
                    <td className="reqTd" >{request.counter}</td>
                    <td className="reqTd">{request.submission_date}</td>
                    <td className="reqTd">{request.sickDay}</td>
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
                renderReplacementRequest=(request, index)=> {
            return (
                
                <tr key={request.requestID} className="reqTr" className='clickable-row' onClick={(e)=>this.handleClick(e,request.requestID)}>
                
                <td className="reqTd" >{request.counter}</td>
                <td className="reqTd">{request.submission_date}</td>
                <td className="reqTd">{request.slotDate}</td>
                <td className="reqTd">{request.slotNum}</td>
                <td className="reqTd">{request.slotLoc}</td>
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
            renderCompensationRequest=(request, index)=> {
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
            <span className="maternityH">{this.state.reqTitle}</span>
                      <Dropdown as={ButtonGroup}className="buttons2" >
                <Dropdown.Toggle id="dropdown-custom-2" className="pickBtn">Request Type</Dropdown.Toggle>
                    <Dropdown.Menu className="super-colors">
                     <Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleTypeClick(e,"Maternity Leave")}>Materity</Button></Dropdown.Item >
                    {/* <Dropdown.Item ><Link to="/ViewSickRequests">Sick Leave Requests</Link></Dropdown.Item> */}
                    <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleTypeClick(e,"Sick Leave")}>Sick</Button></Dropdown.Item >
                    <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleTypeClick(e,"Replacement")}>Replacement</Button></Dropdown.Item >
                    <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleTypeClick(e,"Compensation Leave")}>Compensation</Button></Dropdown.Item >
                    </Dropdown.Menu>
                </Dropdown>{' '} 

                    <Dropdown as={ButtonGroup} className="buttons1">
                    <Dropdown.Toggle id="dropdown-custom-1" className="pickBtn" >State</Dropdown.Toggle>
                    <Dropdown.Menu className="drop1">
                    {/* <Dropdown.Item ><Link to="/ViewAcceptedMaternityRequests">Accepted</Link></Dropdown.Item> */}
             
                  
                    {this.state.reqState!="" && <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleStateClick(e,"All")}>All</Button></Dropdown.Item >} 
                    {this.state.reqState=="" && <Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleStateClick(e,"All")}>All</Button></Dropdown.Item >}
                    {this.state.reqState!="Accepted" && <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleStateClick(e,"Accepted")}>Accepted</Button></Dropdown.Item >} 
                    {this.state.reqState=="Accepted" && <Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleStateClick(e,"Accepted")}>Accepted</Button></Dropdown.Item >} 
                    {this.state.reqState!="Rejected" && <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleStateClick(e,"Rejected")}>Rejected</Button></Dropdown.Item >} 
                    {this.state.reqState=="Rejected" && <Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleStateClick(e,"Rejected")}>Rejected</Button></Dropdown.Item >}
                    {this.state.reqState!="Pending" && <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleStateClick(e,"Pending")}>Pending</Button></Dropdown.Item >} 
                    {this.state.reqState=="Pending" && <Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleStateClick(e,"Pending")}>Pending</Button></Dropdown.Item >}
                    
                    
                    </Dropdown.Menu>
                </Dropdown>
               
              
                </div>      

                

             {this.state.reqType=="Maternity Leave" &&  
              <div className=" containMaternityTable">

                {this.state.cancelWarning!="" && <h5 class="cancelWarning">{this.state.cancelWarning}</h5>}
                <Table striped bordered variant="dark" hover size="sm" className="reqTable " >
                <thead className="reqHead">
                    <tr className="reqTr">
                    <th className="reqTh">#</th>
                    <th className="reqTh">Submission Date</th>
                    <th className="reqTh">Documents</th>
                    <th className="reqTh">Reason</th>
                    <th className="reqTh">State</th>
                    <th className="reqTh">Action</th>
                    </tr>
                </thead>
                <tbody className="reqBody">
                {reqs.map(this.renderMaternityRequest)}
                </tbody>
                </Table>
                {/* </span> */}
                </div>
                }


                {this.state.reqType=="Sick Leave" &&  
              <div className=" containMaternityTable">

                {this.state.cancelWarning!="" && <h5 class="cancelWarning">{this.state.cancelWarning}</h5>}
                <Table striped bordered variant="dark" hover size="sm" className="reqTable " >
                <thead className="reqHead">
                <tr className="reqTr">
                    <th className="reqTh">#</th>
                    <th className="reqTh">Submission Date</th>
                    <th className="reqTh">Documents</th>
                    <th className="reqTh">Reason</th>
                    <th className="reqTh">State</th>
                    <th className="reqTh">Action</th>
                    </tr>
                </thead>
                <tbody className="reqBody">
                {reqs.map(this.renderSickRequest)}
                </tbody>
                </Table>
                {/* </span> */}
                </div>
                }

                {this.state.reqType=="Replacement" &&
                <div className=" containMaternityTable  ">
                {/* <span id="spanSurrounder"> */}
                <Table striped bordered variant="dark" hover size="sm" className="reqTable " >
                <thead className="reqHead">
                    <tr className="reqTr">
                    <th className="reqTh">#</th>
                    <th className="reqTh">Submission Date</th>
                    <th className="reqTh">Slot Date</th>
                    <th className="reqTh">Slot Number</th>
                    <th className="reqTh">Slot Location</th>
                    <th className="reqTh">Reason</th>
                    <th className="reqTh">State</th>
                    <th className="reqTh">Action</th>
                    </tr>
                </thead>
                <tbody className="reqBody">
                {reqs.map(this.renderReplacementRequest)}
                </tbody>
                </Table>
                {/* </span> */}
                </div> 
                }

                {this.state.reqType=="Compensation Leave" &&
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
                {reqs.map(this.renderCompensationRequest)}
                </tbody>
                </Table>
                {/* </span> */}
                </div> }


                </div>
                        
            
              )
            })
        )
        
        :
        (
        <div className="center">
        <h3>{this.state.reqTitle}</h3>
       <h4> No requests yet</h4>
        </div>
        )

        
        return (
            <div>
           {reqList}
           </div>
        )
    }
}

export default ViewSubmittedRequests