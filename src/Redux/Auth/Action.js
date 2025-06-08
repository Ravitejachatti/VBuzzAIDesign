import { post, get } from '../../API/Apiendpoint.js';
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
} from './ActionTypes.js';

// Register Action
export const registerUser = (userData) => async (dispatch) => {
  dispatch({ type: USER_REGISTER_REQUEST });
  try {
    const response = await post('/api/auth/register', userData);
    dispatch({ type: USER_REGISTER_SUCCESS, payload: response.data });
    return { success: true, payload: response.data }; // Return success
  } catch (error) {
    console.log("error")
    const errorMessage = error.response ? error.response.data.message : error.message;
    dispatch({
      type: USER_REGISTER_FAILURE,
      payload: errorMessage,
    });
    
    return { success: false, message: errorMessage }; // Return failure
  }
};


// Login Action
export const loginUser = (credentials) => async (dispatch) => {
  dispatch({ type: USER_LOGIN_REQUEST });
  try {
    const response = await post('/api/auth/login', credentials);
    console.log("API response:", response);

    // Dispatch success action with the response data
    dispatch({ type: USER_LOGIN_SUCCESS, payload: response.data });

    // Return success response
    return { success: true, data: response.data };
  } catch (error) {
    // Log the full error object to debug
    console.log("Full error object:", error);

    // Extract error message from the response
    const errorMessage = error.response ? error.response.data.message : error.message;
    console.log("Extracted error message:", errorMessage);

    // Dispatch failure action with the error message
    dispatch({
      type: USER_LOGIN_FAILURE,
      payload: errorMessage,
    });

    // Return failure response
    return { success: false, message: errorMessage };
  }
};


// Logout Action
export const logoutUser = () => (dispatch) => {
  dispatch({ type: USER_LOGOUT });
  get('/api/auth/logout').catch(console.error);
};

// Check User Action
export const checkUser = () => async (dispatch) => {
  dispatch({ type: CHECK_USER_REQUEST });
  try {
    const response = await get('/api/auth/CheckUser');
    dispatch({ type: CHECK_USER_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({
      type: CHECK_USER_FAILURE,
      payload: error.response ? error.response.data.message : error.message
    });
  }
};
