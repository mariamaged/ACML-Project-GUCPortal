import React,{Component} from 'react'
import axios from 'axios'
import { Button, Table } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown'

import '../css/bootstrap.min.css'
import '../css/test44.css'
import DropdownButton from 'react-bootstrap/DropdownButton'
// import Dropdown from 'react-bootstrap/Dropdown'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import history from '../history';
import {Link,NavLink} from 'react-router-dom'
import  { Redirect } from 'react-router-dom'
import { CheckCircle, CheckCircleFill,XCircle, XCircleFill } from 'react-bootstrap-icons';
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import Loading from './loading.js'

// import { FormControl } from '@material-ui/core
// import Button from 'react-bootstrap/Button'

class ViewReceivedRequests extends Component{
    
    state={
        unFilteredRequests:[],
        requests:[],
        stateRequests:[],
        stateBool:false
        ,warning:"",
        reqState:"All",
        reqType:"",
        reqTitle:"",
        RejectionReason:"",
        Warning:"",
        acceptedReplacement:[],
        loadingBool:true,
        dropname:""
    }
    componentDidMount(props){
    console.log("in maternity view "+ this.props.location.state.reqType)
    
        axios.get('http://localhost:5000/academic/receivedRequest',
        {
            headers:{
                'x-auth-token':localStorage.getItem('jwtToken')
            }
        }
        ).then(res=>{
             console.log("this.state.reqType= "+this.props.location.state.reqType)
             const temp=this.props.location.state.reqType;
             const tempTitle=this.props.location.state.reqTitle;
             this.setState({reqType:temp,reqTitle:tempTitle,loadingBool:false});
             
            const maternity=res.data.arr.filter(request=>{
                return request.reqType==this.state.reqType;
            })
            console.log("curr req= "+maternity)
            this.setState({unFilteredRequests:res.data.arr,
                warning:res.data.warning,stateBool:false
            ,reqType:this.state.reqType,reqTitle:this.state.reqTitle,
            requests:maternity,loadingBool:false})

            console.log("new state= "+this.state.requests.reqType)
            console.log("new state= "+this.state.warning)
            console.log("new state= "+this.state.requests)
            var reqs=this.state.requests

        }).catch(console.log("error"))
    }
        // handleAcceptClick(e,value){
        //     e.preventDefault();
        //     console.log("in cancel btn clicked")
        //     console.log("token "+localStorage.getItem('jwtToken'))
          
        //     axios.request({
        //         method: 'POST',
        //         url: 'http://localhost:5000/academic/acceptRequest',
        //         headers: {
        //             'x-auth-token':localStorage.getItem('jwtToken')
        //         },
        //         data: {
        //             requestID: value
        //         },
              
        //       }).then(res=>{
        //         console.log("successfull");
        //         const location = {
        //             pathname: '/receivedRequests',
        //             state: { reqType: this.state.reqType,reqTitle: this.state.reqTitle}
        //           }
                  
        //         //   <Link to={location}/>
        //         //   <Redirect to={location}/>
        //          history.push(location)
        //         //   history.replace(location)
        //         window.location.reload();
    
        //     }).catch(error=>{
        //         console.log("cancel error= "+error.response.data)
        //         this.setState({cancelWarning:error.response.data});
        //         })
        // }
        handleStateClick(e,value){
            this.setState({Warning:"",RejectionReason:""})
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
        handleReceivedTypeClick(e,value){
            this.setState({Warning:"",RejectionReason:""})
            console.log("in handle received");
           
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
               var typeTitle="";
               var dropName=""
               if(value=="Sick Leave"){
               typeTitle="Sick Leave Requests"
                dropName="si"
               }

               if(value=="Maternity Leave"){
               typeTitle="Maternity Leave Requests"
               dropName="ma"
               }

               if(value=="Accidental Leave"){
               typeTitle="Accidental Leave Requests"
               dropName="ac"
               }

               if(value=="Annual Leave"){
               typeTitle="Annual Leave Requests"
               dropName="an"
               }

               if(value=="Slot Linking"){
               typeTitle="Slot Linking Requests"
               dropName="sl"
               }    

               if(value=="Change Day off"){
               typeTitle="Change Day Off Requests"
               dropName="ch"
               }

               if(value=="Replacement"){
               typeTitle="Replacement Requests"
               dropName="re"
               }

               if(value=="Compensation Leave"){
               typeTitle="Compensation Requests"
               dropName="co"
               }


                this.setState({reqType:value,reqTitle:typeTitle,stateBool:false,
                    requests:type,reqState:"All",cancelWarning:"",dropName:dropName})
               console.log("this.state.reqType alooooooo"+this.state.reqType)
                const location = {
                    pathname: '/receivedRequests',
                    state: { reqType: value,reqTitle: typeTitle}
                  }
                history.push(location)
                console.log("this.state.reqType= "+this.state.reqType)
                // var reqs=this.state.stateRequests
            }


        }
        handleRejectionReason=(e)=>{
            console.log("rejection reason")
            console.log(e.target.value)
            this.setState({RejectionReason:e.target.value})
        }
        onRejectRequest(e,value){
            this.setState({Warning:""})
            e.preventDefault()
            console.log("reqID= "+value)
            axios.request({
                method: 'POST',
                url: 'http://localhost:5000/academic/rejectRequest',
                headers: {
                    'x-auth-token':localStorage.getItem('jwtToken')
                },
                data: {
                    requestID: value,
                    rejectionReason:this.state.RejectionReason
                },
              
              }).then(res=>{
                console.log("successfull rejection");
                this.setState({RejectionReason:""})
                const location = {
                    pathname: '/receivedRequests',
                    state: { reqType: this.state.reqType,reqTitle: this.state.reqTitle}
                  }
                  
                 history.push(location)
                window.location.reload();
    
            }).catch(error=>{
                console.log("reject error= "+error.response.data)
                this.setState({Warning:error.response.data});
                })
        }
        onAcceptRequest(e,value){
            this.setState({Warning:"",RejectionReason:""})
            e.preventDefault()
            console.log("reqID= "+value)
            axios.request({
                method: 'PUT',
                url: 'http://localhost:5000/academic/acceptRequest',
                headers: {
                    'x-auth-token':localStorage.getItem('jwtToken')
                },
                data: {
                    requestID: value
                },
              
              }).then(res=>{
                console.log("successfully accepted");

                const location = {
                    pathname: '/receivedRequests',
                    state: { reqType: this.state.reqType,reqTitle: this.state.reqTitle}
                  }
                  
                 history.push(location)
                window.location.reload();
    
            }).catch(error=>{
                console.log("reject error= "+error.response.data)
                this.setState({Warning:error.response.data});
                })
        }
        renderMaternityRequest=(request, index)=> {
            console.log("s= "+request.startDate+
            "\n"+"e= "+request.endDate)
            return (
                
                <tr key={request.requestID} >
                {/* <td   >{request.counter}</td> */}
                <td>{request.submission_date}</td>
                <td>{request.startDate}</td>
                <td>{request.endDate}</td>
                <td>{request.maternityDoc}</td>
                <td>{request.reason}</td>
                <td>{request.state}</td>
                
              {request.state=="Pending" &&  
              <td>
              <InputGroup className="mb-3">
                    <Form onSubmit={(e)=>this.onRejectRequest(e,request.requestID)}>
                    {/* <label className="col-form-label" htmlFor="RejectionReason">Day Off Date</label> */}
        <input type="text"  className="form-control rej" placeholder="" id="RejectionReason" onChange={this.handleRejectionReason}/>
                    </Form>
                </InputGroup>
                </td> }

                {request.state!="Pending" && <td>{request.RejectionReason}</td>}


                <td  >
               <Button  size="sm" className="cancelButton" onClick={(e)=>this.onAcceptRequest(e,request.requestID)}>
               <CheckCircleFill color="darkred" className="cancelBtn" size={19} />
               </Button>{"  "}
              
              <Button  size="sm" className="cancelButton" onClick={(e)=>this.onRejectRequest(e,request.requestID)}>
              <XCircleFill color="darkred" className="cancelBtn" size={19} />
              </Button>

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
                    
                    <tr key={request.requestID}  className='clickable-row' onClick={(e)=>this.onAcceptRequest(e,request.requestID)}>
                    {/* <td   >{request.counter}</td> */}
                    <td  >{request.submission_date}</td>
                    <td  >{request.sickDay}</td>
                    <td  >{request.medicalDoc}</td>
                    <td  >{request.reason}</td>

                    <td  >{request.state}</td>
                    {request.state=="Pending" &&  
              <td>
              <InputGroup className="mb-3">
                    <Form onSubmit={(e)=>this.onRejectRequest(e,request.requestID)}>
                    {/* <label className="col-form-label" htmlFor="RejectionReason">Day Off Date</label> */}
        <input type="text" className="form-control rej" placeholder="" id="RejectionReason" onChange={this.handleRejectionReason}/>
                    </Form>
                </InputGroup>
                </td> }

                {request.state!="Pending" && <td>{request.RejectionReason}</td>}

                    <td  >
                    
                    <Button  size="sm" className="cancelButton" onClick={(e)=>this.onAcceptRequest(e,request.requestID)}>
               <CheckCircleFill color="darkred" className="cancelBtn" size={19} />
               </Button>{"  "}
              
              <Button  size="sm" className="cancelButton" onClick={(e)=>this.onRejectRequest(e,request.requestID)}>
              <XCircleFill color="darkred" className="cancelBtn" size={19} />
              </Button> </td>
    
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
                
                <tr key={request.requestID}  className='clickable-row' >
                
                {/* <td   >{request.counter}</td> */}
                <td  >{request.submission_date}</td>
                <td  >{request.slotDate}</td>
                <td  >{request.slotNum}</td>
                <td  >{request.slotLoc}</td>
                <td  >{request.reason}</td>
                <td  >{request.state}</td>
                {request.state=="Pending" &&  
              <td>
              <InputGroup className="mb-3">
                    <Form onSubmit={(e)=>this.onRejectRequest(e,request.requestID)}>
                    {/* <label className="col-form-label" htmlFor="RejectionReason">Day Off Date</label> */}
        <input type="text" className="form-control rej" placeholder="" id="RejectionReason" onChange={this.handleRejectionReason}/>
                    </Form>
                </InputGroup>
                </td> }

                {request.state!="Pending" && <td>{request.RejectionReason}</td>}
                <td  >
                <Button  size="sm" className="cancelButton" onClick={(e)=>this.onAcceptRequest(e,request.requestID)}>
               <CheckCircleFill color="darkred" className="cancelBtn" size={19} />
               </Button>{"  "}
              
              <Button  size="sm" className="cancelButton" onClick={(e)=>this.onRejectRequest(e,request.requestID)}>
              <XCircleFill color="darkred" className="cancelBtn" size={19} />
              </Button></td>

                </tr>
                
            )
            } 
            renderCompensationRequest=(request, index)=> {
                console.log("compesantopn= "+request.submission_date+
                    "\n"+"missedDAY= "+request.missedDay+
                    "\n"+"reason= "+request.reason+
                    "\n"+"state= "+request.state)
                return (
                    
                    <tr key={request.requestID}  className='clickable-row' >
                    
                    {/* <td   >{request.counter}</td> */}
                     <td  >{request.submission_date}</td>
                    <td  >{request.missedDay}</td>
                    <td  >{request.compensatedDay}</td>
                    <td  >{request.reason}</td>
                    <td  >{request.state}</td>
                    {request.state=="Pending" &&  
              <td>
              <InputGroup className="mb-3">
                    <Form onSubmit={(e)=>this.onRejectRequest(e,request.requestID)}>
                    {/* <label className="col-form-label" htmlFor="RejectionReason">Day Off Date</label> */}
        <input type="text" className="form-control rej" placeholder="" id="RejectionReason" onChange={this.handleRejectionReason}/>
                    </Form>
                </InputGroup>
                </td> }

                {request.state!="Pending" && <td>{request.RejectionReason}</td>}
                    <td  >
                    <Button  size="sm" className="cancelButton" onClick={(e)=>this.onAcceptRequest(e,request.requestID)}>
               <CheckCircleFill color="darkred" className="cancelBtn" size={19} />
               </Button>{"  "}
              
              <Button  size="sm" className="cancelButton" onClick={(e)=>this.onRejectRequest(e,request.requestID)}>
              <XCircleFill color="darkred" className="cancelBtn" size={19} />
              </Button></td>
    
                    </tr>
                    
                )
                } 
                
        renderChangeDayOffRequest=(request, index)=> {
            console.log("CHANGEDAY= "+request.submission_date+
                "\n"+"missedDAY= "+request.missedDay+
                "\n"+"reason= "+request.reason+
                "\n"+"state= "+request.state)
            return (
                
                <tr key={request.requestID}  className='clickable-row' >
                
                {/* <td   >{request.counter}</td> */}
                <td  >{request.submission_date}</td>
                <td >{request.newDayOff}</td>
                <td  >{request.reason}</td>
                <td  >{request.state}</td>
                {request.state=="Pending" &&  
              <td>
              <InputGroup className="mb-3">
                    <Form onSubmit={(e)=>this.onRejectRequest(e,request.requestID)}>
                    {/* <label className="col-form-label" htmlFor="RejectionReason">Day Off Date</label> */}
        <input type="text" className="form-control rej" placeholder="" id="RejectionReason" onChange={this.handleRejectionReason}/>
                    </Form>
                </InputGroup>
                </td> }

                {request.state!="Pending" && <td>{request.RejectionReason}</td>}
                <td  >
                <Button  size="sm" className="cancelButton" onClick={(e)=>this.onAcceptRequest(e,request.requestID)}>
               <CheckCircleFill color="darkred" className="cancelBtn" size={19} />
               </Button>{"  "}
              
              <Button  size="sm" className="cancelButton" onClick={(e)=>this.onRejectRequest(e,request.requestID)}>
              <XCircleFill color="darkred" className="cancelBtn" size={19} />
              </Button></td>

                </tr>
                
            )
            }
        renderSlotLinkingRequest=(request, index)=> {
            console.log("submissiondate= "+request.submission_date+
                "\n"+"missedDAY= "+request.slotDay+
                "\n"+"reason= "+request.reason+
                "\n"+"state= "+request.state)
            return (
                
                <tr key={request.requestID}  className='clickable-row' >
                {/* <td   >{request.counter}</td> */}
                <td  >{request.submission_date}</td>
                <td  >{request.slotDay}</td>
                <td  >{request.slotNum}</td>
                <td  >{request.courseID}</td>
                <td  >{request.reason}</td>
                <td  >{request.state}</td>
                {request.state=="Pending" &&  
              <td>
              <InputGroup className="mb-3">
                    <Form onSubmit={(e)=>this.onRejectRequest(e,request.requestID)}>
                    {/* <label className="col-form-label" htmlFor="RejectionReason">Day Off Date</label> */}
        <input type="text" className="form-control rej" placeholder="" id="RejectionReason" onChange={this.handleRejectionReason}/>
                    </Form>
                </InputGroup>
                </td> }

                {request.state!="Pending" && <td>{request.RejectionReason}</td>}
                <td  >
                <Button  size="sm" className="cancelButton" onClick={(e)=>this.onAcceptRequest(e,request.requestID)}>
               <CheckCircleFill color="darkred" className="cancelBtn" size={19} />
               </Button>{"  "}
              
              <Button  size="sm" className="cancelButton" onClick={(e)=>this.onRejectRequest(e,request.requestID)}>
              <XCircleFill color="darkred" className="cancelBtn" size={19} />
              </Button></td>
                </tr>
                
            )
            }
            renderAccidentalRequest=(request, index)=> {
                console.log("submissiondate= "+request.submission_date+
                    "\n"+"accident= "+request.accidentDate+
                    "\n"+"reason= "+request.reason+
                    "\n"+"state= "+request.state)
                return (
                    
                    <tr key={request.requestID}  className='clickable-row' >
                    {/* <td   >{request.counter}</td> */}
                    <td  >{request.submission_date}</td>
                    <td  >{request.accidentDate}</td>
                    <td  >{request.reason}</td>
                    <td  >{request.state}</td>
                    {request.state=="Pending" &&  
              <td>
              <InputGroup className="mb-3">
                    <Form onSubmit={(e)=>this.onRejectRequest(e,request.requestID)}>
                    {/* <label className="col-form-label" htmlFor="RejectionReason">Day Off Date</label> */}
        <input type="text" className="form-control rej" placeholder="" id="RejectionReason" onChange={this.handleRejectionReason}/>
                    </Form>
                </InputGroup>
                </td> }

                {request.state!="Pending" && <td>{request.RejectionReason}</td>}
                    <td  >
                    <Button  size="sm" className="cancelButton" onClick={(e)=>this.onAcceptRequest(e,request.requestID)}>
               <CheckCircleFill color="darkred" className="cancelBtn" size={19} />
               </Button>{"  "}
              
              <Button  size="sm" className="cancelButton" onClick={(e)=>this.onRejectRequest(e,request.requestID)}>
              <XCircleFill color="darkred" className="cancelBtn" size={19} />
              </Button> </td>
                    </tr>
                    
                )
                }
                // renderReplacement=(replacementStaff,index)=>{
                //     return(
                //        <div>
                //         <td>{replacementStaff.replacementID}</td>
                //         <td>{replacementStaff.slotNum}</td>
                //         </div>
                //     )
                // }
                renderAnnualRequest=(request, index)=> {
            console.log("submissiondate= "+request.submission_date+
                "\n"+"missedDAY= "+request.missedDay+
                "\n"+"reason= "+request.reason+
                "\n"+"state= "+request.state+
                "\n"+"reqID= "+request.requestID+
                "\n"+"acceptedRepl0= "+request.acceptedReplacement.length)
            return (
                
                <tr key={request.requestID}  className='clickable-row' >
                {/* <td   >{request.counter}</td> */}
                <td  >{request.submission_date}</td>
                <td  >{request.slotDate}</td>

                {/* {request.acceptedReplacement.length>0 &&
                    <td colspan="1">{request.acceptedReplacement[0].realReplacementID}</td>
                }
                {request.acceptedReplacement.length>0 &&
                    <td colspan="1">{request.acceptedReplacement[0].realSlotNum}</td>
                  
                } */}
              
                {request.acceptedReplacement.length==0 &&
                    <tr>
                    <td  className="spanCol"></td>
                    <td className="spanCol"></td>
                    <td className="spanCol"></td>
                    <td  className="spanCol"></td>
                    <td  className="spanCol"></td>
                    <td  className="spanCol"></td>
                    <td  className="spanCol"></td>
                    <td  className="spanCol"></td>
                    <td  className="spanCol"></td>
                    <td  className="spanCol"></td>
                    </tr>
                }

               
                  {request.acceptedReplacement.length==1 &&
                    <tr>
                    <td colspan="1">{request.acceptedReplacement[0].realReplacementID}</td>
             
                    <td colspan="1">{request.acceptedReplacement[0].realSlotNum}</td>
                    <td className="spanCol"></td>
                    <td  className="spanCol"></td>
                    <td  className="spanCol"></td>
                    <td  className="spanCol"></td>
                    <td  className="spanCol"></td>
                    <td  className="spanCol"></td>
                    <td  className="spanCol"></td>
                    <td  className="spanCol"></td>
                    </tr>
                  
                }
                {request.acceptedReplacement.length==2 &&
                    <tr>
                    <td className="spanCol">{request.acceptedReplacement[0].realReplacementID}</td>
                    <td className="spanCol">{request.acceptedReplacement[0].realSlotNum}</td>
                    <td className="spanCol">{request.acceptedReplacement[1].realReplacementID}</td>
                    <td className="spanCol">{request.acceptedReplacement[1].realSlotNum}</td>
                    <td className="spanCol"></td>
                    <td  className="spanCol"></td>
                    <td  className="spanCol"></td>
                    <td  className="spanCol"></td>
                    <td  className="spanCol"></td>
                    <td  className="spanCol"></td>
                    </tr>
                }
                {request.acceptedReplacement.length==3 &&
                    <tr>
                    <td colspan="1">{request.acceptedReplacement[0].realReplacementID}</td>
                    <td colspan="1">{request.acceptedReplacement[0].realSlotNum}</td>
                    <td colspan="1">{request.acceptedReplacement[1].realReplacementID}</td>
                    <td colspan="1">{request.acceptedReplacement[1].realSlotNum}</td>
                    <td colspan="1">{request.acceptedReplacement[2].realReplacementID}</td>
                    <td colspan="1">{request.acceptedReplacement[2].realSlotNum}</td>
                    <td className="spanCol"></td>
                    <td  className="spanCol"></td>
                    <td  className="spanCol"></td>
                    <td  className="spanCol"></td>
                    </tr>
                }
                {request.acceptedReplacement.length==4 &&
                    <tr>
                    <td colspan="1">{request.acceptedReplacement[0].realReplacementID}</td>
                    <td colspan="1">{request.acceptedReplacement[0].realSlotNum}</td>
                    <td colspan="1">{request.acceptedReplacement[1].realReplacementID}</td>
                    <td colspan="1">{request.acceptedReplacement[1].realSlotNum}</td>
                    <td colspan="1">{request.acceptedReplacement[2].realReplacementID}</td>
                    <td colspan="1">{request.acceptedReplacement[2].realSlotNum}</td>
                    <td colspan="1">{request.acceptedReplacement[3].realReplacementID}</td>
                    <td colspan="1">{request.acceptedReplacement[3].realSlotNum}</td>
                    <td className="spanCol"></td>
                    <td  className="spanCol"></td>
                    </tr>
                }
                {request.acceptedReplacement.length==5 &&
                    <tr>
                    <td colspan="1">{request.acceptedReplacement[0].realReplacementID}</td>
                    <td colspan="1">{request.acceptedReplacement[0].realSlotNum}</td>
                    <td colspan="1">{request.acceptedReplacement[1].realReplacementID}</td>
                    <td colspan="1">{request.acceptedReplacement[1].realSlotNum}</td>
                    <td colspan="1">{request.acceptedReplacement[2].realReplacementID}</td>
                    <td colspan="1">{request.acceptedReplacement[2].realSlotNum}</td>
                    <td colspan="1">{request.acceptedReplacement[3].realReplacementID}</td>
                    <td colspan="1">{request.acceptedReplacement[3].realSlotNum}</td>
                    <td colspan="1">{request.acceptedReplacement[4].realReplacementID}</td>
                    <td colspan="1">{request.acceptedReplacement[4].realSlotNum}</td>
                    </tr>
                }
                    
                
                
                <td  >{request.reason}</td>
                <td  >{request.state}</td>
                {request.state=="Pending" &&  
              <td>
              <InputGroup className="mb-3">
                    <Form onSubmit={(e)=>this.onRejectRequest(e,request.requestID)}>
                    {/* <label className="col-form-label" htmlFor="RejectionReason">Day Off Date</label> */}
        <input type="text" className="form-control rej" placeholder="" id="RejectionReason" onChange={this.handleRejectionReason}/>
                    </Form>
                </InputGroup>
                </td> }

                {request.state!="Pending" && <td>{request.RejectionReason}</td>}
                <td  >
                <Button  size="sm" className="cancelButton" onClick={(e)=>this.onAcceptRequest(e,request.requestID)}>
               <CheckCircleFill color="darkred" className="cancelBtn" size={19} />
               </Button>{"  "}
              
              <Button  size="sm" className="cancelButton" onClick={(e)=>this.onRejectRequest(e,request.requestID)}>
              <XCircleFill color="darkred" className="cancelBtn" size={19} />
              </Button> </td>
                </tr>
                
            )
            }              
                        
            // renderSlotLinkingRequest=(request, index)=> {
            //     console.log("submissiondate= "+request.submission_date+
            //         "\n"+"missedDAY= "+request.missedDay+
            //         "\n"+"reason= "+request.reason+
            //         "\n"+"state= "+request.state)
            //     return (
                    
            //         <tr key={request.requestID} >
            //         {/* <td className="reqTd" >{request.counter}</td> */}
            //         <td >{request.submission_date}</td>
            //         <td >{request.slotDay}</td>
            //         <td >{request.slotNum}</td>
            //         <td >{request.courseID}</td>
            //         <td >{request.reason}</td>
            //         <td >{request.state}</td>
            //         <td  >
            //         <InputGroup className="mb-3">
            //         <Form onSubmit={(e)=>this.onRejectRequest(e,request.requestID)}>
            //         <input type="text" className="form-control" placeholder="" id="RejectionReason" onChange={this.handleRejectionReason}/>
            //         </Form>
            //         </InputGroup>
            //         </td>
                    
            //         <td  >
            //     <Button  size="sm" className="cancelButton" onClick={(e)=>this.onAcceptRequest(e,request.requestID)}>
            //    <CheckCircleFill color="darkred" className="cancelBtn" size={19} />
            //    </Button>{"  "}
              
            //   <Button  size="sm" className="cancelButton" onClick={(e)=>this.onRejectRequest(e,request.requestID)}>
            //   <XCircleFill color="darkred" className="cancelBtn" size={19} />
            //   </Button> </td>
            //     </tr>
                    
            //     )
            //     }
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
            {this.state.reqType!="Annual Leave" &&  <a className="maternityH">{this.state.reqTitle}</a>}
            {this.state.reqType=="Maternity Leave" &&
            <Dropdown as={ButtonGroup} className="buttons2">
                    <Dropdown.Toggle id="dropdown-custom-2" className="pickBtn" >State</Dropdown.Toggle>
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
            }

            {this.state.reqType=="Sick Leave" &&
            <Dropdown as={ButtonGroup} className="buttonsSick2">
                    <Dropdown.Toggle id="dropdown-custom-2" className="pickBtn" >State</Dropdown.Toggle>
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
            }
            {this.state.reqType=="Compensation Leave" &&
            <Dropdown as={ButtonGroup} className="buttonsComp2">
                    <Dropdown.Toggle id="dropdown-custom-2" className="pickBtn" >State</Dropdown.Toggle>
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
            }
            {this.state.reqType=="Accidental Leave" &&
            <Dropdown as={ButtonGroup} className="buttonsAccidental2">
                    <Dropdown.Toggle id="dropdown-custom-2" className="pickBtn" >State</Dropdown.Toggle>
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
            }
            {this.state.reqType=="Change Day off" &&
            <Dropdown as={ButtonGroup} className="buttonsChange2">
                    <Dropdown.Toggle id="dropdown-custom-2" className="pickBtn" >State</Dropdown.Toggle>
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
            }
            {this.state.reqType=="Annual Leave" &&
            <div >
            <span className="maternityH2">{this.state.reqTitle}</span>
            <Dropdown as={ButtonGroup} className="buttonsAnnual2">
                    <Dropdown.Toggle id="dropdown-custom-2" className="pickBtnAnnual" >State</Dropdown.Toggle>
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
                
            }


                    {' '}  <Dropdown as={ButtonGroup} className="buttons1" >
                <Dropdown.Toggle id="dropdown-custom-1" className="pickBtn">Request Type</Dropdown.Toggle>
                    <Dropdown.Menu className="super-colors">
                    
                    {this.state.reqType!="Accidental Leave" && <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReceivedTypeClick(e,"Accidental Leave")}>Accidental Leave</Button></Dropdown.Item >}
                    {this.state.reqType=="Accidental Leave" &&<Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReceivedTypeClick(e,"Accidental Leave")}>Accidental Leave</Button></Dropdown.Item >}
                    {this.state.reqType!="Annual Leave" &&  <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReceivedTypeClick(e,"Annual Leave")}>Annual Leave</Button></Dropdown.Item >}
                    {this.state.reqType=="Annual Leave" &&  <Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReceivedTypeClick(e,"Annual Leave")}>Annual Leave</Button></Dropdown.Item >}


                    {this.state.reqType!="Change Day off" &&<Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReceivedTypeClick(e,"Change Day off")}>Change Day Off</Button></Dropdown.Item >}
                    {this.state.reqType=="Change Day off" &&<Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReceivedTypeClick(e,"Change Day off")}>Change Day Off</Button></Dropdown.Item >}
                    {this.state.reqType!="Compensation Leave"  &&<Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReceivedTypeClick(e,"Compensation Leave")}>Compensation</Button></Dropdown.Item >}
                    {this.state.reqType=="Compensation Leave"  &&<Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReceivedTypeClick(e,"Compensation Leave")}>Compensation</Button></Dropdown.Item >}


                    {this.state.reqType!="Maternity Leave" &&  <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReceivedTypeClick(e,"Maternity Leave")}>Maternity</Button></Dropdown.Item >}
                    {this.state.reqType=="Maternity Leave" &&  <Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReceivedTypeClick(e,"Maternity Leave")}>Maternity</Button></Dropdown.Item >}
                    {this.state.reqType!="Replacement" && <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReceivedTypeClick(e,"Replacement")}>Replacement</Button></Dropdown.Item >}
                    {this.state.reqType=="Replacement" && <Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReceivedTypeClick(e,"Replacement")}>Replacement</Button></Dropdown.Item >}
                    
                    {this.state.reqType!="Sick Leave" && <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReceivedTypeClick(e,"Sick Leave")}>Sick</Button></Dropdown.Item >}
                    {this.state.reqType=="Sick Leave" && <Dropdown.Item  active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReceivedTypeClick(e,"Sick Leave")}>Sick</Button></Dropdown.Item >}
                   
                    {this.state.reqType!="Slot Linking" &&  <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReceivedTypeClick(e,"Slot Linking")}>Slot Linking</Button></Dropdown.Item >}
                    {this.state.reqType=="Slot Linking" &&  <Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReceivedTypeClick(e,"Slot Linking")}>Slot Linking</Button></Dropdown.Item >}
                    </Dropdown.Menu>
                </Dropdown>{' '} 

                    {/* <Dropdown as={ButtonGroup} className="buttons1">
                    <Dropdown.Toggle id="dropdown-custom-1" className="pickBtn" >State</Dropdown.Toggle>
                    <Dropdown.Menu className="drop1">
                    {/* <Dropdown.Item ><Link to="/ViewAcceptedMaternityRequests">Accepted</Link></Dropdown.Item> */}
             
                  
                    {/* {this.state.reqState!="All" && <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleStateClick(e,"All")}>All</Button></Dropdown.Item >} 
                    {this.state.reqState=="All" && <Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleStateClick(e,"All")}>All</Button></Dropdown.Item >}
                    {this.state.reqState!="Accepted" && <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleStateClick(e,"Accepted")}>Accepted</Button></Dropdown.Item >} 
                    {this.state.reqState=="Accepted" && <Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleStateClick(e,"Accepted")}>Accepted</Button></Dropdown.Item >} 
                    {this.state.reqState!="Rejected" && <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleStateClick(e,"Rejected")}>Rejected</Button></Dropdown.Item >} 
                    {this.state.reqState=="Rejected" && <Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleStateClick(e,"Rejected")}>Rejected</Button></Dropdown.Item >}
                    {this.state.reqState!="Pending" && <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleStateClick(e,"Pending")}>Pending</Button></Dropdown.Item >} 
                    {this.state.reqState=="Pending" && <Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleStateClick(e,"Pending")}>Pending</Button></Dropdown.Item >}
                    
                    
                    </Dropdown.Menu>
                </Dropdown> */} 
               
              
                </div>      

                

             {this.state.reqType=="Maternity Leave" &&  
              <div className=" containMaternityTable">

                {this.state.Warning!="" && <h5 className="cancelWarning">{this.state.Warning}</h5>}
                <table class="table table-hover  header-fixed">
                    <thead>
                        <tr class="table-light">
                        <th scope="row">Submission Date</th>
                        <th scope="row">Start Date</th>
                        <th scope="row">End Date</th>
                        <th scope="row">Documents</th>
                        <th scope="row">Reason</th>
                        <th scope="row">State</th>
                        {this.state.reqState!="Accepted"&&
                         <th scope="row">Rejection Reason</th>}
          
                        <th scope="row">Action</th>
                        </tr>
                    </thead>
                    <tbody>{reqs.map(this.renderMaternityRequest)}</tbody>
                    </table>
                {/* </span> */}
                </div>
                }


                {this.state.reqType=="Sick Leave" &&  
              <div className=" containMaternityTable">

              {this.state.Warning!="" && <h5 className="cancelWarning">{this.state.Warning}</h5>}
              <table class="table table-hover  header-fixed">
                    <thead>
                        <tr class="table-light">
                        <th scope="row">Submission Date</th>
                    <th scope="row">Sick Day</th>
                    <th scope="row">Documents</th>
                    <th scope="row">Reason</th>
                    <th scope="row">State</th>
                        {this.state.reqState!="Accepted"&&
                         <th scope="row">Rejection Reason</th>}
                    
                        <th scope="row">Action</th>
                        </tr>
                    </thead>
                    <tbody>{reqs.map(this.renderSickRequest)}</tbody>
                    </table>
                {/* </span> */}
                </div>
                }
                {this.state.reqType=="Slot Linking" &&<div className=" containMaternityTable  ">
                {this.state.Warning!="" && <h5 className="cancelWarning">{this.state.Warning}</h5>}
                <table class="table table-hover  header-fixed">
                    <thead>
                    <tr >
                    {/* <th scope="row">#</th> */}
                    <th scope="row">Submission Date</th>
                    <th scope="row">Slot Day</th>
                    <th scope="row">Slot Number</th>
                    <th scope="row">Course ID</th>
                    <th scope="row">Reason</th>
                    <th scope="row">State</th>
                    {this.state.reqState!="Accepted"&&
                         <th scope="row">Rejection Reason</th>}
                    <th scope="row">Action</th>
                    </tr>
                </thead>
                <tbody  >
                {reqs.map(this.renderSlotLinkingRequest)}
                </tbody>
                </table>
                {/* </span> */}
                </div>}

                {this.state.reqType=="Replacement" &&
                <div className=" containMaternityTable  ">
                {this.state.Warning!="" && <h5 className="cancelWarning">{this.state.Warning}</h5>}
                <table class="table table-hover  header-fixed">
                    <thead>
                    <tr >
                    {/* <th scope="row">#</th> */}
                    <th scope="row">Submission Date</th>
                    <th scope="row">Slot Date</th>
                    <th scope="row">Slot Number</th>
                    <th scope="row">Slot Location</th>
                    <th scope="row">Reason</th>
                    <th scope="row">State</th>
                    {this.state.reqState!="Accepted"&&
                         <th scope="row">Rejection Reason</th>}
                    <th scope="row">Action</th>
                    </tr>
                </thead>
                <tbody  >
                {reqs.map(this.renderReplacementRequest)}
                </tbody>
                </table>
                {/* </span> */}
                </div> 
                }

                {this.state.reqType=="Compensation Leave" &&
                <div className=" containMaternityTable  ">
                {this.state.Warning!="" && <h5 className="cancelWarning">{this.state.Warning}</h5>}
                <table class="table table-hover  header-fixed">
                    <thead>
                <tr >
                    {/* <th scope="row">#</th> */}
                    <th scope="row">Submission Date</th>
                    <th scope="row">Missed Day</th>
                    <th scope="row">Compensation Day</th>
                    <th scope="row">Reason</th>
                    <th scope="row">State</th>
                    {this.state.reqState!="Accepted"&&
                         <th scope="row">Rejection Reason</th>}
                         <th scope="row">Action</th>
                    </tr>
                </thead>
                <tbody  >
                {reqs.map(this.renderCompensationRequest)}
                </tbody>
                </table>
                {/* </span> */}
                </div> }

                {this.state.reqType=="Change Day off" &&
                <div className=" containMaternityTable ">
                {this.state.Warning!="" && <h5 className="cancelWarning">{this.state.Warning}</h5>}
                <table class="table table-hover  header-fixed">
                    <thead>
                <tr >
                    {/* <th scope="row">#</th> */}
                    <th scope="row">Submission Date</th>
                    <th scope="row">New Day-Off</th>
                    <th scope="row">Reason</th>
                    <th scope="row">State</th>
                    {this.state.reqState!="Accepted"&&
                         <th scope="row">Rejection Reason</th>}
                         <th scope="row">Action</th>
                    </tr>
                </thead>
                <tbody  >
                {reqs.map(this.renderChangeDayOffRequest)}
                </tbody>
                </table>
                </div>}
{/* 
                {this.state.reqType=="Slot Linking" &&<div className=" containMaternityTable  ">
                {this.state.Warning!="" && <h5 className="cancelWarning">{this.state.Warning}</h5>}
                <table class="table table-hover  header-fixed">
                    <thead>
                    <tr >
                    <th scope="row">Submission Date</th>
                    <th scope="row">Slot Day</th>
                    <th scope="row">Slot Number</th>
                    <th scope="row">Course ID</th>
                    <th scope="row">Reason</th>
                    <th scope="row">State</th>
                    {this.state.reqState!="Accepted" && this.state.reqState!="Pending"&& <th scope="row">Rejection Reason</th>}
                    <th scope="row">Action</th>
                    </tr>
                </thead>
                <tbody  >
                {reqs.map(this.renderSlotLinkingRequest)}
                </tbody>
                </table>
                </div>} */}

                {this.state.reqType=="Accidental Leave" && <div className=" containMaternityTable  ">
                {this.state.Warning!="" && <h5 className="cancelWarning">{this.state.Warning}</h5>}
                <table class="table table-hover  header-fixed">
                    <thead>
                    <tr >
                    {/* <th scope="row">#</th> */}
                    <th scope="row">Submission Date</th>
                    <th scope="row">Accident Date</th>
                    <th scope="row">Reason</th>
                    <th scope="row">State</th>
                    {this.state.reqState!="Accepted"&&
                         <th scope="row">Rejection Reason</th>}
                    <th scope="row">Action</th>
                    </tr>
                </thead>
                <tbody  >
                {reqs.map(this.renderAccidentalRequest)}
                </tbody>
                </table>
                {/* </span> */}
                </div>}

                {this.state.reqType=="Annual Leave"&&
                /* ,slotNum:sent[i].slotNum,slotDate:sent[i].slotDate,
                    slotLoc:sent[i].slotLoc, replacementStaff:repl, */
                <div className=" containMaternityTable annualTable">
                {this.state.Warning!="" && <h5 className="cancelWarning">{this.state.Warning}</h5>}
                <table class="table table-hover  header-fixed">
                    <thead>
                    <tr >
                    {/* <th scope="row">#</th> */}
                    <th scope="row">Submission Date</th>
                    <th scope="row">Slot Date</th>
                    {/* <th scope="row">Replacement Staff</th> */}
                    {/*  <th colspan="2">65</th>  */}
                    <tr> 
                     <th colspan="10" className="repStaff">Replacement Staff</th>
                    
                     </tr> 
                     <tr> 
                     <th colspan="1">Replacement</th> <th colspan="1">Slot</th>
                     <th colspan="1">Replacement</th> <th colspan="1">Slot</th>
                     <th colspan="1">Replacement</th> <th colspan="1">Slot</th>
                     <th colspan="1">Replacement</th> <th colspan="1">Slot</th>
                     <th colspan="1">Replacement</th> <th colspan="1">Slot</th>
                     </tr>

                    <th scope="row">Reason</th>
                    <th scope="row">State</th>
                    {this.state.reqState!="Accepted"&&
                    <th scope="row">Rejection Reason</th>}
                    <th scope="row">Action</th>
                    </tr>
                </thead>
                <tbody  >
                {reqs.map(this.renderAnnualRequest)}
                </tbody>
                </table>
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
       {this.state.loadingBool==false && 
       <div className="containDropDown">
            <span className="noReq"><h3>{this.state.reqTitle}</h3></span>
                
            <Dropdown as={ButtonGroup} className="buttons2Down">
                    <Dropdown.Toggle id="dropdown-custom-2" className="pickBtnDown" >State</Dropdown.Toggle>
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

                      <Dropdown as={ButtonGroup} className="buttons1Down" >
                <Dropdown.Toggle id="dropdown-custom-1" className="pickBtnDown">Request Type</Dropdown.Toggle>
                    <Dropdown.Menu className="super-colors">
                    {this.state.reqType!="Accidental Leave" && <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReceivedTypeClick(e,"Accidental Leave")}>Accidental Leave</Button></Dropdown.Item >}
                    {this.state.reqType=="Accidental Leave" &&<Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReceivedTypeClick(e,"Accidental Leave")}>Accidental Leave</Button></Dropdown.Item >}
                    {this.state.reqType!="Annual Leave" &&  <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReceivedTypeClick(e,"Annual Leave")}>Annual Leave</Button></Dropdown.Item >}
                    {this.state.reqType=="Annual Leave" &&  <Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReceivedTypeClick(e,"Annual Leave")}>Annual Leave</Button></Dropdown.Item >}


                    {this.state.reqType!="Change Day Off" &&<Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReceivedTypeClick(e,"Change Day off")}>Change Day Off</Button></Dropdown.Item >}
                    {this.state.reqType=="Change Day Off" &&<Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReceivedTypeClick(e,"Change Day off")}>Change Day Off</Button></Dropdown.Item >}
                    {this.state.reqType!="Compensation Leave"  &&<Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReceivedTypeClick(e,"Compensation Leave")}>Compensation</Button></Dropdown.Item >}
                    {this.state.reqType=="Compensation Leave"  &&<Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReceivedTypeClick(e,"Compensation Leave")}>Compensation</Button></Dropdown.Item >}


                    {this.state.reqType!="Maternity Leave" &&  <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReceivedTypeClick(e,"Maternity Leave")}>Maternity</Button></Dropdown.Item >}
                    {this.state.reqType=="Maternity Leave" &&  <Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReceivedTypeClick(e,"Maternity Leave")}>Maternity</Button></Dropdown.Item >}
                    {this.state.reqType!="Replacement" && <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReceivedTypeClick(e,"Replacement")}>Replacement</Button></Dropdown.Item >}
                    {this.state.reqType=="Replacement" && <Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReceivedTypeClick(e,"Replacement")}>Replacement</Button></Dropdown.Item >}
                    
                    {this.state.reqType!="Sick Leave" && <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReceivedTypeClick(e,"Sick Leave")}>Sick</Button></Dropdown.Item >}
                    {this.state.reqType=="Sick Leave" && <Dropdown.Item  active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReceivedTypeClick(e,"Sick Leave")}>Sick</Button></Dropdown.Item >}
                   
                    {this.state.reqType!="Slot Linking" &&  <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReceivedTypeClick(e,"Slot Linking")}>Slot Linking</Button></Dropdown.Item >}
                    {this.state.reqType=="Slot Linking" &&  <Dropdown.Item active> <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReceivedTypeClick(e,"Slot Linking")}>Slot Linking</Button></Dropdown.Item >}
                   </Dropdown.Menu>
                </Dropdown> {' '}

                </div>
                }
                {this.state.loadingBool==false &&
                <div className="alert noReqAlert" role="alert" >
               No requests yet!
                </div>  
                }
                {this.state.loadingBool===true &&
                <div  >
               <Loading/>
                </div>  
                }

        </div>
        )

        
        return (
            <div>
           {reqList}
           </div>
        )
    }
}

export default ViewReceivedRequests