import { fromJS, List } from 'immutable';
import _ from 'lodash';

export const types = {
  PUT_ALL: 'app/UserPage/PUT_ALL_USER',
  UPDATE: 'app/UserPage/UPDATE',
  UPDATE_SUCCESS: 'app/UserPage/UPDATE_SUCCESS',
  DELETE: 'app/UserPage/DELETE_USER',
  DELETE_SUCCESS: 'app/UserPage/DELETE_USER_SUCCESS',
  UPDATE_STATE: 'app/UserPage/UPDATE_STATE',
  UPDATE_STATE_SUCCESS: 'app/UserPage/UPDATE_STATE_SUCCESS',
  LOAD: 'app/UserPage/LOAD_USER',
  ADD: 'app/UserPage/ADD_USER',
  SEARCH: 'app/UserPage/SEARCH_USER',
  ADD_SUCCESS: 'app/UserPage/ADD_USER_SUCCESS',
  DELETE_USER_ROLE: 'app/UserPage/DELETE_USER_ROLE',
  DELETE_USER_ROLE_SUCCESS: 'app/UserPage/DELETE_USER_ROLE_SUCCESS',
  DRAWER_VISIBLE: 'app/UserPage/DRAWER_VISIBLE',

  PUT_ALL_ROLES: 'app/UserPage/PUT_ALL_ROLES',
  LOAD_ROLES: 'app/UserPage/LOAD_ROLES',
  ADD_ROLE: 'app/UserPage/ADD_ROLE',
  ADD_ROLE_SUCCESS: 'app/UserPage/ADD_ROLE_SUCCESS',
};

export const initialState = fromJS({
  users: false,
  drawer: {
    visible: false,
    user: false,
  },
  filter: false,
  roles: false,
});


export default (state = initialState, action) => {
  switch (action.type) {
    case types.PUT_ALL:
      return state.set('users', action.data);
    case types.PUT_ALL_ROLES:
      return state.set('roles', action.data);
    case types.DELETE_USER_ROLE_SUCCESS:
      return state.set('users', [...state.get('users').map(user => {
        return { ...user, roles: user.roles.filter(r => r.id !== action.id) };
      })]);
    case types.DELETE_SUCCESS:
      return state.set('users', [...state.get('users').filter(user => user.id !== action.id)]);
    case types.UPDATE_SUCCESS:
      const { id, data } = action;
      return state.set('users',
        [...state.get('users').map(user => user.id === id ? { ...user, ...data } : user)]);
    case types.UPDATE_STATE_SUCCESS:
      return state.set('users',
        [...state.get('users').map(user => user.id === action.id ? {
          ...user,
          enable: user.enable === 'ENABLED' ? 'DISABLED' : 'ENABLED',
        } : user)],
      );
    case types.ADD_SUCCESS:
      return state.set('users', [...[action.user], ...state.get('users')]);
    case types.DRAWER_VISIBLE:
      const { visible, user } = action;
      return state.setIn(['drawer', 'visible'], visible).setIn(['drawer', 'user'], user);
    case types.ADD_ROLE_SUCCESS:
      return state.set('roles', [...[action.data], ...state.get('roles')]);
    case types.FILTER:
      return state.set('filter', action.key);
    default:
      return state;
  }
}

export const actions = {
  update: (id, data) => ({ type: types.UPDATE, data, id }),
  updateUserSuccess: (id, data) => ({ type: types.UPDATE_SUCCESS, data, id }),
  putAll: data => ({ type: types.PUT_ALL, data }),
  load: (key) => ({ type: types.LOAD, key }),
  updateState: id => ({ type: types.UPDATE_STATE, id }),
  updateUserStateSuccess: id => ({ type: types.UPDATE_STATE_SUCCESS, id }),
  addUser: user => ({ type: types.ADD, user }),
  addUserSuccess: user => ({ type: types.ADD_SUCCESS, user }),
  delete: id => ({ type: types.DELETE, id }),
  deleteSuccess: id => ({ type: types.DELETE_SUCCESS, id }),
  deleteUserRole: id => ({ type: types.DELETE_USER_ROLE, id }),
  deleteUserRoleSuccess: id => ({ type: types.DELETE_USER_ROLE_SUCCESS, id }),
  changeDrawerVisible: (visible, user) => ({ type: types.DRAWER_VISIBLE, visible, user }),

  loadRoles: () => ({ type: types.LOAD_ROLES }),
  putAllRoles: data => ({ type: types.PUT_ALL_ROLES, data }),
  addRole: name => ({ type: types.ADD_ROLE, name }),
  addRoleSuccess: data => ({ type: types.ADD_ROLE_SUCCESS, data }),
};
