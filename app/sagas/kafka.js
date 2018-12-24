import { actions, types } from 'reducers/kafka';

import { call, put, takeLatest, all } from 'redux-saga/effects';
import { Get } from 'utils/client';


export function* fetchKafkaRegister() {
  const registers = yield call(Get, `/kafka/registration`);
  yield put(actions.update(registers))
}



export default function* rootSaga() {
  yield all([
    takeLatest(types.LOAD_REGISTRATION, fetchKafkaRegister),
  ])
}
