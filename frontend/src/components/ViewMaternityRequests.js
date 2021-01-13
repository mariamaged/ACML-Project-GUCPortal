import React,{Component} from 'react'
import axios from 'axios'
import { Button, Table } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown'
import '../css/test444.css'
// import '../css/bootstrap.min.css'
import DropdownButton from 'react-bootstrap/DropdownButton'
// import Dropdown from 'react-bootstrap/Dropdown'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import history from '../history';
import {Link,NavLink} from 'react-router-dom'
import  { Redirect } from 'react-router-dom'
import { CheckCircle, XCircle, XCircleFill } from 'react-bootstrap-icons';
// import Button from 'react-bootstrap/Button'

class ViewMaternityRequests extends Component{
    
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
    console.log("in maternity view "+ localStorage.getItem('jwtToken'))
        axios.get('http://localhost:5000/academic/maternityRequest',
        {
            headers:{
                'x-auth-token':localStorage.getItem('jwtToken')
            }
        }
        ).then(res=>{
            // console.log(res.data[0].reqType)
            this.setState({requests:res.data.arr,warning:res.data.warning,stateBool:false})
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
        renderRequest=(request, index)=> {
            return (
                
                <tr key={request.requestID} className="">
                <td className="col-xs-5" >{request.counter}</td>
                <td className="col-xs-5">{request.submission_date}</td>
                <td className="col-xs-5">{request.maternityDoc}</td>
                <td className="col-xs-5">{request.reason}</td>
                <td className="col-xs-5">{request.state}</td>

                <td className="col-xs-5">
               <Button variant="outline-light" size="sm" className="cancelButton" onClick={(e)=>this.handleClick(e,request.requestID)}>
               <XCircleFill color="darkred" className="cancelBtn" size={15} /></Button>
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
                    <Dropdown.Item> <Link to="/ViewCompensationRequests">Compensation Requests</Link></Dropdown.Item>
                    <Dropdown.Item active><Link to="/ViewMaternityRequests">Maternity Leave Requests</Link></Dropdown.Item>
                    <Dropdown.Item ><Link to="/ViewSlotLinkingRequests">Slot Linking Requests</Link></Dropdown.Item>
                    <Dropdown.Item ><Link to="/ViewReplacementRequests">Replacement Requests</Link></Dropdown.Item>
                    <Dropdown.Item ><Link to="/ViewChangeRequests">Change Day-Off Requests</Link></Dropdown.Item>
             
             
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
                    {this.state.reqState!="Pending" && <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleStateClick(e,"Pending")}>Rejected</Button></Dropdown.Item >} 
                    {this.state.reqState=="Pending" && <Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleStateClick(e,"Pending")}>Rejected</Button></Dropdown.Item >}
                    
                    
                    </Dropdown.Menu>
                </Dropdown>
               
              
                </div>      

                

                <div class="container">
  <div class="row">
    <table class="table table-fixed">
      <thead>
        <tr>
          <th class="col-xs-5">Id</th>
          <th class="col-xs-5">Name</th>
          <th class="col-xs-5">Username</th>
          <th class="col-xs-5">Username</th>
          <th class="col-xs-5">Username</th>
          <th class="col-xs-5">Username</th>
          <th class="col-xs-5">Username</th>
                </tr>
            </thead>
            <tbody>
                          {reqs.map(this.renderRequest)}
                                    </tbody>
                </table>
            </div>
            </div>
         
            </div>
                        
            
              )
            })
        ):
        (
        <div className="center">
        <h3>Maternity Requests</h3>
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

export default ViewMaternityRequests