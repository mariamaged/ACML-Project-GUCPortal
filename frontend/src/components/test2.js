import React,{Component} from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';
 <link rel="stylesheet" type="text/css" href="./css/newTable.css" />
{/* <link href="https://unpkg.com/gridjs/dist/theme/mermaid.min.css" rel="stylesheet" /> */}
class test2 extends Component{
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
                     

            <table class="flatTable">
            <tr class="titleTr">
                <td class="titleTd">TABLE TITLE</td>
                <td colspan="4"></td>
                <td class="plusTd button"></td>
            </tr>
            <tr class="headingTr">
                <td>REFERENCE</td>
                <td>DATE ISSUED</td>
                <td>COMPANY</td>
                <td></td>
            </tr>
            <tbody>
                    {reqs.map(this.renderRequest)}
                </tbody>
            </table>

            <div id="sForm" class="sForm sFormPadding">
                    <span class="button close"><img src="https://i.imgur.com/nnzONel.png" alt="X"  class="" /></span>
                    <h2 class="title">Add a New Record</h2>  
                </div>

            <link href='https://fonts.googleapis.com/css?family=Lato:100,300,400,700,900' rel='stylesheet' type='text/css'></link>
                        
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

export default test2