import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'

import { ApplicationReducer } from './application';
import { ApiModelWrapperReducer } from './apiModelWrapper';

export const Reducers = (history) => combineReducers({
    router: connectRouter(history),
    ApplicationState: ApplicationReducer,
    ApiModelWrapperState: ApiModelWrapperReducer
});