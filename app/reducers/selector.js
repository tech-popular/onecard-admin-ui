import { createSelector } from 'reselect';
import { initialState as kafkaInitialState } from './kafka';
import { initialState as userInitialState } from './user';
import { initialState as alarmInitialState } from './alarm';
import { initialState as appInitialState } from './global';
import { initialState as projectInitialState } from './project';


const appDomain = state => state.get('global', appInitialState);
const routerDomain = state => state.get('router');
const selectKafkaDomain = state => state.get('kafka', kafkaInitialState);
const selectUserDomain = state => state.get('user', userInitialState);
const selectAlarmDomain = state => state.get('alarm', alarmInitialState);
const selectProjectDomain = state => state.get('project', projectInitialState);


const makeNotifyMessage = () => createSelector(appDomain, (state) => state.get('message'));

const makeSelectRegistrations = () => createSelector(selectKafkaDomain, state => state.get('registrations'));
const makeSelectCurrent = () => createSelector(selectKafkaDomain, (state) => state.get('current'));

const makeSelectUsers = () => createSelector(selectUserDomain, (state) => state.get('users'));
const makeSelectFilter = () => createSelector(selectUserDomain, (state) => state.get('filter'));
const makeSelectDrawerUser = () => createSelector(selectUserDomain, state => state.getIn(['drawer', 'user']));
const makeSelectDrawerVisible = () => createSelector(selectUserDomain, state => state.getIn(['drawer', 'visible']));
const makeSelectAlarmThreshold = () => createSelector(selectAlarmDomain, state => state.get('thresholds'));
const makeSelectLevelMappings = () => createSelector(selectAlarmDomain, state => state.getIn(['level', 'mapping']));
const makeSelectProjectData = () => createSelector(selectProjectDomain, state => state.get('data').toJS());
const makeSelectLocation = state => createSelector(routerDomain, state => state.get('location').toJS());
const makeSelectRoles = () => createSelector(selectUserDomain, (state) => state.get('roles'));


export {
  makeSelectLocation,
  makeSelectRegistrations,
  makeSelectCurrent,
  makeSelectFilter,
  makeSelectUsers,
  makeSelectDrawerUser,
  makeSelectDrawerVisible,
  makeSelectRoles,
  makeNotifyMessage,
  makeSelectAlarmThreshold,
  makeSelectLevelMappings,
  makeSelectProjectData
};
