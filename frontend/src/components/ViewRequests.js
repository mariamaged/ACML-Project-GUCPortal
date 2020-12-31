import React,{Component} from 'react'
import axios from 'axios'
class ViewRequests extends Component{
    state={
        requests:""
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
        axios.get('http://localhost:5000/academic/sentReplacementRequests').then(res=>{
            console.log(res)
            this.setState({requests:res.data})

        }).catch(console.log("error"))
    }
    
    render(){
        const requests=this.state.requests
        const reqList=requests.length?(
            requests.map(request=>{
                return(
                    <div className="requests card" key={request.requestID}>
                    <div className="cardContent">
                        <span className="request type">{request.type}</span>
                        <p>{request.sentTo}</p>
                    </div>

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

export default ViewRequests