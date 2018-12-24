import { fromJS } from 'immutable';

export const types = {
  UPDATE: 'app/PROJECT/UPDATE',
  LOAD_PROJECTS: 'app/PROJECT/LOAD_PROJECTS',
};


export const initialState = fromJS({
  data: {
    projects: false,
    groups: false,
    services: false,
  },
});


export default (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE:
      const projectData = action.projects;
      const _projects = new Set();
      const _groups = new Set();
      const _services = new Set();
      projectData.forEach(item => {
        _groups.add(item.group);
        _projects.add(item.project);
        _services.add(item.serviceName);
      });

      // const { projects, groups, services } = action.data;
      return state.setIn(['data', 'projects'], [..._projects])
        .setIn(['data', 'groups'], [..._groups])
        .setIn(['data', 'services'], [..._services]);
    default:
      return state;
  }
}

export const actions = {
  update: projects => ({ type: types.UPDATE, projects }),
  loadProjects: () => ({ type: types.LOAD_PROJECTS }),
};
