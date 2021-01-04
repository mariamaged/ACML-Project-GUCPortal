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
class ViewAcceptedRequests extends Component{
    state={
        sickRequests:[],
        maternityRequests:[],
        accidentalRequests:[],
        compensationRequests:[],
        changeDayRequests:[]
    }
    componentDidMount(){
    console.log("in view")
    //get sick
        axios.get('http://localhost:5000/academic/acceptedSickRequests',
        {
            headers:{
                'x-auth-token':localStorage.getItem('jwtToken'),
                'gender':'female'
            }
        }
        ).then(res=>{
            console.log(res.data[0].reqType)
            this.setState({sickRequests:res.data})
            console.log("new state= "+this.state.requests)

        }).catch(console.log("error"))

        //get accidental
        axios.get('http://localhost:5000/academic/acceptedAccidentalRequests',
        {
            headers:{
                'x-auth-token':localStorage.getItem('jwtToken')
            }
        }
        ).then(res=>{
            // console.log(res.data[0].reqType)
            this.setState({accidentalRequests:res.data})
            console.log("new state= "+this.state.requests)

        }).catch(console.log("error"))


        //get compensation 
         axios.get('http://localhost:5000/academic/acceptedCompensationRequests',
        {
            headers:{
                'x-auth-token':localStorage.getItem('jwtToken')
            }
        }
        ).then(res=>{
            console.log(res.data[0].reqType)
            this.setState({compensationRequests:res.data})
            console.log("new state= "+this.state.requests)

        }).catch(console.log("error"))


    }








         handleClick(e,value){
            e.preventDefault();
            console.log("in click "+value)
           // return 
        //     <Redirect
        //     to={{
        //     pathname: "/ViewAcceptedRequests",
        //     state: { request_id:value }
        //   }}
        // />

        }

        
        renderRequest=(request, index)=> {
            return (
                
                <tr key={request.requestID} className="reqTr" class='clickable-row' onClick={(e)=>this.handleClick(e,request.requestID)}>
                <td className="reqTd" >{request.counter}</td>
                <td className="reqTd" >{request.requestID}</td>
                <td className="reqTd" >{request.reqType}</td>
                <td className="reqTd">{request.sentBy}</td>
                <td className="reqTd">{request.sentTo}</td>
                <td className="reqTd">{request.state}</td>
                <td className="reqTdSick">{request.sickDay}</td>
                <td className="reqTdSick">{request.medicalDoc}</td>
                <td className="reqTd">{request.reason}</td>
                <td className="reqTd">{request.submission_date}</td>
                <td className="reqTdRes">
                {/* <Button variant="outline-success" className="buttonResponse">Accept</Button> */}
                
                
                <Button variant="outline-danger" className="buttonResponse3">Cancel</Button>
              </td>

                </tr>
                
            )
            }  

    renderMaternity=(request, index)=> {
        return (
            
            <tr key={request.requestID} className="reqTr" class='clickable-row' onClick={(e)=>this.handleClick(e,request.requestID)}>
            <td className="reqTd" >{request.counter}</td>
            <td className="reqTd" >{request.requestID}</td>
            <td className="reqTd" >{request.reqType}</td>
            <td className="reqTd">{request.sentBy}</td>
            <td className="reqTd">{request.sentTo}</td>
            <td className="reqTd">{request.state}</td>
            <td className="reqTdSick">{request.maternityDoc}</td>
            <td className="reqTd">{request.reason}</td>
            <td className="reqTd">{request.submission_date}</td>
            <td className="reqTdRes">
            {/* <Button variant="outline-success" className="buttonResponse">Accept</Button> */}
            <CheckCircle color="royalblue" size={20} />{'    '}
            <XCircle color="royalblue" size={20} />
            
            <Button variant="outline-danger" className="buttonResponse3">Cancel</Button>
            </td>

            </tr>
            
        )
        } 
        renderDayOff=(request, index)=> {
            return (
                
                <tr key={request.requestID} className="reqTr" class='clickable-row' onClick={(e)=>this.handleClick(e,request.requestID)}>
                <td className="reqTd" >{request.counter}</td>
                <td className="reqTd" >{request.requestID}</td>
                <td className="reqTd" >{request.reqType}</td>
                <td className="reqTd">{request.sentBy}</td>
                <td className="reqTd">{request.sentTo}</td>
                <td className="reqTd">{request.state}</td>
                <td className="reqTdSick">{request.newDayOff}</td>
                <td className="reqTd">{request.reason}</td>
                <td className="reqTd">{request.submission_date}</td>
                <td className="reqTdRes">
                {/* <Button variant="outline-success" className="buttonResponse">Accept</Button> */}
                <CheckCircle color="royalblue" size={20} />{'    '}
                <XCircle color="royalblue" size={20} />
                
                <Button variant="outline-danger" className="buttonResponse3">Cancel</Button>
                </td>

                </tr>
                
            )
            }  
                    
renderAccidental=(request, index)=> {
return (
    
    <tr key={request.requestID} className="reqTr" class='clickable-row' onClick={(e)=>this.handleClick(e,request.requestID)}>
    <td className="reqTd" >{request.counter}</td>
    <td className="reqTd" >{request.requestID}</td>
    <td className="reqTd" >{request.reqType}</td>
    <td className="reqTd">{request.sentBy}</td>
    <td className="reqTd">{request.sentTo}</td>
    <td className="reqTd">{request.state}</td>
    <td className="reqTdSick">{request.accidentDate}</td>
    <td className="reqTd">{request.reason}</td>
    <td className="reqTd">{request.submission_date}</td>
    <td className="reqTdRes">
    {/* <Button variant="outline-success" className="buttonResponse">Accept</Button> */}
    <CheckCircle color="royalblue" size={20} />{'    '}
    <XCircle color="royalblue" size={20} />
    
    <Button variant="outline-danger" className="buttonResponse3">Cancel</Button>
    </td>

    </tr>
    
)
}  
renderCompensation=(request, index)=> {
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
        <CheckCircle color="royalblue" size={20} />{'    '}
        <XCircle color="royalblue" size={20} />
        
        <Button variant="outline-danger" className="buttonResponse3">Cancel</Button>
        </td>

        </tr>
        
    )
    }
         
       
    render(){
        const sickReqs=this.state.sickRequests;
        // const maternityReqs=this.state.maternityRequests;
        // const annualReqs=this.state.sickRequests;
        const accidentalReqs=this.state.accidentalRequests;
        const compensationReqs=this.state.compensationRequests;
        var sum=sickReqs.length+accidentalReqs.length+compensationReqs.length
        console.log("sum= "+sum)
        var empty=["one"]
            const reqList=sum>0?(
            empty.map(request=>{
            console.log("in mapping "+request.reqType)
            return(
                <div className="containAll">

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
                    <th className="reqTh">Sick Day</th>
                    <th className="reqTh">Medical Documents</th>
                    <th className="reqTh">Reason</th>
                    <th className="reqTh">Submission Date</th>
                    <th className="reqTh">Response</th>
                    </tr>
                </thead>
                <tbody className="reqBody">
                {sickReqs.map(this.renderRequest)}
                </tbody>
                </Table>
                </div>

                {/* <div className="container containTableMaternity">
                <Table striped bordered hover size="sm" className="reqTable">
                <thead className="reqHead">
                    <tr className="reqTr">
                    <th className="reqTh">#</th>
                    <th className="reqTh">Request ID</th>
                    <th className="reqTh">Request type</th>
                    <th className="reqTh">Submission Date</th>
                    <th className="reqTh">Sender</th>
                    <th className="reqTh">Receiver</th>
                    <th className="reqTh">State</th>
                    <th className="reqTh">Condition Documents</th>
                    <th className="reqTh">Reason</th>
                    <th className="reqTh">Submission Date</th>
                    <th className="reqTh">Response</th>

                    </tr>
                </thead>
                <tbody className="reqBody">
                {reqs.map(this.renderMaternity)}
                </tbody>
                </Table>
                </div> */}
{/* 
                <div className="container containTableChangeDayOff">
                <Table striped bordered hover size="sm" className="reqTable">
                <thead className="reqHead">
                    <tr className="reqTr">
                    <th className="reqTh">#</th>
                    <th className="reqTh">Request ID</th>
                    <th className="reqTh">Request type</th>
                    <th className="reqTh">Submission Date</th>
                    <th className="reqTh">Sender</th>
                    <th className="reqTh">Receiver</th>
                    <th className="reqTh">New Day Off</th>
                    <th className="reqTh">Reason</th>
                    <th className="reqTh">Submission Date</th>
                    <th className="reqTh">Response</th>

                    </tr>
                </thead>
                <tbody className="reqBody">
                {reqs.map(this.renderDayOff)}
                </tbody>
                </Table>
                </div> */}

                <div className="container containTableAccidental">
                <Table striped bordered hover size="sm" className="reqTable">
                <thead className="reqHead">
                    <tr className="reqTr">
                    <th className="reqTh">#</th>
                    <th className="reqTh">Request ID</th>
                    <th className="reqTh">Request type</th>
                    <th className="reqTh">Submission Date</th>
                    <th className="reqTh">Sender</th>
                    <th className="reqTh">Receiver</th>
                    <th className="reqTh">Accident Date</th>
                    <th className="reqTh">Reason</th>
                    <th className="reqTh">Submission Date</th>
                    <th className="reqTh">Response</th>

                    </tr>
                </thead>
                <tbody className="reqBody">
                {accidentalReqs.map(this.renderAccidental)}
                </tbody>
                </Table>
                </div>


                <div className="container containTableCompensation">
                <Table striped bordered hover size="sm" className="reqTable">
                <thead className="reqHead">
                    <tr className="reqTr">
                    <th className="reqTh">#</th>
                    <th className="reqTh">Request ID</th>
                    <th className="reqTh">Request type</th>
                    <th className="reqTh">Submission Date</th>
                    <th className="reqTh">Sender</th>
                    <th className="reqTh">Receiver</th>
                    <th className="reqTh">Missed Day</th>
                    <th className="reqTh">Reason</th>
                    <th className="reqTh">Submission Date</th>
                    <th className="reqTh">Response</th>

                    </tr>
                </thead>
                <tbody className="reqBody">
                {compensationReqs.map(this.renderAccidental)}
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

export default ViewAcceptedRequests