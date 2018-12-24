import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { Table, Button } from 'antd';
import { connect } from 'react-redux';

import { actions } from 'reducers/user';
import { compose } from 'redux';
import DeleteBtn from 'components/button/delete';

const Wrapper = styled.section`
  padding: 5px;
  position: relative;
  height: 100%;
`;



class UserItemDetail extends React.PureComponent {
  constructor(props) {
    super(props);
    this.userItemColumns = [{
      align: 'center',
      width: 100,
      title: '组名',
      dataIndex: 'group',
      key: 'group',
    }, {
      width: 200,
      align: 'center',
      title: '项目名',
      dataIndex: 'project',
      key: 'project',
    }, {
      width: 200,
      align: 'center',
      title: '服务名',
      dataIndex: 'service',
      key: 'service',
    }, {
      width: 150,
      align: 'center',
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: role => role.name,
    }, {
      align: 'center',
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <DeleteBtn tip="删除用户角色" action={() => this.deleteRole(id)} message={'确认删除角色？'} />,
    }];
  }

  deleteRole = id => {
    this.props.deleteUserRole(id);
  };

  viewDrawer = () => {
    this.props.showUserDrawer(this.props.user);
  };

  render() {
    const user = this.props.user || [];

    return (
      <Wrapper>
        <Button onClick={() => this.viewDrawer()} style={{ position: 'absolute', left: -50}}
                size={'small'} icon={'plus'} type={'primary'}/>
        <Table
          rowKey="id"
          pagination={false}
          scroll={{ y: 300 }}
          size="small"
          locale={{ emptyText: '暂无数据' }}
          columns={this.userItemColumns}
          dataSource={user.roles}
        />
      </Wrapper>
    );
  }
}

UserItemDetail.propTypes = {
  user: PropTypes.object.isRequired,
  deleteUserRole: PropTypes.func.isRequired,
  showUserDrawer: PropTypes.func.isRequired,
};


const withConnect = connect(
  null,
  mapDispatchToProps,
);


function mapDispatchToProps(dispatch) {
  return {
    deleteUserRole: id => dispatch(actions.deleteUserRole(id)),
    showUserDrawer: user => dispatch(actions.changeDrawerVisible(true, user)),
  };
}

export default compose(withConnect)(UserItemDetail);
