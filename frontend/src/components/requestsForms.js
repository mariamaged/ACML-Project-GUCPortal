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
        warningMsg:"",
        accidentalDate:"",
        accidentalReason:"",
        successMsg:false,
        annualReason:"",
        annualSlotDate:"",
        annualSlotNum:"",
        annualSlotLoc:"",
        annualWarning:"",
        annualSucces:"",
        comepensationReason:"",
         missedDate:"",
         annualReason:"",
         annualDate:"",
         newDayOff:"",
         changeReason:"",
          maternityDoc:"",
          maternityReason:"",
          StartDate:"",
          EndDate:"",
          slotDate:"",
          slotDay:"",
          slotLoc:"",
          slotReason:"",
          sickDate:"",
          medicalDoc:"",
          sickReason:"",
          sucessMsg:"",
          warningMsg:"",
          reason:""
    }
    componentDidMount(props){
        console.log("here in reqForms")
        console.log("success at start? "+this.state.successMsg)
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
    handleChange=(e)=>{
        console.log("e.target.value= "+e.target.value)
        this.setState({
            [e.target.id]:e.target.value
        })
        console.log("ad= "+this.state.accidentalDate)
        console.log("r= "+this.state.accidentalReason)
        console.log("working")
    }
    onFormAccidentalSubmit = e => {
        this.setState({warningMsg:"",successMsg:false})
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
                reason:this.state.reason
            },
          
          }).then(res=>{
            console.log("successfull");
            this.setState({successMsg:true});
        }).catch(error=>{
            console.log("cancel error= "+error.response.data)
            this.setState({warningMsg:error.response.data});
            })
    }
    onFormAnnualSubmit = e => {
        this.setState({warningMsg:"",successMsg:false})
        e.preventDefault();
        console.log("annual req submitted")
        axios.request({
            method: 'POST',
            url: 'http://localhost:5000/academic/annualLeave',
            headers: {
                'x-auth-token':localStorage.getItem('jwtToken')
            },
            // data: {
            //     slotNum:,
            //     slotDate:,
            //     slotLoc:
            // },
          
          }).then(res=>{
            console.log("successfull");
            this.setState({successMsg:true});
        }).catch(error=>{
            console.log("cancel error= "+error.response.data)
            this.setState({warningMsg:error.response.data});
            })
    }

    onFormChangeSubmit = e => {
        this.setState({warningMsg:"",successMsg:false})
        e.preventDefault();
        console.log("change req submitted")
        axios.request({
            method: 'POST',
            url: 'http://localhost:5000/academic/changeDayOff',
            headers: {
                'x-auth-token':localStorage.getItem('jwtToken')
            },
            data: {
                newDayOff:this.state.newDayOff,
                reason:this.state.reason
            },
          
          }).then(res=>{
            console.log("successfull");
            this.setState({successMsg:true});
        }).catch(error=>{
            console.log("cancel error= "+error.response.data)
            this.setState({warningMsg:error.response.data});
            })
    }

    onFormCompensationSubmit = e => {
        this.setState({warningMsg:"",successMsg:false})
        e.preventDefault();
        console.log("comepnsation req submitted")
        axios.request({
            method: 'POST',
            url: 'http://localhost:5000/academic/compensationLeave',
            headers: {
                'x-auth-token':localStorage.getItem('jwtToken')
            },
            data: {
                accidentDate:this.state.accidentalDate,
                reason:this.state.accidentalReason
            },
          
          }).then(res=>{
            console.log("successfull");
            this.setState({successMsg:true});
        }).catch(error=>{
            console.log("cancel error= "+error.response.data)
            this.setState({warningMsg:error.response.data});
            })
    }
    onFormMaternitySubmit = e => {
        this.setState({warningMsg:"",successMsg:false})
        e.preventDefault();
        console.log("maternity req submitted")
        axios.request({
            method: 'POST',
            url: 'http://localhost:5000/academic/compensationLeave',
            headers: {
                'x-auth-token':localStorage.getItem('jwtToken')
            },
            data: {
                accidentDate:this.state.accidentalDate,
                reason:this.state.accidentalReason
            },
          
          }).then(res=>{
            console.log("successfull");
            this.setState({successMsg:true});
        }).catch(error=>{
            console.log("cancel error= "+error.response.data)
            this.setState({warningMsg:error.response.data});
            })
    }


    onFormReplacementSubmit = e => {
        this.setState({warningMsg:"",successMsg:false})
        e.preventDefault();
        console.log("replacement req submitted")
        axios.request({
            method: 'POST',
            url: 'http://localhost:5000/academic/sendReplacementRequest',
            headers: {
                'x-auth-token':localStorage.getItem('jwtToken')
            },
            data: {
                accidentDate:this.state.accidentalDate,
                reason:this.state.accidentalReason
            },
          
          }).then(res=>{
            console.log("successfull");
            this.setState({successMsg:true});
        }).catch(error=>{
            console.log("cancel error= "+error.response.data)
            this.setState({warningMsg:error.response.data});
            })
    }
    
    onFormSickSubmit = e => {
        this.setState({warningMsg:"",successMsg:false})
        e.preventDefault();
        console.log("sick req submitted")
        axios.request({
            method: 'POST',
            url: 'http://localhost:5000/academic/sickLeave',
            headers: {
                'x-auth-token':localStorage.getItem('jwtToken')
            },
            data: {
                accidentDate:this.state.sickDate,
                reason:this.state.accidentalReason
            },
          
          }).then(res=>{
            console.log("successfull");
            this.setState({successMsg:true});
        }).catch(error=>{
            console.log("cancel error= "+error.response.data)
            this.setState({warningMsg:error.response.data});
            })
    }
   
    
  
    onFormSlotLinkingSubmit = e => {
        this.setState({warningMsg:"",successMsg:false})
        e.preventDefault();
        console.log("slot linking req submitted")
        axios.request({
            method: 'POST',
            url: 'http://localhost:5000/academic/slotLinkingRequest',
            headers: {
                'x-auth-token':localStorage.getItem('jwtToken')
            },
            data: {
                accidentDate:this.state.accidentalDate,
                reason:this.state.accidentalReason
            },
          
          }).then(res=>{
            console.log("successfull");
            this.setState({successMsg:true});
        }).catch(error=>{
            console.log("cancel error= "+error.response.data)
            this.setState({warningMsg:error.response.data});
            })
    }



   
    handleReqForm(e,formType,formTitle){
        console.log("check= "+this.state.successMsg)
        e.preventDefault();
        const location = {
            pathname: '/requestsForms',
            state: { formType: formType,formTitle: formTitle}
          }
        history.push(location)
        window.location.reload();
    }
    chooseDay=(e)=>{
        e.preventDefault()
        console.log("in here choose day= "+e.target.value)
        this.setState({newDayOff:e.target.value})
        console.log("new day off= "+e.target.value)
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
             <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReqForm(e,"Change Day off","Change Day Off Request Form")}>Change Day Off Request</Button></Dropdown.Item>
             <Dropdown.Item > <Button variant="primary" size="sm" className="acceptButton" onClick={(e)=>this.handleReqForm(e,"Compensation Leave","Compensation Request Form")}>Compensation Request</Button></Dropdown.Item>
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
        placeholder="YYYY-MM-DD" id="accidentalDate" required onChange={this.handleChange}/>
        <label className="col-form-label" htmlFor="accidentalReason">Reason</label>
        <input type="text" className="form-control" placeholder="Default input" id="reason" onChange={this.handleChange}/>
        <Button variant="primary" type="submit">
         Submit
        </Button> 
        {this.state.successMsg && <h6 className="successMsg">Request successfully submitted!</h6> }
        {this.state.warningMsg!="" && <h6 className="warningMsg">{this.state.warningMsg}</h6>}
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
        <input type="date" className="form-control" placeholder="YYYY-MM-DD" id="annualDate" required onChange={this.handleChange}/>

        {/* <label className="col-form-label" htmlFor="annualReplacement">Replacement Staff</label>
        <input type="text" className="form-control" placeholder="Default input" id="annualReplacement" onChange={this.handleChange}/>
         */}
        <label className="col-form-label" htmlFor="annualReason">Reason</label>
        <input type="text" className="form-control" placeholder="Default input" id="reason" onChange={this.handleChange}/>
        <Button variant="primary" type="submit">
         Submit
        </Button> 
        {this.state.annualSuccess && <h6 className="successMsg">Request successfully submitted!</h6> }
        {this.state.annualWarning!="" && <h6 className="warningMsg">{this.state.annualWarning}</h6>}
         </form>} 


   

    {this.state.formType=="Compensation Leave" &&
    <form onSubmit={this.onFormCompensationSubmit}>
         
         <label className="col-form-label" htmlFor="missedDate">Missed Day Date</label>
         <input type="date" className="form-control" placeholder="YYYY-MM-DD" id="missedDate" required onChange={this.handleChange}/>
         <label className="col-form-label" htmlFor="compensationDate">Compensation Day Date</label>
         <input type="date" className="form-control" placeholder="YYYY-MM-DD" id="comepensationReason" required onChange={this.handleChange}/>
 
         <label className="col-form-label" htmlFor="compensationReason">Reason</label>
         <input type="text" className="form-control" placeholder="Default input" id="reason" onChange={this.handleChange}/>
         <Button variant="primary" type="submit"> 
          Submit
         </Button> 
         {this.state.successMsg && <h6 className="successMsg">Request successfully submitted!</h6> }
         {this.state.warningMsg!="" && <h6 className="warningMsg">{this.state.warningMsg}</h6>}
          </form>
    }

    
    {this.state.formType=="Change Day off" &&
    <form onSubmit={this.onFormChangeSubmit}>
         
         <label className="col-form-label" htmlFor="newDayOff">New Day-Off</label>
            {/* <ul class="list-group">
            <li class="list-group-item">Saturday</li>
            <li class="list-group-item">Sunday</li>
            <li class="list-group-item ">Monday</li>
            <li class="list-group-item">Tuesday</li>
            <li class="list-group-item">Wednesday</li>
            <li class="list-group-item">Thuesday</li>
            </ul> */}
            
            <Form.Control as="select" placeholder="Choose a day" onChange={this.chooseDay}>
            <option value="Saturday" >Saturday</option>
            <option value="Sunday" >Sunday</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday" >Tuesday</option>
            <option value="Wednesday" >Wednesday</option>
            <option value="6" >Thursday</option>
            </Form.Control>
            <br/>

            {/* <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
                Dropdown Button
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item onClick={this.changeDay}>Saturday</Dropdown.Item>
                <Dropdown.Item onClick={this.changeDay}>Sunday</Dropdown.Item>
                <Dropdown.Item onClick={this.changeDay}>Monday</Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown> */}
         {/* <input type="date" className="form-control" placeholder="YYYY-MM-DD" id="newDayOff" required onChange={this.handleChange}/> */}
    
         <label className="col-form-label" htmlFor="changeReason">Reason</label>
         <input type="text" className="form-control" placeholder="Default input" id="reason" onChange={this.handleChange}/>
         <Button variant="primary" type="submit">
          Submit
         </Button> 
         {this.state.successMsg && <h6 className="successMsg">Request successfully submitted!</h6> }
         {this.state.warningMsg!="" && <h6 className="warningMsg">{this.state.warningMsg}</h6>}
          </form>
    
    }    

    {this.state.formType=="Maternity Leave" &&
    
    <form onSubmit={this.onFormMaternitySubmit}>
         
         <label className="col-form-label" htmlFor="startDate">Start Date</label>
         <input type="date" className="form-control" placeholder="YYYY-MM-DD" id="startDate" required onChange={this.handleChange}/>
         <label className="col-form-label" htmlFor="endDate">End Date</label>
         <input type="date" className="form-control" placeholder="YYYY-MM-DD" id="endDate" required onChange={this.handleChange}/>
         <label className="col-form-label" htmlFor="maternityDoc">Maternity Documents</label>
         <input type="text" className="form-control" placeholder="" id="maternityDoc" required onChange={this.handleChange}/>
 
         <label className="col-form-label" htmlFor="maternityReason">Reason</label>
         <input type="text" className="form-control" placeholder="Default input" id="reason" onChange={this.handleChange}/>
         <Button variant="primary" type="submit">
          Submit
         </Button> 
         {this.state.successMsg && <h6 className="successMsg">Request successfully submitted!</h6> }
         {this.state.warningMsg!="" && <h6 className="warningMsg">{this.state.warningMsg}</h6>}
         </form>
    } 

    
    {this.state.formType=="Replacement" &&
    <form onSubmit={this.onFormReplacementSubmit}>
         
         <label className="col-form-label" htmlFor="slotDate">Slot Date</label>
         <input type="date" className="form-control" placeholder="YYYY-MM-DD" id="slotDate" required onChange={this.handleChange}/>
         <label className="col-form-label" htmlFor="slotDay">Slot Day</label>
         <input type="date" className="form-control" placeholder="YYYY-MM-DD" id="slotDay" required onChange={this.handleChange}/>
         <label className="col-form-label" htmlFor="slotLoc">Slot Location</label>
         <input type="text" className="form-control" placeholder="" id="slotLoc" required onChange={this.handleChange}/>
 
         <label className="col-form-label" htmlFor="slotReason">Reason</label>
         <input type="text" className="form-control" placeholder="Default input" id="reason" onChange={this.handleChange}/>
         <Button variant="primary" type="submit">
          Submit
         </Button> 
         {this.state.successMsg && <h6 className="successMsg">Request successfully submitted!</h6> }
         {this.state.warningMsg!="" && <h6 className="warningMsg">{this.state.warningMsg}</h6>}
         </form>
    
    }  

    {this.state.formType=="Sick Leave" &&
    <form onSubmit={this.onFormSickSubmit}>
         
         <label className="col-form-label" htmlFor="sickDate">Sick Day Date</label>
         <input type="date" className="form-control" placeholder="YYYY-MM-DD" id="sickDate" required onChange={this.handleChange}/>
         <label className="col-form-label" htmlFor="medicalDoc">Medical Documents</label>
         <input type="text" className="form-control" placeholder="" id="medicalDoc" required onChange={this.handleChange}/>
 
         <label className="col-form-label" htmlFor="sickReason">Reason</label>
         <input type="text" className="form-control" placeholder="Default input" id="reason" onChange={this.handleChange}/>
         <Button variant="primary" type="submit">
          Submit
         </Button> 
         {this.state.successMsg && <h6 className="successMsg">Request successfully submitted!</h6> }
         {this.state.warningMsg!="" && <h6 className="warningMsg">{this.state.warningMsg}</h6>}
          </form>
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