import axios from 'axios'
import setAuthorizationToken from '../components/setAuthorizationToken'
import jwt from 'jsonwebtoken'
import {SET_CURRENT_USER} from '../actions/types'



export default function setCurrentUser(user){
    return{
        type:SET_CURRENT_USER,
        user
    }
}