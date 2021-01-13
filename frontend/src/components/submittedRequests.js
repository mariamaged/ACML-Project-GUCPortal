import React,{Component} from 'react'
import axios from 'axios'
import { Button, Table } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown'
import '../css/test44.css'
import '../css/bootstrap.min.css'
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
        reqState:"All",
        reqType:"",
        reqTitle:""
    }
    componentDidMount(props){
    console.log("in maternity view "+localStorage.getItem('jwtToken'))
    console.log("start state= "+this.state.reqState)
        axios.get('http://localhost:5000/academic/submittedRequest',
        {
            headers:{
                'x-auth-token':localStorage.getItem('jwtToken')
            }
        }
        ).then(res=>{
             console.log("this.state.reqType= "+this.props.location.state.reqType)
             const temp=this.props.location.state.reqType;
             const tempTitle=this.props.location.state.reqTitle;
             this.setState({reqType:temp,reqTitle:tempTitle});
             
            const maternity=res.data.arr.filter(request=>{
                return request.reqType==this.state.reqType;
            })
            console.log("curr req= "+maternity)
            this.setState({unFilteredRequests:res.data.arr,
                warning:res.data.warning,stateBool:false
            ,reqType:this.state.reqType,reqTitle:this.state.reqTitle,requests:maternity})

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
                console.log("successfull");
                const location = {
                    pathname: '/submittedRequests',
                    state: { reqType: this.state.reqType,reqTitle: this.state.reqTitle}
                  }
                  
                //   <Link to={location}/>
                //   <Redirect to={location}/>
                 history.push(location)
                //   history.replace(location)
                window.location.reload();
                // console.log('state= '+this.state.reqType+" title= "+this.state.reqTitle)
                // if(true){
                //     console.log("true")
                // return(<Redirect to={{pathname: "/submittedRequests",state: { reqType: this.state.reqType,reqTitle:this.state.reqTitle }}}/>)
                // }
                // this.setState({cancelSuccess:res.data});
    
            }).catch(error=>{
                console.log("cancel error= "+error.response.data)
                this.setState({cancelWarning:error.response.data});
                })
        }
        handleStateClick(e,value){
            e.preventDefault();
            if(value=="All"){
               return this.setState({stateBool:false,reqState:"All",cancelWarning:""})
                console.log("all= "+this.state.requests)
            }
            if(this.state.requests.length>0){
               const accept=this.state.requests.filter(request=>{
                   return request.state==value
               })
               console.log("accept= "+accept)
                this.setState({stateRequests:accept,stateBool:true,reqState:value,cancelWarning:""})
                // var reqs=this.state.stateRequests
            }

        }
        handleTypeClick(e,value){
            e.preventDefault();
            // if(value=="Maternity"){
            //    return this.setState({reqType:"Maternity"})
            //     console.log("all= "+this.state.requests)
            // }
            console.log("value= "+value)
            if(this.state.unFilteredRequests.length>0){
               const type=this.state.unFilteredRequests.filter(request=>{
                   return request.reqType==value
               })
               console.log("type= "+type)
               var typeTitle="";
               if(value=="Sick Leave")
               typeTitle="Sick Leave Requests"

               if(value=="Maternity Leave")
               typeTitle="Maternity Leave Requests"

               if(value=="Accidental Leave")
               typeTitle="Accidental Leave Requests"

               if(value=="Annual Leave")
               typeTitle="Annual Leave Requests"

               if(value=="Slot Linking")
               typeTitle="Slot Linking Requests"

               if(value=="Change Day off")
               typeTitle="Change Day Off Requests"

               if(value=="Replacement")
               typeTitle="Replacement Requests"

               if(value=="Compensation Leave")
               typeTitle="Compensation Requests"


                this.setState({reqType:value,reqTitle:typeTitle,requests:type,reqState:"All",cancelWarning:""})
               console.log("this.state.reqType alooooooo"+value)
               
                const location = {
                    pathname: '/submittedRequests',
                    state: { reqType: value,reqTitle: typeTitle}
                  }
                history.push(location)
                // var reqs=this.state.stateRequests
            }


        }
        renderMaternityRequest=(request, index)=> {
            console.log("submissiondate= "+request.submission_date+
            "\n"+"maternityDoc= "+request.maternityDoc+
            "\n"+"reason= "+request.reason+
            "\n"+"state= "+request.state)
            return (
                
                <tr key={request.requestID} className="table-dark">
                {/* <td className="reqTd" >{request.counter}</td> */}
                <td >{request.submission_date}</td>
                <td >{request.maternityDoc}</td>
                <td >{request.reason}</td>    
                <td >{request.state}</td>
                {this.state.reqState!="Accepted" && this.state.reqState!="Pending"&& <td >{request.RejectionReason}</td>}
                

                <td>
               <Button  size="sm" className="cancelButton" onClick={(e)=>this.handleClick(e,request.requestID)}>
               <XCircleFill color="darkred" className="cancelBtn" size={15} /></Button>
                </td>

                </tr>
                
            )
            }    
            renderSickRequest=(request, index)=> {
                console.log("submissiondate= "+request.submission_date+
                "\n"+"sickDay= "+request.sickDay+
                "\n"+"reason= "+request.reason+
                "\n"+"state= "+request.state)
                return (
                    
                    <tr key={request.requestID} className="reqTr" className='clickable-row' onClick={(e)=>this.handleClick(e,request.requestID)}>
                    {/* <td className="reqTd" >{request.counter}</td> */}
                    <td className="reqTd">{request.submission_date}</td>
                    <td className="reqTd">{request.sickDay}</td>
                    <td className="reqTd">{request.reason}</td>
                    <td className="reqTd">{request.state}</td>
                    {this.state.reqState!="Accepted" && this.state.reqState!="Pending"&& <td className="reqTd">{request.RejectionReason}</td>}
                    
                    <td className="reqTd">
                    <Button  size="sm" className="cancelButton" onClick={(e)=>this.handleClick(e,request.requestID)}>
               <XCircleFill color="darkred" className="cancelBtn" size={15} /></Button>
                  </td>
    
                    </tr>
                    
                )
                }
                renderReplacementRequest=(request, index)=> {
                    console.log("submissiondate= "+request.submission_date+
                    "\n"+"slotDate= "+request.slotDate+
                    "\n"+"slotNum= "+request.slotNum+
                    "\n"+"slotLoc= "+request.slotLoc+
                    "\n"+"reason= "+request.reason+
                    "\n"+"state= "+request.state)
            return (
                
                <tr key={request.requestID} className="reqTr" className='clickable-row' onClick={(e)=>this.handleClick(e,request.requestID)}>
                
                {/* <td className="reqTd" >{request.counter}</td> */}
                <td className="reqTd">{request.submission_date}</td>
                <td className="reqTd">{request.slotDate}</td>
                <td className="reqTd">{request.slotNum}</td>
                <td className="reqTd">{request.slotLoc}</td>
                <td className="reqTd">{request.reason}</td>
                <td className="reqTd">{request.state}</td>
                {this.state.reqState!="Accepted" && this.state.reqState!="Pending"&& <td className="reqTd">{request.RejectionReason}</td>}
                
                <td className="reqTd">
                <Button  size="sm" className="cancelButton" onClick={(e)=>this.handleClick(e,request.requestID)}>
               <XCircleFill color="darkred" className="cancelBtn" size={15} /></Button>
              </td>

                </tr>
                
            )
            } 
            renderCompensationRequest=(request, index)=> {
                console.log("submissiondate= "+request.submission_date+
                    "\n"+"missedDAY= "+request.missedDay+
                    "\n"+"reason= "+request.reason+
                    "\n"+"state= "+request.state)
                return (
                    
                    <tr key={request.requestID} className="reqTr" className='clickable-row' onClick={(e)=>this.handleClick(e,request.requestID)}>
                    
                    {/* <td className="reqTd" >{request.counter}</td> */}
                     <td className="reqTd">{request.submission_date}</td>
                    <td className="reqTd">{request.missedDay}</td>
                    <td className="reqTd">{request.compensatedDay}</td>
                    <td className="reqTd">{request.reason}</td>
                    <td className="reqTd">{request.state}</td>
                     {this.state.reqState!="Accepted" && this.state.reqState!="Pending"&& <td className="reqTd">{request.RejectionReason}</td>}
                    <td className="reqTd">
                    <Button  size="sm" className="cancelButton" onClick={(e)=>this.handleClick(e,request.requestID)}>
               <XCircleFill color="darkred" className="cancelBtn" size={15} /></Button>
                  </td>
    
                    </tr>
                    
                )
                } 
                
        renderChangeDayOffRequest=(request, index)=> {
            console.log("submissiondate= "+request.submission_date+
                "\n"+"newDayOff= "+request.newDayOff+
                "\n"+"reason= "+request.reason+
                "\n"+"state= "+request.state)
            return (
                
                <tr key={request.requestID} className="reqTr" className='clickable-row' onClick={(e)=>this.handleClick(e,request.requestID)}>
                
                {/* <td className="reqTd" >{request.counter}</td> */}
                <td className="reqTd">{request.submission_date}</td>
                <td className="reqTdSick">{request.newDayOff}</td>
                <td className="reqTd">{request.reason}</td>
                <td className="reqTd">{request.state}</td>
                {this.state.reqState!="Accepted" && this.state.reqState!="Pending"&& <td className="reqTd">{request.RejectionReason}</td>}
                
                <td className="reqTd">
                <Button  size="sm" className="cancelButton" onClick={(e)=>this.handleClick(e,request.requestID)}>
               <XCircleFill color="darkred" className="cancelBtn" size={15} /></Button>
                </td>

                </tr>
                
            )
            }
        renderSlotLinkingRequest=(request, index)=> {
            console.log("submissiondate= "+request.submission_date+
                "\n"+"missedDAY= "+request.missedDay+
                "\n"+"reason= "+request.reason+
                "\n"+"state= "+request.state)
            return (
                
                <tr key={request.requestID} className="reqTr" className='clickable-row' onClick={(e)=>this.handleClick(e,request.requestID)}>
                {/* <td className="reqTd" >{request.counter}</td> */}
                <td className="reqTd">{request.submission_date}</td>
                <td className="reqTd">{request.slotDay}</td>
                <td className="reqTd">{request.slotNum}</td>
                <td className="reqTd">{request.courseID}</td>
                <td className="reqTd">{request.reason}</td>
                <td className="reqTd">{request.state}</td>
                {this.state.reqState!="Accepted" && this.state.reqState!="Pending"&& <td className="reqTd">{request.RejectionReason}</td>}
                
                <td className="reqTd">
                <Button  size="sm" className="cancelButton" onClick={(e)=>this.handleClick(e,request.requestID)}>
               <XCircleFill color="darkred" className="cancelBtn" size={15} /></Button>
                </td>
                </tr>
                
            )
            }
            renderAccidentalRequest=(request, index)=> {
                console.log("submissiondate= "+request.submission_date+
                    "\n"+"accidentalDAY= "+request.accidentDate+
                    "\n"+"reason= "+request.reason+
                    "\n"+"state= "+request.state)
                return (
                    
                    <tr key={request.requestID} className="reqTr" className='clickable-row' onClick={(e)=>this.handleClick(e,request.requestID)}>
                    {/* <td className="reqTd" >{request.counter}</td> */}
                    <td className="reqTd">{request.submission_date}</td>
                    <td className="reqTd">{request.accidentDate}</td>
                    <td className="reqTd">{request.reason}</td>
                    <td className="reqTd">{request.state}</td>
                    {this.state.reqState!="Accepted" && this.state.reqState!="Pending"&& <td className="reqTd">{request.RejectionReason}</td>}
                    
                    <td className="reqTd">
                    <Button  size="sm" className="cancelButton" onClick={(e)=>this.handleClick(e,request.requestID)}>
               <XCircleFill color="darkred" className="cancelBtn" size={15} /></Button>
                    </td>
                    </tr>
                    
                )
                }
                renderAnnualRequest=(request, index)=> {
            console.log("submissiondate= "+request.submission_date+
                "\n"+"missedDAY= "+request.missedDay+
                "\n"+"reason= "+request.reason+
                "\n"+"state= "+request.state)
            return (
                
                <tr key={request.requestID} className="reqTr" className='clickable-row' onClick={(e)=>this.handleClick(e,request.requestID)}>
                {/* <td className="reqTd" >{request.counter}</td> */}
                <td className="reqTd">{request.submission_date}</td>
                <td className="reqTd">{request.slotDate}</td>
               <tr>
               <td >82</td>
                <td>85</td>
                 <td>78</td>
                  <td>82</td>
                   <td>77</td>
                    <td>81</td> </tr> 

                <td className="reqTd">{request.reason}</td>
                <td className="reqTd">{request.state}</td>
                {this.state.reqState!="Accepted" && this.state.reqState!="Pending"&& <td className="reqTd">{request.RejectionReason}</td>}
                
                <td className="reqTd">
                <Button  size="sm" className="cancelButton" onClick={(e)=>this.handleClick(e,request.requestID)}>
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
            <span className="maternityH">{this.state.reqTitle}</span>
                      <Dropdown as={ButtonGroup} className="buttons2" >
                <Dropdown.Toggle id="dropdown-custom-2" className="pickBtn">Request Type</Dropdown.Toggle>
                    <Dropdown.Menu className="super-colors">
                     
                    {this.state.reqType!="Accidental Leave" && <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleTypeClick(e,"Accidental Leave")}>Accidental Leave</Button></Dropdown.Item >}
                    {this.state.reqType=="Accidental Leave" &&<Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleTypeClick(e,"Accidental Leave")}>Accidental Leave</Button></Dropdown.Item >}
                    {this.state.reqType!="Annual Leave" &&  <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleTypeClick(e,"Annual Leave")}>Annual Leave</Button></Dropdown.Item >}
                    {this.state.reqType=="Annual Leave" &&  <Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleTypeClick(e,"Annual Leave")}>Annual Leave</Button></Dropdown.Item >}


                    {this.state.reqType!="Change Day Off" &&<Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleTypeClick(e,"Change Day off")}>Change Day Off</Button></Dropdown.Item >}
                    {this.state.reqType=="Change Day Off" &&<Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleTypeClick(e,"Change Day off")}>Change Day Off</Button></Dropdown.Item >}
                    {this.state.reqType!="Compensation Leave"  &&<Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleTypeClick(e,"Compensation Leave")}>Compensation</Button></Dropdown.Item >}
                    {this.state.reqType=="Compensation Leave"  &&<Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleTypeClick(e,"Compensation Leave")}>Compensation</Button></Dropdown.Item >}


                    {this.state.reqType!="Maternity Leave" &&  <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleTypeClick(e,"Maternity Leave")}>Maternity</Button></Dropdown.Item >}
                    {this.state.reqType=="Maternity Leave" &&  <Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleTypeClick(e,"Maternity Leave")}>Maternity</Button></Dropdown.Item >}
                    {this.state.reqType!="Replacement" && <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleTypeClick(e,"Replacement")}>Replacement</Button></Dropdown.Item >}
                    {this.state.reqType=="Replacement" && <Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleTypeClick(e,"Replacement")}>Replacement</Button></Dropdown.Item >}
                    
                    {this.state.reqType!="Sick Leave" && <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleTypeClick(e,"Sick Leave")}>Sick</Button></Dropdown.Item >}
                    {this.state.reqType=="Sick Leave" && <Dropdown.Item  active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleTypeClick(e,"Sick Leave")}>Sick</Button></Dropdown.Item >}
                   
                    {this.state.reqType!="Slot Linking" &&  <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleTypeClick(e,"Slot Linking")}>Slot Linking</Button></Dropdown.Item >}
                    {this.state.reqType=="Slot Linking" &&  <Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleTypeClick(e,"Slot Linking")}>Slot Linking</Button></Dropdown.Item >}
                    </Dropdown.Menu>
                </Dropdown>{' '} 

                    <Dropdown as={ButtonGroup} className="buttons1">
                    <Dropdown.Toggle id="dropdown-custom-1" className="pickBtn" >State</Dropdown.Toggle>
                    <Dropdown.Menu className="drop1">
                    {/* <Dropdown.Item ><Link to="/ViewAcceptedMaternityRequests">Accepted</Link></Dropdown.Item> */}
             
                  
                    {this.state.reqState!="All" && <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleStateClick(e,"All")}>All</Button></Dropdown.Item >} 
                    {this.state.reqState=="All" && <Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleStateClick(e,"All")}>All</Button></Dropdown.Item >}
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
                
                <table class="table table-hover  header-fixed">
                    <thead>
                        <tr>
                        <th scope="row">Type</th>
                        <th scope="row">Column heading</th>
                        <th scope="row">Column heading</th>
                        <th scope="row">Column heading</th>
                        </tr>
                    </thead>
                    <tbody>{reqs.map(this.renderMaternityRequest)}</tbody>
                    </table>
                
                
                
                { /* <div class="row">
    <table class="table table-fixed">
      <thead>
        <tr>
          <th class="col-xs-5">Submission Date</th>
          <th class="col-xs-5">Start Date</th>
          <th class="col-xs-5">End Date</th>
          <th class="col-xs-5">Documents</th>
          <th class="col-xs-5">State</th>
          {this.state.reqState!="Accepted" && this.state.reqState!="Pending"&& <th className="col-xs-5">Rejection Reason</th>}
                    
          <th class="col-xs-5">Action</th>
          {/* <th class="col-xs-5">Username</th> }
                </tr>
            </thead>
            <tbody>
                          {reqs.map(this.renderMaternityRequest)}
                                    </tbody>
                </table>
            </div>  */}

            </div>
            
                }


                {this.state.reqType=="Sick Leave" &&  
              <div className=" containMaternityTable">

                {this.state.cancelWarning!="" && <h5 class="cancelWarning">{this.state.cancelWarning}</h5>}
                <Table striped bordered variant="dark" hover size="sm" className="reqTable " >
                <thead className="reqHead">
                <tr className="reqTr">
                    {/* <th className="reqTh">#</th> */}
                    <th className="reqTh">Submission Date</th>
                    <th className="reqTh">Sick Day</th>
                    <th className="reqTh">Reason</th>
                    <th className="reqTh">State</th>
                    {this.state.reqState!="Accepted" && this.state.reqState!="Pending"&& <th className="reqTh">Rejection Reason</th>}
                    
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
                {this.state.cancelWarning!="" && <h5 class="cancelWarning">{this.state.cancelWarning}</h5>}
                <Table striped bordered variant="dark" hover size="sm" className="reqTable " >
                <thead className="reqHead">
                    <tr className="reqTr">
                    {/* <th className="reqTh">#</th> */}
                    <th className="reqTh">Submission Date</th>
                    <th className="reqTh">Slot Date</th>
                    <th className="reqTh">Slot Number</th>
                    <th className="reqTh">Slot Location</th>
                    <th className="reqTh">Reason</th>
                    <th className="reqTh">State</th>
                    {this.state.reqState!="Accepted" && this.state.reqState!="Pending"&& <th className="reqTh">Rejection Reason</th>}
                    
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
                {this.state.cancelWarning!="" && <h5 class="cancelWarning">{this.state.cancelWarning}</h5>}
                <Table striped bordered variant="dark" hover size="sm" className="reqTable " >
                <thead className="reqHead">
                <tr className="reqTr">
                    {/* <th className="reqTh">#</th> */}
                    <th className="reqTh">Submission Date</th>
                    <th className="reqTh">Missed Day</th>
                    <th className="reqTh">Compensation Day</th>
                    <th className="reqTh">Reason</th>
                    <th className="reqTh">State</th>
                   {this.state.reqState!="Accepted" && this.state.reqState!="Pending"&& <th className="reqTh">Rejection Reason</th>}
                    <th className="reqTh">Action</th>
                    </tr>
                </thead>
                <tbody className="reqBody">
                {reqs.map(this.renderCompensationRequest)}
                </tbody>
                </Table>
                {/* </span> */}
                </div> }

                {this.state.reqType=="Change Day off" &&
                <div className=" containMaternityTable ">
                {this.state.cancelWarning!="" && <h5 class="cancelWarning">{this.state.cancelWarning}</h5>}
                <Table striped bordered variant="dark" hover size="sm" className="reqTable " >
                <thead className="reqHead">
                <tr className="reqTr">
                    {/* <th className="reqTh">#</th> */}
                    <th className="reqTh">Submission Date</th>
                    <th className="reqTh">New Day-Off</th>
                    <th className="reqTh">Reason</th>
                    <th className="reqTh">State</th>
                    {this.state.reqState!="Accepted" && this.state.reqState!="Pending"&& <th className="reqTh">Rejection Reason</th>}
                    
                    <th className="reqTh">Action</th>
                    </tr>
                </thead>
                <tbody className="reqBody">
                {reqs.map(this.renderChangeDayOffRequest)}
                </tbody>
                </Table>
                </div>}

                {this.state.reqType=="Slot Linking" &&<div className=" containMaternityTable  ">
                {this.state.cancelWarning!="" && <h5 class="cancelWarning">{this.state.cancelWarning}</h5>}
                <Table striped bordered variant="dark" hover size="sm" className="reqTable " >
                <thead className="reqHead">
                    <tr className="reqTr">
                    {/* <th className="reqTh">#</th> */}
                    <th className="reqTh">Submission Date</th>
                    <th className="reqTh">Slot Day</th>
                    <th className="reqTh">Slot Number</th>
                    <th className="reqTh">Course ID</th>
                    <th className="reqTh">Reason</th>
                    <th className="reqTh">State</th>
                    {this.state.reqState!="Accepted" && this.state.reqState!="Pending"&& <th className="reqTh">Rejection Reason</th>}
                    
                    <th className="reqTh">Action</th>
                    </tr>
                </thead>
                <tbody className="reqBody">
                {reqs.map(this.renderSlotLinkingRequest)}
                </tbody>
                </Table>
                {/* </span> */}
                </div>}

                {this.state.reqType=="Accidental Leave" && <div className=" containMaternityTable  ">
                {this.state.cancelWarning!="" && <h5 class="cancelWarning">{this.state.cancelWarning}</h5>}
                <Table striped bordered variant="dark" hover size="sm" className="reqTable " >
                <thead className="reqHead">
                    <tr className="reqTr">
                    {/* <th className="reqTh">#</th> */}
                    <th className="reqTh">Submission Date</th>
                    <th className="reqTh">Accident Date</th>
                    <th className="reqTh">Reason</th>
                    <th className="reqTh">State</th>
                    {this.state.reqState!="Accepted" && this.state.reqState!="Pending"&& <th className="reqTh">Rejection Reason</th>}
                    <th className="reqTh">Action</th>
                    </tr>
                </thead>
                <tbody className="reqBody">
                {reqs.map(this.renderAccidentalRequest)}
                </tbody>
                </Table>
                {/* </span> */}
                </div>}

                {this.state.reqType=="Annual Leave"&&
                /* ,slotNum:sent[i].slotNum,slotDate:sent[i].slotDate,
                    slotLoc:sent[i].slotLoc, replacementStaff:repl, */
                <div className=" containMaternityTable">
                {this.state.cancelWarning!="" && <h5 class="cancelWarning">{this.state.cancelWarning}</h5>}
                <Table striped bordered variant="dark" hover size="sm" className="reqTable " >
                <thead className="reqHead">
                    <tr className="reqTr">
                    {/* <th className="reqTh">#</th> */}
                    <th className="reqTh">Submission Date</th>
                    <th className="reqTh">Slot Date</th>
                    {/* <th className="reqTh">Replacement Staff</th> */}
                    {/*  <th colspan="2">65</th>  */}
                    <tr>  <th colspan="10">Replacement Staff</th>
                     {/* <th colspan="2">20</th>
                     <th colspan="2">20</th>
                     <th colspan="2">20</th>  */}
                     </tr> 
                     <tr> 
                     <th>Replacement</th> <th>Slot</th>
                     <th>Replacement</th> <th>Slot</th>
                     <th>Replacement</th> <th>Slot</th>
                     <th>Replacement</th> <th>Slot</th> 
                     <th>Replacement</th> <th>Slot</th>
                     </tr>

                    <th className="reqTh">Reason</th>
                    <th className="reqTh">State</th>
                    {this.state.reqState!="Accepted" && this.state.reqState!="Pending"&& <th className="reqTh">Rejection Reason</th>}
                    
                    <th className="reqTh">Action</th>
                    </tr>
                </thead>
                <tbody className="reqBody">
                {reqs.map(this.renderAnnualRequest)}
                </tbody>
                </Table>
                {/* </span> */}
                </div>}
                    
                    
                    
                    
                    
                    


                </div>
                        
            
              )
            })
        )
        
        :
        (
        <div className="center">
        {/* <h3>{this.state.reqTitle}</h3> */}
       {/* <h4> No requests yet</h4> */}

       <div className="containDrop c2">
            <span className="noReq"><h3>{this.state.reqTitle}</h3></span>
                      <Dropdown as={ButtonGroup} className="buttons2" >
                <Dropdown.Toggle id="dropdown-custom-2" className="pickBtn">Request Type</Dropdown.Toggle>
                    <Dropdown.Menu className="super-colors">
             
                    {this.state.reqType!="Accidental Leave" && <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleTypeClick(e,"Accidental Leave")}>Accidental Leave</Button></Dropdown.Item >}
                    {this.state.reqType=="Accidental Leave" &&<Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleTypeClick(e,"Accidental Leave")}>Accidental Leave</Button></Dropdown.Item >}
                    {this.state.reqType!="Annual Leave" &&  <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleTypeClick(e,"Annual Leave")}>Annual Leave</Button></Dropdown.Item >}
                    {this.state.reqType=="Annual Leave" &&  <Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleTypeClick(e,"Annual Leave")}>Annual Leave</Button></Dropdown.Item >}


                    {this.state.reqType!="Change Day Off" &&<Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleTypeClick(e,"Change Day off")}>Change Day Off</Button></Dropdown.Item >}
                    {this.state.reqType=="Change Day Off" &&<Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleTypeClick(e,"Change Day off")}>Change Day Off</Button></Dropdown.Item >}
                    {this.state.reqType!="Compensation Leave"  &&<Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleTypeClick(e,"Compensation Leave")}>Compensation</Button></Dropdown.Item >}
                    {this.state.reqType=="Compensation Leave"  &&<Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleTypeClick(e,"Compensation Leave")}>Compensation</Button></Dropdown.Item >}


                    {this.state.reqType!="Maternity Leave" &&  <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleTypeClick(e,"Maternity Leave")}>Maternity</Button></Dropdown.Item >}
                    {this.state.reqType=="Maternity Leave" &&  <Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleTypeClick(e,"Maternity Leave")}>Maternity</Button></Dropdown.Item >}
                    {this.state.reqType!="Replacement" && <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleTypeClick(e,"Replacement")}>Replacement</Button></Dropdown.Item >}
                    {this.state.reqType=="Replacement" && <Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleTypeClick(e,"Replacement")}>Replacement</Button></Dropdown.Item >}
                    
                    {this.state.reqType!="Sick Leave" && <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleTypeClick(e,"Sick Leave")}>Sick</Button></Dropdown.Item >}
                    {this.state.reqType=="Sick Leave" && <Dropdown.Item  active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleTypeClick(e,"Sick Leave")}>Sick</Button></Dropdown.Item >}
                   
                    {this.state.reqType!="Slot Linking" &&  <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleTypeClick(e,"Slot Linking")}>Slot Linking</Button></Dropdown.Item >}
                    {this.state.reqType=="Slot Linking" &&  <Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleTypeClick(e,"Slot Linking")}>Slot Linking</Button></Dropdown.Item >}
                    </Dropdown.Menu>
                </Dropdown>{' '} 

                    <Dropdown as={ButtonGroup} className="buttons1">
                    <Dropdown.Toggle id="dropdown-custom-1" className="pickBtn" >State</Dropdown.Toggle>
                    <Dropdown.Menu className="drop1">
                    {/* <Dropdown.Item ><Link to="/ViewAcceptedMaternityRequests">Accepted</Link></Dropdown.Item> */}
             
                  
                    {this.state.reqState!="All" && <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleStateClick(e,"All")}>All</Button></Dropdown.Item >} 
                    {this.state.reqState=="All" && <Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleStateClick(e,"All")}>All</Button></Dropdown.Item >}
                    {this.state.reqState!="Accepted" && <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleStateClick(e,"Accepted")}>Accepted</Button></Dropdown.Item >} 
                    {this.state.reqState=="Accepted" && <Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleStateClick(e,"Accepted")}>Accepted</Button></Dropdown.Item >} 
                    {this.state.reqState!="Rejected" && <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleStateClick(e,"Rejected")}>Rejected</Button></Dropdown.Item >} 
                    {this.state.reqState=="Rejected" && <Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleStateClick(e,"Rejected")}>Rejected</Button></Dropdown.Item >}
                    {this.state.reqState!="Pending" && <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleStateClick(e,"Pending")}>Pending</Button></Dropdown.Item >} 
                    {this.state.reqState=="Pending" && <Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleStateClick(e,"Pending")}>Pending</Button></Dropdown.Item >}
                    
                    
                    </Dropdown.Menu>
                </Dropdown>
               
              
                </div>    
                <div class="alert alert-primary" role="alert" >
                No requests yet!
                </div>  

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