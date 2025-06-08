import {
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAILURE,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILURE,
    USER_LOGOUT,
    CHECK_USER_REQUEST,
    CHECK_USER_SUCCESS,
    CHECK_USER_FAILURE
  } from './ActionTypes';
  
  const initialState = {
    loading: false,
    user: null,
    error: null
  };
  
  const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case USER_REGISTER_REQUEST:
      case USER_LOGIN_REQUEST:
      case CHECK_USER_REQUEST:
        return { ...state, loading: true, error: null };
  
      case USER_REGISTER_SUCCESS:
      case USER_LOGIN_SUCCESS:
      case CHECK_USER_SUCCESS:
        return { ...state, loading: false, user: action.payload, error: null };
  
      case USER_REGISTER_FAILURE:
      case USER_LOGIN_FAILURE:
      case CHECK_USER_FAILURE:
        return { ...state, loading: false, error: action.payload };
  
      case USER_LOGOUT:
        return { ...state, user: null, error: null };
  
      default:
        return state;
    }
  };
  
  export default authReducer;
  