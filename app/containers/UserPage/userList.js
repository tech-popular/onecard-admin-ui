import React from 'react';
import PropTypes from 'prop-types';

import { Drawer, Input, Button } from 'antd';

import _ from 'lodash';
import { connect } from 'react-redux';

import { actions } from 'reducers/user';

import { createStructuredSelector } from 'reselect';
import { makeSelectUsers, makeSelectDrawerVisible } from 'reducers/selector';
import UserEditorTable from 'components/table/UserEditorTable';
import UserAddForm from './userAddForm';
import {ToolBar} from 'components/toolbar';

const UserToolBar = ({ addUser, search }) => {
  return (<ToolBar >
    <div>
      <b style={{ marginRight: 50 }}>用户列表</b>
      <Input.Search
        placeholder="搜索用户.."
        onSearch={value => search(value)}
        style={{ width: 200 }}
      />
    </div>
    <div>
      <Button type="primary" shape="circle" icon="plus" onClick={() => addUser()} />
    </div>

  </ToolBar>);
};


class UserList extends React.PureComponent {

  componentDidMount() {
    this.props.load();
  }

  showFormDrawer = (status) => {
    this.props.changeDrawerVisible(status, false);
  };

  addUser = (user) => {
    this.showFormDrawer(false);
    if (_.has(user, 'id') && user.id) {
      this.props.update(user.id, user);
    } else {
      this.props.addUser(user);
    }
  };

  filter = (key) => {
    this.props.load(key);
  };

  render() {
    return (
      <section>
        <UserEditorTable
          {...this.props}
          toolbar={<UserToolBar search={(key) => this.filter(key)} addUser={() => this.showFormDrawer(true)} />} />
        <Drawer
          title="创建用户"
          width={720}
          placement="right"
          onClose={() => this.showFormDrawer(false)}
          maskClosable={true}
          visible={this.props.drawerVisible}
          style={{
            height: 'calc(100% - 55px)',
            overflow: 'auto',
            paddingBottom: 53,
          }}
        >
          <UserAddForm cancel={() => this.showFormDrawer(false)}
                       submit={user => this.addUser(user)} />
        </Drawer>
      </section>);
  }
}

UserList.propTypes = {
  load: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired,
  updateState: PropTypes.func.isRequired,
  addUser: PropTypes.func.isRequired,
  changeDrawerVisible: PropTypes.func.isRequired,
  drawerVisible: PropTypes.bool.isRequired,
  users: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
};

const mapStateToProps = createStructuredSelector({
  users: makeSelectUsers(),
  drawerVisible: makeSelectDrawerVisible(),
});

function mapDispatchToProps(dispatch) {
  return {
    load: (key) => dispatch(actions.load(key)),
    changeDrawerVisible: (visible, user) => dispatch(actions.changeDrawerVisible(visible, user)),
    updateState: id => dispatch(actions.updateState(id)),
    update: (id, data) => dispatch(actions.update(id, data)),
    delete: id => dispatch(actions.delete(id)),
    addUser: user => dispatch(actions.addUser(user)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
