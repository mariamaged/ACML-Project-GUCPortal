import React,{Component} from 'react'
import axios from 'axios'
//import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/test44.css'
class test2 extends Component{
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

     // <div className="requests card" key={request.requestID}>
                    // <div className="cardContent">
                    //     <span className="request type">{request.reqType}</span>
                    //     <p>{request.sentTo}</p>
                    // </div>
    
        renderRequest(request, index) {
            return (
                <tr key={request.requestID} className="trr">
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
                        
              // <h1 className="intro">Table with fluid height and width fixed header and footer (experimental use at your own risk)</h1>
                // <p className="intro"><strong> See <a href="https://codepen.io/paulobrien/pen/RMyMBv" target="_blank">position:sticky version</a> with NO JS required.</strong></p>
                // <p className="intro">The table is cloned with JS and then absolutely placed on top of the original table. The cloned copy has the tbody hidden and thus revealing just the footer and header. The content in the body is set to line-height:0 so that the table height can be controlled
                //   to exactly 300px (one row of the table needs to have a small line-height or the table height collapses to zero).</p>
                // <p className="intro">To avoid the issue with scrollbars eating up space the absolutely placed table is positioned within a holding div that already has scrollbars and thus will account for the different scrollbar widths of browsers, or indeed if scrollbars are only overlaid
                //   when needed as in Mac systems.</p>
                <div className="container containMonica">
  <table className="table table-fixed monica">
    <thead className="thh">
      <tr className="rrt">
        <th className="col-xs-3 mon">First Name</th>
        <th className="col-xs-3 mon">Last Name</th>
        <th className="col-xs-6 mon">E-mail</th>
      </tr>
    </thead>
    <tbody className="bodyName">
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
           
           reqList
        )
    }
}

export default test2