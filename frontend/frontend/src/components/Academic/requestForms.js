import React,{Component} from 'react'
import axios from 'axios'
import { Button, Table } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown'
// import '../css/test44.css'
import './monicacss/bootstrap.min.css'
import './monicacss/forms.css'
import DropdownButton from 'react-bootstrap/DropdownButton'
// import Dropdown from 'react-bootstrap/Dropdown'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import history from '../../history';
import {Link,NavLink} from 'react-router-dom'
import  { Redirect } from 'react-router-dom'
import { CheckCircle, XCircle, XCircleFill } from 'react-bootstrap-icons';
import Form from 'react-bootstrap/Form'

class requestsForms extends Component{

    state={
        formType:"Accidental Leave",
        formTitle:"Accidental Leave",
        fields:[],

        accidentalDate:"",
        annualReason:"",
        annualSlotDate:"",
        annualSlotNum:"",
        annualSlotLoc:"",

         missedDay:"",
         compensatedDay:"",

         annualReason:"",
         annualDate:"",

         newDayOff:"",

          maternityDoc:"",
          startDate:"",
          endDate:"",

          slotDate:"",
          slotDay:"",
          slotLoc:"",

        
          slotNum:"",
          courseID:"",

          sickDay:"",
          medicalDoc:"",

          sucessMsg:"",
          warningMsg:"",
          reason:""
    }
    componentDidMount(){
        // console.log("here in reqForms title="+this.props.location.state.formTitle+"   = "+this.props.location.state.formType)
        // console.log("at start reason= "+this.state.reason+" success= "+this.state.successMsg+" failure= "+this.state.warningMsg)
        console.log("success at start? "+this.state.successMsg)
        // console.log("this.state.reqType= "+this.props.location.state.formType)
             const temp=this.state.formType;
             const tempTitle=this.state.formTitle;
             this.setState({formType:temp,formTitle:tempTitle});
    }

    onFormSubmit = e => {
        e.preventDefault();
        console.log("submitted")
        console.log("name entered")
    }
    handleChange=(e)=>{
        console.log("e.target.value= "+e.target.value)
        console.log("compensatedDay= "+this.state.compensatedDay)
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
        console.log("annual req submitted= "+this.state.slotDate)
        axios.request({
            method: 'POST',
            url: 'http://localhost:5000/academic/annualLeave',
            headers: {
                'x-auth-token':localStorage.getItem('jwtToken')
            },
            data: {
               slotDate:this.state.slotDate,
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
        console.log("comepnsation req submitted missedDAY=  "+this.state.missedDay+" compensated= "+this.state.compensatedDay)
        
        axios.request({
            method: 'POST',
            url: 'http://localhost:5000/academic/compensationLeave',
            headers: {
                'x-auth-token':localStorage.getItem('jwtToken')
            },
            data: {
                missedDay:this.state.missedDay,
                compensatedDay:this.state.compensatedDay,
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
    onFormMaternitySubmit = e => {
        this.setState({warningMsg:"",successMsg:false})
        e.preventDefault();
        console.log("maternity req submitted")
        axios.request({
            method: 'POST',
            url: 'http://localhost:5000/academic/maternityLeave',
            headers: {
                'x-auth-token':localStorage.getItem('jwtToken')
            },
            data: {
                startDate:this.state.startDate,
                endDate:this.state.endDate,
                maternityDoc:this.state.maternityDoc,
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
                slotNum:this.state.slotNum,
                slotDate:this.state.slotDate,
                slotLoc:this.state.slotLoc,
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
                sickDay:this.state.sickDay,
                medicalDoc:this.state.medicalDoc,
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
   
    
  
    onFormSlotLinkingSubmit = e => {
        this.setState({warningMsg:"",successMsg:false})
        e.preventDefault();
        console.log("slot linking req submitted= "+this.state.slotDate)
        axios.request({
            method: 'POST',
            url: 'http://localhost:5000/academic/slotLinkingRequest',
            headers: {
                'x-auth-token':localStorage.getItem('jwtToken')
            },
            data: {
                slotDay:this.state.slotDay,
                slotNum:this.state.slotNum,
                courseID:this.state.courseID,
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



   
    handleReqForm(e,formType,formTitle){
        e.preventDefault();
        console.log("check= "+this.state.successMsg)
        console.log("changed= "+e.taget+" = "+formTitle)
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
   
    chooseSlotNum=(e)=>{
        e.preventDefault()
        console.log("in choose slot "+e.target.value)
        this.setState({slotNum:e.target.value})
    }
    chooseSlotLinkingDay=(e)=>{
        e.preventDefault()
        console.log("in choose slot "+e.target.value)
        this.setState({slotDay:e.target.value})
    }
    render(){
        const g=
        <div className="divAll">
        <div><h3 class="formTitle">{this.state.formTitle}</h3></div>
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
         
        <label className="col-form-label labelForm" htmlFor="accidentalDate">Accident Date</label>
        <input type="date" className=" form-control formTest" 
        placeholder="YYYY-MM-DD" id="accidentalDate" required onChange={this.handleChange}/>
        <label className="col-form-label labelForm" htmlFor="accidentalReason">Reason</label>
        <input type="text" className=" form-control formTest" placeholder="Default input" id="reason" onChange={this.handleChange}/>
        <Button variant="primary" type="submit" className="submitForm">
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
         
        <label className="col-form-label labelForm" htmlFor="slotDate">Day Off Date</label>
        <input type="date" className=" form-control formTest" placeholder="YYYY-MM-DD" id="slotDate" required onChange={this.handleChange}/>

        
        
        <label className="col-form-label labelForm" htmlFor="annualReason">Reason</label>
        <input type="text" className=" form-control formTest" placeholder="Default input" id="reason" onChange={this.handleChange}/>
        <Button variant="primary" type="submit">
         Submit
        </Button> 
        {this.state.successMsg && <h6 className="successMsg">Request successfully submitted!</h6> }
        {this.state.warningMsg!="" && <h6 className="warningMsg">{this.state.warningMsg}</h6>}
         </form>} 


   

    {this.state.formType=="Compensation Leave" &&
    <form onSubmit={this.onFormCompensationSubmit}>
         
         <label className="col-form-label labelForm" htmlFor="missedDay">Missed Day Date</label>
         <input type="date" className=" form-control formTest" placeholder="YYYY-MM-DD" id="missedDay" required onChange={this.handleChange}/>
         <label className="col-form-label labelForm" htmlFor="compensatedDay">Compensation Day Date</label>
         <input type="date" className=" form-control formTest" placeholder="YYYY-MM-DD" id="compensatedDay" required onChange={this.handleChange}/>
 
         <label className="col-form-label labelForm" htmlFor="reason">Reason</label>
         <input type="text" className=" form-control formTest" placeholder="Default input" id="reason" required onChange={this.handleChange}/>
         <Button variant="primary" type="submit"> 
          Submit
         </Button> 
         {this.state.successMsg && <h6 className="successMsg">Request successfully submitted!</h6> }
         {this.state.warningMsg!="" && <h6 className="warningMsg">{this.state.warningMsg}</h6>}
          </form>
    }

    
    {this.state.formType=="Change Day off" &&
    <form onSubmit={this.onFormChangeSubmit}>
         
         <label className="col-form-label labelForm" htmlFor="newDayOff">New Day-Off</label>  
            <Form.Control as="select" placeholder="Choose a day" onChange={this.chooseDay}>
            <option value="" hidden></option>
            <option value="Saturday" >Saturday</option>
            <option value="Sunday" >Sunday</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday" >Tuesday</option>
            <option value="Wednesday" >Wednesday</option>
            <option value="6" >Thursday</option>
            </Form.Control>
            <br/>

         <label className="col-form-label labelForm" htmlFor="changeReason">Reason</label>
         <input type="text" className=" form-control formTest" placeholder="Default input" id="reason" onChange={this.handleChange}/>
         <Button variant="primary" type="submit">
          Submit
         </Button> 
         {this.state.successMsg && <h6 className="successMsg">Request successfully submitted!</h6> }
         {this.state.warningMsg!="" && <h6 className="warningMsg">{this.state.warningMsg}</h6>}
          </form>
    
    }    

    {this.state.formType=="Maternity Leave" &&
     
         /* <div>
     <div class="form-group">
    <label class="col-form-label labelForm" for="inputDefault">Default input</label>
    <input type="date" class=" form-control formTest" placeholder="Default input" id="inputDefault"/>
    </div>
    
<div class="form-group has-success">
  <label class=" form-control formTest-label" for="inputValid">Valid input</label>
  <input type="text" value="correct value" class=" form-control formTest is-valid" id="inputValid"/>
  <div class="valid-feedback">Success! You've done it.</div>
</div>
</div> */
    <form onSubmit={this.onFormMaternitySubmit}>
         
         <label className="col-form-label labelForm" htmlFor="startDate">Start Date</label>
         <input type="date" className=" form-control formTest " placeholder="YYYY-MM-DD" id="startDate" required onChange={this.handleChange}/>
         <label className="col-form-label labelForm" htmlFor="endDate">End Date</label>
         <input type="date" className=" form-control formTest" placeholder="YYYY-MM-DD" id="endDate" required onChange={this.handleChange}/>
         <label className="col-form-label labelForm" htmlFor="maternityDoc">Maternity Documents</label>
         <input type="text" className=" form-control formTest" placeholder="" id="maternityDoc" required onChange={this.handleChange}/>
 
         <label className="col-form-label labelForm" htmlFor="maternityReason">Reason</label>
         <input type="text" className=" form-control formTest" placeholder="Default input" id="reason" onChange={this.handleChange}/>
         <Button variant="primary" type="submit">
          Submit
         </Button> 
         {this.state.successMsg && <h6 className="successMsg">Request successfully submitted!</h6> }
         {this.state.warningMsg!="" && <h6 className="warningMsg">{this.state.warningMsg}</h6>}
         </form>
    } 

    
    {this.state.formType=="Replacement" &&
    <form onSubmit={this.onFormReplacementSubmit}>
         
         <label className="col-form-label labelForm" htmlFor="slotDate">Slot Date</label>
         <input type="date" className=" form-control formTest" placeholder="YYYY-MM-DD" id="slotDate" required onChange={this.handleChange}/>
         <label className="col-form-label labelForm" htmlFor="slotNum">Slot Number</label>
        
         <Form.Control as="select" placeholder="Choose a slot"  onChange={this.chooseSlotNum}>
         <option value="" hidden></option>
            <option value="1" >1</option>
            <option value="2" >2</option>
            <option value="3">3</option>
            <option value="4" >4</option>
            <option value="5" >5</option>
            </Form.Control>
            <br/>
         {/* <input type="number" min="1" max="5" className=" form-control formTest" placeholder="" id="slotNum" required onChange={this.handleChange}/> */}
         <label className="col-form-label labelForm" htmlFor="slotLoc">Slot Location</label>
         <input type="text" className=" form-control formTest" placeholder="" id="slotLoc" required onChange={this.handleChange}/>
 
         <label className="col-form-label labelForm" htmlFor="slotReason">Reason</label>
         <input type="text" className=" form-control formTest" placeholder="Default input" id="reason" onChange={this.handleChange}/>
         <Button variant="primary" type="submit">
          Submit
         </Button> 
         {this.state.successMsg && <h6 className="successMsg">Request successfully submitted!</h6> }
         {this.state.warningMsg!="" && <h6 className="warningMsg">{this.state.warningMsg}</h6>}
         </form>
    
    }  

    {this.state.formType=="Slot Linking" &&
    <form onSubmit={this.onFormSlotLinkingSubmit}>
         
         <label className="col-form-label labelForm" htmlFor="slotDay">Slot Day</label>
         <Form.Control as="select" placeholder="Choose a day" required onChange={this.chooseSlotLinkingDay}>
            <option value="" hidden></option>
            <option value="Saturday" >Saturday</option>
            <option value="Sunday" >Sunday</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday" >Tuesday</option>
            <option value="Wednesday" >Wednesday</option>
            <option value="6" >Thursday</option>
            </Form.Control>
            <br/>
        
        <label className="col-form-label labelForm" htmlFor="slotNum">Slot Number</label>
         <Form.Control as="select" placeholder="Choose a slot" required onChange={this.chooseSlotNum}>
         <option value="" hidden></option>
            <option value="1" >1</option>
            <option value="2" >2</option>
            <option value="3">3</option>
            <option value="4" >4</option>
            <option value="5" >5</option>
            </Form.Control>
            <br/>
        
        <label className="col-form-label labelForm" htmlFor="courseID">Course ID</label>
         <input type="text" className=" form-control formTest" placeholder="" id="courseID" required onChange={this.handleChange}/>
 
         <label className="col-form-label labelForm" htmlFor="sickReason">Reason</label>
         <input type="text" className=" form-control formTest" placeholder="Default input" id="reason" onChange={this.handleChange}/>
         <Button variant="primary" type="submit">
          Submit
         </Button> 
         {this.state.successMsg && <h6 className="successMsg">Request successfully submitted!</h6> }
         {this.state.warningMsg!="" && <h6 className="warningMsg">{this.state.warningMsg}</h6>}
          </form>
    }

    {this.state.formType=="Sick Leave" &&
    <form onSubmit={this.onFormSickSubmit}>
         
         <label className="col-form-label labelForm" htmlFor="sickDay">Sick Day Date</label>
         <input type="date" className=" form-control formTest" placeholder="YYYY-MM-DD" id="sickDay" required onChange={this.handleChange}/>
         <label className="col-form-label labelForm" htmlFor="medicalDoc">Medical Documents</label>
         <input type="text" className=" form-control formTest" placeholder="" id="medicalDoc" required onChange={this.handleChange}/>
 
         <label className="col-form-label labelForm" htmlFor="sickReason">Reason</label>
         <input type="text" className=" form-control formTest" placeholder="Default input" id="reason" onChange={this.handleChange}/>
         <Button variant="primary" type="submit">
          Submit
         </Button> 
         {this.state.successMsg && <h6 className="successMsg">Request successfully submitted!</h6> }
         {this.state.warningMsg!="" && <h6 className="warningMsg">{this.state.warningMsg}</h6>}
          </form>
    }

    </div>
     



    return (
                <div>
                   {g}
                </div>
    )
}
 }

 export default requestsForms