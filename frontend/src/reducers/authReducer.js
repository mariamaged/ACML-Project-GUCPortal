import SET_CURRENT_USER from '../actions/types'

const initState={
    isAuthenticated:false,
    user:{}
}

export default(state=initState,action)=>{
    switch(action.type){
        case SET_CURRENT_USER:
        return{
            isAuthenticated: action.user?true:false,
            user:action.user
        };
        default:return state
    }
}