import { actions, types } from 'reducers/user';
import { actions as globalActions } from 'reducers/global';
import { actions as projectActions } from 'reducers/project';

import { call, put, takeLatest, all } from 'redux-saga/effects';
import { Get, Delete, Put, Post } from 'utils/client';


export function* addUser({ user }) {
  const response = yield call(Post, `/user`, user);
  if (!response.error) {
    yield put(globalActions.notifySuccessMessage(`添加用户`));
    yield put(actions.addUserSuccess(response.message));
  } else {
    yield put(globalActions.notifyErrorMessage(`添加用户失败`));
  }
}

export function* addRole({ name }) {
  const response = yield call(Post, `/role`, { name });
  if (!response.error) {
    yield put(globalActions.notifySuccessMessage(`添加角色`));
    yield put(actions.addRoleSuccess(response));
  } else {
    yield put(globalActions.notifyErrorMessage(`添加角色失败`));
  }
}

export function* fetchRoles() {
  const roles = yield call(Get, `/role`);
  yield put(actions.putAllRoles(roles));
}

export function* fetchUsers({ key }) {
  let url = `/user`;
  if (key) {
    url = `/user?name=${key}&email=${key}`;
  }
  const users = yield call(Get, url);

  yield put(actions.putAll(users));
}


export function* updateUserState({ id }) {
  const response = yield call(Put, `/user/${id}/state`);
  if (!response.error) {
    yield put(globalActions.notifySuccessMessage(`更新用户状态, id:${id}`));
    yield put(actions.updateUserStateSuccess(id));
  } else {
    yield put(globalActions.notifyErrorMessage(`更新用户状态失败, id:${id}`));
  }
}

export function* updateUser({ id, data }) {
  const response = yield call(Put, `/user/${id}`, data);
  if (response.error) {
    yield put(globalActions.notifyErrorMessage('更新用户失败'));
  } else {
    yield put(actions.updateUserSuccess(id, response.message));
  }

}

export function* deleteUserRole({ id }) {
  const response = yield call(Delete, `/user/role/${id}`);
  if (response.error) {
    yield put(globalActions.notifyErrorMessage(`删除用户角色失败, id:${id}`));
  } else {
    yield put(actions.deleteUserRoleSuccess(id));
    yield put(globalActions.notifySuccessMessage(`删除用户角色, id:${id}`));
  }

}

export function* deleteUser({ id }) {
  const response = yield call(Delete, `/user/${id}`);
  if (response.error) {
    yield put(globalActions.notifyErrorMessage('删除用户失败'));
  } else {
    yield put(actions.deleteSuccess(id));
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(types.UPDATE_STATE, updateUserState),
    takeLatest(types.LOAD, fetchUsers),
    takeLatest(types.ADD, addUser),
    takeLatest(types.UPDATE, updateUser),
    takeLatest(types.DELETE_USER_ROLE, deleteUserRole),
    takeLatest(types.DELETE, deleteUser),

    takeLatest(types.LOAD_ROLES, fetchRoles),
    takeLatest(types.ADD_ROLE, addRole),

  ]);
}
