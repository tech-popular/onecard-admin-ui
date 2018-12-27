import { fromJS } from 'immutable';

export const types = {
  UPDATE: 'app/PROJECT/UPDATE',
  LOAD_PROJECTS: 'app/PROJECT/LOAD_PROJECTS',
};


export const initialState = fromJS({
  projects: false
});


export default (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE:
      return state.set('projects', action.data);
    default:
      return state;
  }
}

export const actions = {
  update: data => ({ type: types.UPDATE, data }),
  loadProjects: () => ({ type: types.LOAD_PROJECTS }),
};
