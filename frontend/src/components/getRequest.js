import React,{Component} from 'react'
import axios from 'axios'
import {Link,NavLink} from 'react-router-dom'
import  { Redirect } from 'react-router-dom'


class getRequest extends Component{
    state={
        requestID:""
    }



    componentDidMount(props){
        const {foo} = props.location.state
        console.log(foo)
        // console.log("request_id",this.props.location.state.request_id);}
}

        render(){
            return(
                <div>Get requests</div>
            )
        }

}
export default getRequest