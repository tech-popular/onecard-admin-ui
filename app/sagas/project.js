import { actions, types } from 'reducers/project';

import { call, put, takeLatest, all } from 'redux-saga/effects';
import { Get } from 'utils/client';


export function* fetchProjects() {
  const projects = yield call(Get, `/project`);

  yield put(actions.update(projects))
}



export default function* rootSaga() {
  yield all([
    takeLatest(types.LOAD_PROJECTS, fetchProjects),
  ])
}
