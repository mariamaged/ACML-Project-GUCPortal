import React,{Component} from 'react'
import axios from 'axios'
// import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Table } from 'react-bootstrap';
// import BootstrapTable from 'react-bootstrap-table-next';
import '../css/test44.css'
class newTest extends Component{
    state={
        requests:[],
        counter:0
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

    
    
        renderRequest=(request, index)=> {
            return (
                
                <tr key={request.requestID} className="trr">
                <td className="tdd">{request.counter}</td>
                <td className="tdd">{request.reqType}</td>
                <td className="tdd">{request.submission_date}</td>
                <td className="tdd">{request.sentTo}</td>
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
                <div className="container containMonica">
                <Table striped bordered hover size="sm" className="monica">
                <thead className="thh">
                    <tr className="rrt">
                    <th className="mon">#</th>
                    <th className="mon">First Name</th>
                    <th className="mon">Last Name</th>
                    <th className="mon">Username</th>
                    </tr>
                </thead>
                <tbody className="bodyName">
                {reqs.map(this.renderRequest)}
                </tbody>
                </Table>
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

export default newTest