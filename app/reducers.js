import { combineReducers } from 'redux-immutable';
import { connectRouter } from 'connected-react-router/immutable';

import globalReducer from 'reducers/global';
import kafkaReducer from 'reducers/kafka';
import userReducer from 'reducers/user';
import alarmReducer from 'reducers/alarm';
import projectReducer from 'reducers/project';

import history from 'utils/history';

export default function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    global: globalReducer,
    kafka: kafkaReducer,
    user: userReducer,
    alarm: alarmReducer,
    project: projectReducer,
    ...injectedReducers,
  });

  // Wrap the root reducer and return a new root reducer with router state
  return connectRouter(history)(rootReducer);
}
