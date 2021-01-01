import React,{Component} from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';
<link rel="stylesheet" type="text/css" href="./table.css" />

class test extends Component{
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
                <div class="container">
<h2>Responsive Table with RWD-Table-Patterns</h2>

<div class="container">
  <div class="row">
    <div class="col-xs-12">
      <div class="table-responsive" data-pattern="priority-columns">
        <table summary="This table shows how to create responsive tables using RWD-Table-Patterns' functionality" class="table table-bordered table-hover">
          <caption class="text-center">An example of a responsive table based on RWD-Table-Patterns' <a href="http://gergeo.se/RWD-Table-Patterns/" target="_blank"> solution</a>:</caption>
          <thead>
            <tr>
              <th>Country</th>
              <th data-priority="1">Languages</th>
              <th data-priority="2">Population</th>
            </tr>
          </thead>
          <tbody>
          {reqs.map(this.renderRequest)}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="5" class="text-center">Data retrieved from <a href="http://www.infoplease.com/ipa/A0855611.html" target="_blank">infoplease</a> and <a href="http://www.worldometers.info/world-population/population-by-country/" target="_blank">worldometers</a>.</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
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

export default test