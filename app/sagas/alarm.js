import { actions, types } from "reducers/alarm";

import { call, put, takeLatest, all } from "redux-saga/effects";
import { Delete, Get, Post } from "utils/client";


export function* fetchTask() {
  const response = yield call(Get, `/alarm/task`);
  yield put(actions.updateTaskList(response));
}

export function* fetchLevels() {
  const response = yield call(Get, `/alarm/task/level`);
  yield put(actions.updateTaskLevel(response));
}

export default function* rootSaga() {
  yield all([
    takeLatest(types.LOAD_TASK, fetchTask),
    takeLatest(types.LOAD_LEVEL, fetchLevels)
  ]);
}
