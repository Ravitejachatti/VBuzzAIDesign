// this is store.js for the Redux

import {legacy_createStore, applyMiddleware, combineReducers} from 'redux';
import {thunk} from 'redux-thunk'
import authReducer from './Auth/Reducer';


const rootReducer = combineReducers({
    Auth:authReducer,
  
})

const store = legacy_createStore(rootReducer, applyMiddleware(thunk))

// Export the store as a default export
export default store;