import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGOUT
} from '../actions/types.js'

const intialState = {
    token: localStorage.getItem('token'),
    isAuthenticated:null,
    loading:true,
    user:null
}

export default function(state=intialState,action) {
      switch (action.type) {
          case AUTH_ERROR:
           case LOGOUT:   
            localStorage.removeItem('token');
              return{
                  ...state,
                  isAuthenticated:false,
                  loading:false,
                  token:null,
                }
          case USER_LOADED:
              return {
                  ...state,
                  isAuthenticated:true,
                  loading:false,
                  user:action.payload
              }
          case REGISTER_SUCCESS:
          case LOGIN_SUCCESS:    
              localStorage.setItem('token',action.payload.token)
              return {
                  ...state,
                  ...action.payload,
                  isAuthenticated:true,
                  loading:false
              }
          case REGISTER_FAIL:
          case LOGIN_FAIL:    
              localStorage.removeItem('token');
              return {
                ...state,
                token:null,
                isAuthenticated:false,
                loading:false
            }    
          default:
              return state
      }
}