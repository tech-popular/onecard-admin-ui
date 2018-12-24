import { fromJS } from 'immutable';

export const types = {
  NOTIFY_MESSAGE: 'app/App/NOTIFY_MESSAGE',
  CLEAN_MESSAGE: 'app/App/CLEAN_MESSAGE',
};

export const initialState = fromJS({
  message: false,
});

export default (state = initialState, action) => {
  switch (action.type) {
    case types.NOTIFY_MESSAGE:
      const { content, level } = action;
      return state.set('message', { type: level, content });
    case types.CLEAN_MESSAGE:
      return state.set('message', false);
    default:
      return state;
  }
}

export const actions = {
  notifyErrorMessage: content => ({ type: types.NOTIFY_MESSAGE, content, level: 'error' }),
  notifySuccessMessage: content => ({ type: types.NOTIFY_MESSAGE, content, level: 'success' }),
  cleanMessage: () => ({ type: types.CLEAN_MESSAGE }),
};
