import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { compose } from 'redux';

import { Layout } from 'antd';
import Sider from './sider';
import KafkaPage from '../KafkaPage';
import HomePage from '../HomePage';
import UserPage from '../UserPage';
import AlarmPage from '../AlarmPage';
import NotFoundPage from '../NotFoundPage';

import injectSaga from 'utils/injectSaga';
// import 'antd/dist/antd.css';

import GlobalStyle from 'global-styles';
import kafkaSaga from 'sagas/kafka';
import userSaga from 'sagas/user';
import alarmSaga from 'sagas/alarm';
import projectSaga from 'sagas/project';
import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';

const { Header, Content, Footer } = Layout;

import Global from './global';
import { createStructuredSelector } from 'reselect';
import { actions as alarmActions } from 'reducers/alarm';
import { actions as projectActions } from 'reducers/project';
import { makeSelectProjectData, makeSelectAlarmLevels } from 'reducers/selector';


class MainPage extends Component {
  constructor(props){
    super(props);
  }

  componentDidMount() {
    this.props.loadProjects();
    this.props.loadAlarmLevel();
  }

  render() {
    const {projects, levels} = this.props;
    if(projects === false || levels === false){
      return <h1>加载中...</h1>
    }
    return (
      <div>
        <Layout>
          <Sider />
          <Layout style={{ marginLeft: 200 }}>
            <Header style={{ background: '#fff', padding: 0 }} />
            <Content style={{ margin: '12px 20px', backgroundColor: '#fff', overflow: 'initial' }}>
              <Switch>
                <Route exact path="/" render={() => <Redirect to="/home" />} />
                <Route exact path="/home" component={HomePage} />
                <Route exact path="/user" component={UserPage} />
                <Route exact path="/alarm" component={AlarmPage} />
                <Route exact path="/kafka" component={KafkaPage} />
                <Route component={NotFoundPage} />
              </Switch>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
              ONECARD-ADMIN-UI ©2018 Created by 9F.
            </Footer>
          </Layout>
        </Layout>
        <GlobalStyle />
        <Global />
      </div>
    );
  }
}


const mapStateToProps = createStructuredSelector({
  levels: makeSelectAlarmLevels(),
  projects: makeSelectProjectData(),
});

function mapDispatchToProps(dispatch) {
  return {
    loadProjects: () => dispatch(projectActions.loadProjects()),
    loadAlarmLevel: () => dispatch(alarmActions.loadLevel()),
  };
}

export default compose(
  injectSaga({ key: 'kafka', saga: kafkaSaga }),
  injectSaga({ key: 'user', saga: userSaga }),
  injectSaga({ key: 'alarm', saga: alarmSaga }),
  injectSaga({ key: 'project', saga: projectSaga }),
)(withRouter(connect(mapStateToProps, mapDispatchToProps)(MainPage)));

