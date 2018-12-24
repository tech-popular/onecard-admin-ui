import { fromJS } from 'immutable';
import _ from 'lodash';

export const types = {
  LOAD_THRESHOLD: 'app/AlarmPage/LOAD_THRESHOLD',
  ADD_THRESHOLD: 'app/AlarmPage/ADD_THRESHOLD',
  DELETE_THRESHOLD: 'app/AlarmPage/DELETE_THRESHOLD',
  DELETE_THRESHOLD_SUCCESS: 'app/AlarmPage/DELETE_THRESHOLD_SUCCESS',
  ADD_THRESHOLD_SUCCESS: 'app/AlarmPage/ADD_THRESHOLD_SUCCESS',
  UPDATE_THRESHOLD: 'app/AlarmPage/UPDATE_THRESHOLD',
  LOAD_LEVEL_MAPPING: 'app/AlarmPage/LOAD_LEVEL_MAPPING',
  UPDATE_LEVEL_MAPPING: 'app/AlarmPage/UPDATE_LEVEL_MAPPING',
};

export const initialState = fromJS({
  thresholds: false,
  level: {
    mapping: false,
  },
});


export default (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_THRESHOLD:
      return state.set('thresholds', action.data);
    case types.ADD_THRESHOLD_SUCCESS:
      return state.set('thresholds', [...[action.data], ...state.get('thresholds')]);
    case types.UPDATE_LEVEL_MAPPING:
      return state.setIn(['level', 'mapping'], action.data);
    case types.DELETE_THRESHOLD_SUCCESS:
      return state.set('thresholds', _.reject(state.get('thresholds'), { 'id': action.id }));
    default:
      return state;
  }
}

export const actions = {
  loadThreshold: (text = "") => ({ type: types.LOAD_THRESHOLD, text }),
  deleteThreshold: id => ({ type: types.DELETE_THRESHOLD, id }),
  deleteThresholdSuccess: id => ({ type: types.DELETE_THRESHOLD_SUCCESS, id }),
  addThreshold: data => ({ type: types.ADD_THRESHOLD, data }),
  addThresholdSuccess: (data) => ({ type: types.ADD_THRESHOLD_SUCCESS, data }),
  updateThreshold: (data) => ({ type: types.UPDATE_THRESHOLD, data }),
  loadLevelMapping: () => ({ type: types.LOAD_LEVEL_MAPPING }),
  updateLevelMapping: (data) => ({ type: types.UPDATE_LEVEL_MAPPING, data }),
};
