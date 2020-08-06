import {
    SET_ALERT,
    REMOVE_ALERT
} from './types.js';

export const setAlert = (msg,alertType,timeOut=3000) => dispatch => {
  const id = Math.random() * 100000000;
  dispatch({
      type:SET_ALERT,
      payload: { msg,alertType,id}
  });

  setTimeout(()=> dispatch({type:REMOVE_ALERT,payload:id}),timeOut)
}