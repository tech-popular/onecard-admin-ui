import React from 'react';

import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router/immutable';
import { makeSelectLocation } from 'reducers/selector';
import { createStructuredSelector } from 'reselect';
import { Layout, Menu, Icon } from 'antd';

import KafkaSvg from './icon/kafka-icon';
import AlertSvg from './icon/alert-icon';

/* eslint-disable react/prefer-stateless-function */
class _Sider extends React.PureComponent {
  state = {
    collapsed: false,
  };

  constructor(props) {
    super(props);
    this.props = props;
  }

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  switchTo = page => {
    this.props.switchToPage(page);
  };

  render() {
    const current = this.props.location.pathname.replace('/', '');
    if(!current){
      return "<h1>加载中...</h1>";
    }
    return (
      <Layout.Sider
        collapsible
        collapsed={this.state.collapsed}
        onCollapse={this.onCollapse}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}
      >
        <div className="logo">ONECARD@9F</div>
        <Menu theme="dark"
              mode="inline"
              defaultSelectedKeys={[current]}
        >
          <Menu.Item key="home" onClick={() => this.switchTo('home')}>
            <Icon type="home" />
            <span className="nav-text">管理平台</span>
          </Menu.Item>
          <Menu.Item key="user" onClick={() => this.switchTo('user')}>
            <Icon type="user" />
            <span className="nav-text">用户管理</span>
          </Menu.Item>
          <Menu.Item key="alarm" onClick={() => this.switchTo('alarm')}>
            <Icon component={AlertSvg} />
            <span className="nav-text">告警管理</span>
          </Menu.Item>
          {/*<Menu.Item key="kafka" onClick={() => this.switchTo('kafka')}>*/}
            {/*<Icon component={KafkaSvg} />*/}
            {/*<span className="nav-text">Kafka管理</span>*/}
          {/*</Menu.Item>*/}
        </Menu>
      </Layout.Sider>
    );
  }
}

_Sider.propTypes = {
  switchToPage: PropTypes.func,
  location: PropTypes.object.isRequired,
};

export function mapDispatchToProps(dispatch) {
  return {
    switchToPage: path => dispatch(push(path)),
  };
}

const mapStateToProps = createStructuredSelector({
  location: makeSelectLocation(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(_Sider);
