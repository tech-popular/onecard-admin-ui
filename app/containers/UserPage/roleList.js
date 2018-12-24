import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { Table, Popover, Input, Button } from 'antd';

import { connect } from 'react-redux';

import { actions } from 'reducers/user';

import { createStructuredSelector } from 'reselect';
import { makeSelectRoles } from 'reducers/selector';
import DeleteBtn from '../../components/button/delete';

import PopoverInput from 'components/form/popoverInput';
import TipButton from '../../components/button';

const Wrapper = styled.section`
  height: 100%;
`;

const Flex = styled.section`
  display: flex;
  align-items: center;
`;

class ToolBar extends React.PureComponent {
  render() {
    return <Flex>
      <span style={{ marginRight: 50 }}><b>角色管理</b></span>
      <PopoverInput submit={text => this.props.addRole(text)} title={'添加角色'} inputTitle={'角色名称'} />
    </Flex>;
  }
}

class RoleList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.roleColumns = [{
      title: '角色名称',
      width: 150,
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '状态',
      width: 60,
      dataIndex: 'enable',
      key: 'state',
      render: state => state === 'ENABLED' ? '启用' : '禁用',
    }
    /*, {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      render: (id, record) => <TipButton tip={record.enable === 'ENABLED'? '禁用' : '启用'}
                                         icon={record.enable === 'ENABLED' ? 'close' : 'check'}
                                         size='small'
                                          onClick={() => this.updateState(id)} />,
    }*/];
  }

  componentDidMount() {
    this.props.load();
  }

  updateState(id) {
    this.props.updateState(id);
  }

  render() {
    if (!this.props.roles) {
      return <section>暂无角色</section>;
    }
    return (
      <Wrapper>
        <Table
          size="small"
          rowKey="id"
          bordered
          title={() => <ToolBar addRole={name => this.props.addRole(name)} />}
          pagination={false}
          columns={this.roleColumns}
          dataSource={this.props.roles}
        />
      </Wrapper>
    );
  }
}


RoleList.propTypes = {
  load: PropTypes.func.isRequired,
  addRole: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  roles: makeSelectRoles(),
});

function mapDispatchToProps(dispatch) {
  return {
    load: () => dispatch(actions.loadRoles()),
    addRole: name => dispatch(actions.addRole(name)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RoleList);
