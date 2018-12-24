import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import _ from 'lodash';
import { Table, Tag } from 'antd';

import { connect } from 'react-redux';

import { actions } from 'reducers/alarm';

import { createStructuredSelector } from 'reselect';
import { makeSelectLevelMappings, makeSelectRoles } from 'reducers/selector';

const Wrapper = styled.section`
  height: 100%;
`;

const colors = ['purple', 'magenta', '#108ee9', 'red', 'lime', 'volcano', 'green', 'gold', 'orange', 'cyan', 'blue', 'geekblue', 'yellow'];

class LevelMappingList extends React.PureComponent {
  constructor(props) {
    super(props);

    const roleMapping = {};
    _.forEach(this.props.roles, (role, index) => {
      roleMapping[role.id] = colors[index];
    });

    this.levelMappingColumns = [{
      title: '等级',
      width: 10,
      align: 'center',
      dataIndex: 'level',
      key: 'level',
    }, {
      title: '等级角色',
      width: 100,
      align: 'center',
      dataIndex: 'roles',
      key: 'roles',
      render: roles => roles.map(role => <Tag key={role.id} color={roleMapping[role.id]}>{role.name}</Tag>),
    }, {
      title: '等级渠道',
      align: 'center',
      width: 50,
      dataIndex: 'channels',
      key: 'channels',
      render: channels => _.map(channels, (channel, index) => {
        return channel && <Tag key={index} color={colors[index]}>{channel.name}</Tag> || '';
      }),
    },
    ];
  }

  componentDidMount() {
    this.props.loadLevelMapping();
  }

  render() {
    const mappings = this.props.levelMappings || [];
    return (
      <Wrapper>
        <Table
          size="small"
          rowKey='level'
          bordered
          title={() => <b>等级映射表</b>}
          pagination={false}
          columns={this.levelMappingColumns}
          dataSource={mappings}
        />
      </Wrapper>
    );
  }
}


const mapStateToProps = createStructuredSelector({
  levelMappings: makeSelectLevelMappings(),
  roles: makeSelectRoles(),
});

function mapDispatchToProps(dispatch) {
  return {
    loadLevelMapping: () => dispatch(actions.loadLevelMapping()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LevelMappingList);
