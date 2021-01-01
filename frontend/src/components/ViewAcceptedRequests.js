import React,{Component} from 'react'
import axios from 'axios'

<link rel="stylesheet" type="text/css" href="/index.css" />
class ViewAcceptedRequests extends Component{
    state={
        requests:[]
    }
    componentDidMount(){
    console.log("in view")
        axios.get('http://localhost:5000/academic/acceptedRequests',
        {
            headers:{
                'x-auth-token':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmZTVhNmIxZTZiZWU4MWY5ODVlNTYwZiIsInJvbGUiOiJBY2FkZW1pYyBNZW1iZXIiLCJhY2FkZW1pY19yb2xlIjoiQ291cnNlIEluc3RydWN0b3IiLCJpc0hlYWQiOmZhbHNlLCJpYXQiOjE2MDk0Mzk1MDZ9.JDCdnFdtRtiEA-y2ziCUTRjHRg28NtL_jP-dg3UzMkY'
            }
        }
        ).then(res=>{
            console.log(res.data[0].reqType)
            this.setState({requests:res.data})
            console.log("new state= "+this.state.requests)

        }).catch(console.log("error"))
    }

     // <div className="requests card" key={request.requestID}>
                    // <div className="cardContent">
                    //     <span className="request type">{request.reqType}</span>
                    //     <p>{request.sentTo}</p>
                    // </div>
    
    renderRequest(request, index) {
      return (
            <tr key={request.requestID}>
            <td>{request.reqType}</td>
            <td>{request.submission_date}</td>
            <td>{request.sentTo}</td>
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
                <div class="container">
                <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Filter
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" >Accepted</a>
                    <a class="dropdown-item" >Rejected</a>
                    <a class="dropdown-item" >Pending</a>
                </div>
                </div>
                <table striped condensed hover  class="table-wrapper" className="rwd-table">
                

                <thead>
                    <tr>
                    <th>Request Type</th>
                    <th>Request Receiver</th>
                    <th>Submission Date</th>
                    </tr>
                </thead>
                <tbody>
                    {reqs.map(this.renderRequest)}
                </tbody>
                </table>
               
                </div>
              )
            })
        ):
        (
        <div className="center">No requests yet</div>
        )

        
        return (
           
           <div>Test{reqList}</div>
        )
    }
}

export default ViewAcceptedRequests