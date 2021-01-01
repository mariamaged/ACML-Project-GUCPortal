import React,{Component} from 'react'
import axios from 'axios'
import '../css/newTables.css'
//import 'bootstrap/dist/css/bootstrap.min.css';
/* <link rel="stylesheet" type="text/css" href="../css/reqTable.css" /> */


class ViewRequests extends Component{
    state={
        requests:[]
    }
    componentDidMount(){
    //     console.log("here in mount")
    //      axios.get('/sentReplacementRequests').then(res=>{
    //         console.log("hereeeeeeeeeeee"+res)
    //       console.log(res)
    //       this.setState({
    //           requests:res.data
    //       })
    //   })
    console.log("in view")
        axios.get('http://localhost:5000/academic/sentReplacementRequests',
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
                <div className="container" >
                  <div className="dropdown-container">
                                
                        
            <a class="btn btn-secondary dropdown-toggle" href="/#" role="button" id="dropdownMenuLink" 
            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Dropdown link
            </a>

            <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <a class="dropdown-item" href="/ViewAcceptedRequests">Accepted</a>
                <a class="dropdown-item" href="/ViewRejectedRequests">Rejected</a>
                <a class="dropdown-item" href="/ViewPendignRequests">Pending</a>
            </div>


           </div>

                <div class="container table-responsive py-5"> 
                <table class="table table-bordered table-hover reqTable">
                <thead class="thead-dark">
                    <tr>
                    
                    <th scope="col">Request Type</th>
                    <th scope="col">Request Receiver</th>
                    <th scope="col">Submission Date</th>
                    </tr>
                </thead>
                <tbody>
                {reqs.map(this.renderRequest)}
                </tbody>
                </table>
                </div>


                </div>
              )
            })
        ):
        (
        <div className="center">No requests yet</div>
        )

        
        return (
           
           <div>{reqList}</div>
        )
    }
}

export default ViewRequests