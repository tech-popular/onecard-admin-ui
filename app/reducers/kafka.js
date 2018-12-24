import { fromJS } from 'immutable';

export const types = {
  UPDATE_REGISTRATION: 'app/KafkaPage/UPDATE_KAFKA_REGISTRATION',
  LOAD_REGISTRATION: 'app/KafkaPage/LOAD_KAFKA_REGISTRATION',
  VIEW_REGISTRATION: 'app/KafkaPage/VIEW_KAFKA_REGISTRATION',
  LOAD_REGISTRATION_FAILED: 'app/KafkaPage/LOAD_KAFKA_REGISTRATION_FAILED',
};


export const initialState = fromJS({
  registrations: false,
  current: false,
  error: false,
});


export default (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_REGISTRATION:
      return state.set('registrations', action.data);
    case types.VIEW_REGISTRATION:
      return state.set('current', action.register);
    default:
      return state;
  }
}

export const actions = {
  update: data => ({ type: types.UPDATE_REGISTRATION, data }),
  load: () => ({ type: types.LOAD_REGISTRATION}),
  view: register => ({ type: types.VIEW_REGISTRATION, register }),
};
