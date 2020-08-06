import {
    GET_PROFILE,
    PROFILE_ERROR,
    CLEAR_PROFILE,
    UPDATE_PROFILE
} from '../actions/types.js'
const initialState = {
    profile: null,
    profiles: [],
    repos: [],
    loading: true,
    error: {}
}

export default function(state=initialState,action){
    
    switch (action.type) {
      
        case CLEAR_PROFILE:
            return{
                ...state,
                profile:null,
                repos:[],
                loading:false
            }
        case GET_PROFILE:
        case UPDATE_PROFILE:
            return{
                ...state,
                profile:action.payload,
                loading:false
            }
        case PROFILE_ERROR:
            return{
                ...state,
                error:action.payload,
                loading:false
            }    
       default:
           return state
    }
}