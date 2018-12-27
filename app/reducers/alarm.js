import { fromJS } from 'immutable';
import _ from 'lodash';

export const types = {
  LOAD_TASK: 'app/AlarmPage/LOAD_TASK',
  LOAD_LEVEL: 'app/AlarmPage/LOAD_LEVEL',
  UPDATE_TASK: 'app/AlarmPage/UPDATE_TASK',
  UPDATE_LEVEL: 'app/AlarmPage/UPDATE_LEVEL',
};

export const initialState = fromJS({
  tasks: false,
  levels: false,
});


export default (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_TASK:
      return state.set('tasks', action.data);
    case types.UPDATE_LEVEL:
      return state.set('levels', action.data);
    default:
      return state;
  }
}

export const actions = {
  loadTask: () => ({ type: types.LOAD_TASK }),
  loadLevel: () => ({ type: types.LOAD_LEVEL }),
  updateTaskList: (data) => ({ type: types.UPDATE_TASK, data }),
  updateTaskLevel: (data) => ({ type: types.UPDATE_LEVEL, data }),
};
