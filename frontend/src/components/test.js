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

class test extends Component{
    state={
        requests:[]
    }
    componentDidMount(){
    console.log("in view")
        axios.get('http://localhost:5000/academic/sentReplacementRequests',
        {
            headers:{
                'x-auth-token':localStorage.getItem('jwtToken')
            }
        }
        ).then(res=>{
            console.log(res.data[0].reqType)
            this.setState({requests:res.data})
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

        // imgFormatter=(cell,row)=> {
        //     return  <a href="/#" >
        //             <i className="fa fa-pencil" aria-hidden="true"></i>
        //             </a>;
        // }
        renderRequest=(request, index)=> {
            return (
                
                <tr key={request.requestID} className="reqTr" class='clickable-row' onClick={(e)=>this.handleClick(e,request.requestID)}>
                <td className="reqTd" >{request.counter}</td>
                
                <td className="reqTd" >
                <a className="inTable">
                <Link to={{ pathname: '/getRequest', state: { request_id:request.requestID}}}>
                {request.requestID}
                </Link>
                </a>
               </td>


                <td className="reqTd">{request.submission_date}</td>
                <td className="reqTd">{request.sentTo}</td>
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

                 <div className="containDrop d-inline-block">
                
                                <form action="/action_page.php">
                <label for="cars">Choose a car:</label>
                <select name="cars" id="cars">
                    <option value="volvo">Volvo</option>
                    <option value="saab">Saab</option>
                    <option value="opel">Opel</option>
                    <option value="audi">Audi</option>
                </select>
                <br><br>
                <input type="submit" value="Submit">
                </form> 
                </div> 

                

                <div className="container containTable">
                <Table striped bordered hover size="sm" className="reqTable">
                <thead className="reqHead">
                    <tr className="reqTr">
                    <th className="reqTh">#</th>
                    <th className="reqTh">Request ID</th>
                    <th className="reqTh">Request Type</th>
                    <th className="reqTh">Submission Date</th>
                    </tr>
                </thead>
                <tbody className="reqBody">
                {reqs.map(this.renderRequest)}
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

export default test