import { actions, types } from 'reducers/alarm';

import { call, put, takeLatest, all } from 'redux-saga/effects';
import { Delete, Get, Post } from 'utils/client';
import { actions as globalActions } from '../reducers/global';
import { actions as projectActions } from '../reducers/project';


export function* fetchLevelMapping() {
  const response = yield call(Get, `/alarm/level/mapping`);
  yield put(actions.updateLevelMapping(response));
}


export function* deleteAlarmThreshold({ id }) {
  const response = yield call(Delete, `/alarm/threshold/${id}`);
  if (response.error) {
    yield put(globalActions.notifyErrorMessage(`删除记录失败, id:${id}`));
  } else {
    yield put(actions.deleteThresholdSuccess(id));
    yield put(globalActions.notifySuccessMessage(`删除记录, id:${id}`));
  }
}


export function* fetchAlarmThreshold({text}) {
  const response = yield call(Get, `/alarm/threshold?key=${text}`);

  yield put(actions.updateThreshold(response));
}


export function* addAlarmThreshold({ data }) {
  const response = yield call(Post, `/alarm/threshold`, data);
  if (!response.error) {
    yield put(globalActions.notifySuccessMessage(`添加阈值`));
    yield put(actions.addThresholdSuccess(response));
  } else {
    yield put(globalActions.notifyErrorMessage(`添加阈值失败`));
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(types.LOAD_THRESHOLD, fetchAlarmThreshold),
    takeLatest(types.ADD_THRESHOLD, addAlarmThreshold),
    takeLatest(types.LOAD_LEVEL_MAPPING, fetchLevelMapping),
    takeLatest(types.DELETE_THRESHOLD, deleteAlarmThreshold),
  ]);
}
