import { combineReducers } from 'redux';
import councillorsReducer from './councillorsReducer';

const reducers = combineReducers({
    councillors: councillorsReducer,
});

export default reducers;
