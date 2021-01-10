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
import Form from 'react-bootstrap/Form'

class requestsForms extends Component{

    state={
        formType:"",
        formTitle:"",
        fields:[],
        accidentalWarning:"",
        accidentalDate:"",
        accidentalReason:"",
        accidentalSuccess:false,
        annualReason:"",
        annualSlotDate:"",
        annualSlotNum:"",
        annualSlotLoc:"",
        annualWarning:"",
        annualSucces:""
    }
    componentDidMount(props){
        console.log("here in reqForms")
        console.log("success at start? "+this.state.accidentalSuccess)
        console.log("this.state.reqType= "+this.props.location.state.formType)
             const temp=this.props.location.state.formType;
             const tempTitle=this.props.location.state.formTitle;
             this.setState({formType:temp,formTitle:tempTitle});
    }

    onFormSubmit = e => {
        e.preventDefault();
        console.log("submitted")
        console.log("name entered")
    }
    handleAccidentalChange=(e)=>{
        console.log("e.target.value= "+e.target.value)
        this.setState({
            [e.target.id]:e.target.value
        })
        console.log("ad= "+this.state.accidentalDate)
        console.log("r= "+this.state.accidentalReason)
        console.log("working")
    }
    onFormAccidentalSubmit = e => {
        this.setState({accidentalWarning:"",accidentalSuccess:false})
        e.preventDefault();
        console.log("accidental submitted")
        axios.request({
            method: 'POST',
            url: 'http://localhost:5000/academic/accidentalLeave',
            headers: {
                'x-auth-token':localStorage.getItem('jwtToken')
            },
            data: {
                accidentDate:this.state.accidentalDate,
                reason:this.state.accidentalReason
            },
          
          }).then(res=>{
            console.log("successfull");
            this.setState({accidentalSuccess:true});
        }).catch(error=>{
            console.log("cancel error= "+error.response.data)
            this.setState({accidentalWarning:error.response.data});
            })
    }

    onFormAnnualSubmit = e => {
        this.setState({accidentalWarning:"",accidentalSuccess:false})
        e.preventDefault();
        console.log("accidental submitted")
        axios.request({
            method: 'POST',
            url: 'http://localhost:5000/academic/annualLeave',
            headers: {
                'x-auth-token':localStorage.getItem('jwtToken')
            },
            data: {
                slotNum:,
                slotDate:,
                slotLoc:
            },
          
          }).then(res=>{
            console.log("successfull");
            this.setState({accidentalSuccess:true});
        }).catch(error=>{
            console.log("cancel error= "+error.response.data)
            this.setState({accidentalWarning:error.response.data});
            })
    }
    handleReqForm(e,formType,formTitle){
        console.log("check= "+this.state.accidentalSuccess)
        e.preventDefault();
        const location = {
            pathname: '/requestsForms',
            state: { formType: formType,formTitle: formTitle}
          }
        history.push(location)
        window.location.reload();
    }
    render(){
        const g=
        <div>
        {/* <div><h3>{this.formTitle}</h3></div> */}
        <div className="reqForm">
            {/* <span className="maternityH">{this.formTitle}</span> */}
            <DropdownButton id="dropdown-basic-button" title="Dropdown button" className="reqFormDrop">
            <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReqForm(e,"Accidental Leave","Accidental Leave Request Form")}>Accidental Leave Request</Button></Dropdown.Item>
             <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReqForm(e,"Annual Leave","Annual Leave Request Form")}>Annual Leave Reques</Button></Dropdown.Item>
             <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReqForm(e,"Compensation Leave","Compensation Request Form")}>Compensation Request</Button></Dropdown.Item>
             <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReqForm(e,"Change Day off","Change Day Off Request Form")}>Change Day Off Request</Button></Dropdown.Item>
             <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReqForm(e,"Maternity Leave","Maternity Leave Request Form")}>Maternity Leave Request</Button></Dropdown.Item>
             <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReqForm(e,"Replacement","Replacement Request Form")}>Replacement Request</Button></Dropdown.Item>
             <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReqForm(e,"Sick Leave","Sick Leave Request Form")}>Sick Leave Request</Button></Dropdown.Item>
             <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReqForm(e,"Slot Linking","Slot Linking Request Form")}>Slot Linking Request</Button></Dropdown.Item>

            
            
            </DropdownButton>
            </div>
        {this.state.formType=="Accidental Leave" &&
       
         <form onSubmit={this.onFormAccidentalSubmit}>
         
        <label className="col-form-label" htmlFor="accidentalDate">Accident Date</label>
        <input type="date" className="form-control" 
        placeholder="YYYY-MM-DD" id="accidentalDate" required onChange={this.handleAccidentalChange}/>
        <label className="col-form-label" htmlFor="accidentalReason">Reason</label>
        <input type="text" className="form-control" placeholder="Default input" id="accidentalReason" onChange={this.handleAccidentalChange}/>
        <Button variant="primary" type="submit">
         Submit
        </Button> 
        {this.state.accidentalSuccess && <h6 className="accidentalSuccess">Request successfully submitted!</h6> }
        {this.state.accidentalWarning!="" && <h6 className="accidentalWarning">{this.state.accidentalWarning}</h6>}
         </form>}

        {/* /* <Form onSubmit={this.onFormAccidentalSubmit}>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Accident Date</Form.Label>
                <Form.Control type="date" placeholder="YYYY-MM-DD"
                 data-date-format="YYYY-MM-DD"  onChange={this.handleAccidentalChange}/>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
                <Form.Label>Reason</Form.Label>
                <Form.Control type="text" placeholder="reason"  onChange={this.handleAccidentalChange}/>
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
            </Form> */}
        
    
     {this.state.formType=="Annual Leave" && 
     <form onSubmit={this.onFormAnnualSubmit}>
         
        <label className="col-form-label" htmlFor="annualDate">Day Off Date</label>
        <input type="date" className="form-control" placeholder="YYYY-MM-DD" id="annualDate" required onChange={this.handleAnnualChange}/>

        {/* <label className="col-form-label" htmlFor="annualReplacement">Replacement Staff</label>
        <input type="text" className="form-control" placeholder="Default input" id="annualReplacement" onChange={this.handleAnnualChange}/>
         */}
        <label className="col-form-label" htmlFor="annualReason">Reason</label>
        <input type="text" className="form-control" placeholder="Default input" id="annualReason" onChange={this.handleAnnualChange}/>
        <Button variant="primary" type="submit">
         Submit
        </Button> 
        {this.state.annualSuccess && <h6 className="accidentalSuccess">Request successfully submitted!</h6> }
        {this.state.annualWarning!="" && <h6 className="accidentalWarning">{this.state.annualWarning}</h6>}
         </form>}

        {/* /* {<Form onSubmit={this.onFormSubmit}>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Day Off Date</Form.Label>
                <Form.Control type="date" placeholder="YYYY-MM-DD" required/>
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Replacement Staff</Form.Label>
                <Form.Control type="text" placeholder="Enter name"/>
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
                <Form.Label>Reason</Form.Label>
                <Form.Control type="text" placeholder="reason"/>
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
            </Form> }*/}


   

    {this.state.formType=="Compensation Leave" &&
        <Form onSubmit={this.onFormSubmit}>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Missed Day</Form.Label>
                <Form.Control type="date" placeholder="YYYY-MM-DD" required/>
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
                <Form.Label>Reason</Form.Label>
                <Form.Control type="text" placeholder="reason"/>
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
            </Form>
        
        
    }

    
    {this.state.formType=="Change Day off" &&
    <Form onSubmit={this.onFormSubmit}>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>New Day Off</Form.Label>
                <Form.Control type="test" placeholder="" required oninvalid="this.setCustomValidity('Please Enter valid email')"
 oninput="setCustomValidity('')"/>
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
                <Form.Label>Reason</Form.Label>
                <Form.Control type="text" placeholder="reason"/>
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
            </Form>
    
    
    }    

    {this.state.formType=="Maternity Leave" &&
    
    <Form onSubmit={this.onFormSubmit}>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Leave Start Date</Form.Label>
                <Form.Control type="date" placeholder="YYYY-MM-DD" required/>
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Leave End Date</Form.Label>
                <Form.Control type="date" placeholder="YYYY-MM-DD" required/>
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Medical Documents</Form.Label>
                <Form.Control type="date" placeholder="YYYY-MM-DD" required/>
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
                <Form.Label>Reason</Form.Label>
                <Form.Control type="text" placeholder="reason"/>
            </Form.Group>
            <Button variant="primary" type="submit">Submit</Button>
            </Form>
    
    } 

    
    {this.state.formType=="Replacement" &&
    <Form onSubmit={this.onFormSubmit}>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Slot Date</Form.Label>
                <Form.Control type="date" placeholder="YYYY-MM-DD" required/>
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Slot Number</Form.Label>
                <Form.Control type="date" placeholder="YYYY-MM-DD" required/>
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Slot Location</Form.Label>
                <Form.Control type="date" placeholder="YYYY-MM-DD" required/>
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Replacement Staff</Form.Label>
                <Form.Control type="date" placeholder="YYYY-MM-DD" required/>
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
                <Form.Label>Reason</Form.Label>
                <Form.Control type="text" placeholder="reason"/>
            </Form.Group>
            <Button variant="primary" type="submit">Submit</Button>
            </Form>
    
    }  

    {this.state.formType=="Sick Leave" &&
    <Form onSubmit={this.onFormSubmit}>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Sick Date</Form.Label>
                <Form.Control type="date" placeholder="YYYY-MM-DD" required/>
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Medical Documents</Form.Label>
                <Form.Control type="date" placeholder="YYYY-MM-DD" required/>
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
                <Form.Label>Reason</Form.Label>
                <Form.Control type="text" placeholder="reason"/>
            </Form.Group>
            <Button variant="primary" type="submit">Submit</Button>
            </Form>
    } 

    {/* {this.state.formType=="Slot Linking" &&
    <div className="form-group">
    <label className="col-form-label" htmlFor="inputDefault">Slot Day</label>
    <input type="text" className="form-control" placeholder="Default input" id="inputDefault" required/>
    <label className="col-form-label" htmlFor="inputDefault">Slot Number</label>
    <input type="text" className="form-control" placeholder="Default input" id="inputDefault" required/>
    <label className="col-form-label" htmlFor="inputDefault">Course ID</label>
    <input type="text" className="form-control" placeholder="Default input" id="inputDefault" required/>
   
   <label className="col-form-label" htmlFor="inputDefault">Reason</label>
    <input type="text" className="form-control" placeholder="Default input" id="inputDefault" />   
    </div>}   */}

    </div>
     



    return (
                <div>
                   {g}
                </div>
    )
}
 }

 export default requestsForms