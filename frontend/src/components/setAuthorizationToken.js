import axios from 'axios'

export default function setAuthorizationToken(token){
    if(token){

        console.log("bearer= "+`Bearer ${token}`)
        axios.defaults.headers.common['Authorization']=`Bearer ${token}`;
        console.log("axios= "+axios.defaults.headers.common['Authorization'])

    }
    else{
        delete axios.defaults.headers.common
    }
}