import React,{Component} from 'react'
import axios from 'axios'
//import 'bootstrap/dist/css/bootstrap.min.css';
import  '../css/lastTable.css'

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
                  //   .table-scroll table {
                  //     width: 80%;
                  //     height:80%;
                  //   margin: auto;
                  //   border-collapse: separate;
                  //     border-spacing: 0;
                      
                  // }
    renderRequest(request, index) {
        return (
          <tr key={request.requestID}>
            <td className="td1">{request.reqType}</td>
            <td className="td2">{request.submission_date}</td>
            <td className="td3">{request.sentTo}</td>
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
            <h1 class="intro">Table with fluid height and width fixed header and footer (experimental use at your own risk)</h1>
<p class="intro"><strong> See <a href="https://codepen.io/paulobrien/pen/RMyMBv" target="_blank">position:sticky version</a> with NO JS required.</strong></p>
<p class="intro">The table is cloned with JS and then absolutely placed on top of the original table. The cloned copy has the tbody hidden and thus revealing just the footer and header. The content in the body is set to line-height:0 so that the table height can be controlled
  to exactly 300px (one row of the table needs to have a small line-height or the table height collapses to zero).</p>
<p class="intro">To avoid the issue with scrollbars eating up space the absolutely placed table is positioned within a holding div that already has scrollbars and thus will account for the different scrollbar widths of browsers, or indeed if scrollbars are only overlaid
  when needed as in Mac systems.</p>

<div id="table-scroll" class="table-scroll">
  
  <div id="table-wrap" class="table-wrap">
    <table id="main-table" class="main-table">
      <thead class="thead-dark">
        <tr>
          <th scope="col">Header 1</th>
          <th scope="col">Header 2</th>
          <th scope="col">Header 3</th>
       
        </tr>
      </thead>
      <tbody className="testBody">
      {reqs.map(this.renderRequest)}
      </tbody>
     
        </table>
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