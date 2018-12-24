import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { Table, Popover, Icon, Input, Button, Drawer } from 'antd';

import { connect } from 'react-redux';
import { actions } from 'reducers/alarm';

import { createStructuredSelector } from 'reselect';
import { makeSelectAlarmThreshold, makeSelectProjectData } from 'reducers/selector';
import ThresholdAddForm from './thresholdAddForm';
import DeleteBtn from 'components/button/delete';
import TooltipButton from 'components/button';

import ThresholdUser from './thresholdUsers';

import { ToolBar } from 'components/toolbar';

const Wrapper = styled.section`
  height: 100%;
`;


const ThresholdToolBar = ({ openDrawer, search }) => {
  return (<ToolBar>
    <div>
      <span style={{ marginRight: 50 }}><b>阈值管理</b></span>
      <Input.Search
        placeholder="关键字搜索.."
        onSearch={value => search(value)}
        style={{ width: 200 }}
      />
    </div>
    <Button type="primary" shape="circle" icon="plus" onClick={() => openDrawer()} />
  </ToolBar>);
};


class ThresholdList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      'drawerVisible': false,
      'drawerThreshold': false,
    };

    if (!this.props.thresholds || !this.props.projectData.groups) {
      return;
    }
    const _serviceTypes = new Set();
    this.props.thresholds.forEach(item => {
      _serviceTypes.add(item.serviceType);
    });
    this.serviceTypes = [..._serviceTypes];

    const { groups, services, projects } = this.props.projectData;
    this.groups = groups;
    this.services = services;
    this.projects = projects;

    this.thresholdColumns = [{
      title: '组名',
      width: 100,
      dataIndex: 'group',
      key: 'group',
      filters: this.groups.map(item => {
        return { text: item, value: item };
      }),
      onFilter: (value, record) => {
        return record.group.indexOf(value) === 0;
      },
    },
      {
        title: '项目名',
        width: 100,
        dataIndex: 'project',
        key: 'project',
        filters: this.projects.map(project => {
          return { text: project, value: project };
        }),
        onFilter: (value, record) => {
          return record.project.indexOf(value) === 0;
        },
      },
      {
        title: '服务名',
        width: 150,
        dataIndex: 'serviceName',
        key: 'serviceName',
      },
      {
        title: '服务类型',
        width: 100,
        dataIndex: 'serviceType',
        key: 'serviceType',
        filters: this.serviceTypes.map(item => {
          return { text: item, value: item };
        }),
        onFilter: (value, record) => {
          return record.serviceType.indexOf(value) === 0;
        },
      },
      {
        title: '告警等级',
        dataIndex: 'level',
        width: 80,
        key: 'level',
      },
      {
        title: '阈值',
        width: 60,
        dataIndex: 'value',
        key: 'value',
      },
      {
        title: '操作',
        dataIndex: 'id',
        key: 'id',
        width: 100,
        render: (id, record) =>
          <Button.Group>
            <TooltipButton tip={'复制并添加记录'} size={'small'} onClick={() => this.duplicate(record)} icon={'file-add'} />
            <Popover content={<ThresholdUser usrId={id} />} title="通知用户范围" trigger="click">
              <TooltipButton tip={'通知用户范围'} size={'small'} icon={'team'} />
            </Popover>
            <DeleteBtn tip="删除记录" action={() => this.deleteThreshold(id)} message={'确认删除记录？'} />
          </Button.Group>,
      }];
  }

  search(text) {
    this.props.load(text);
  }

  duplicate(data) {
    this.setState({ 'drawerThreshold': data }, () => {
      this.openFormDrawer(true);
    });
  }

  addThreshold(threshold) {
    this.props.addThreshold(threshold);
    this.openFormDrawer(false);
  }

  deleteThreshold(id) {
    this.props.deleteThreshold(id);
  }

  addEmptyThreshold() {
    this.setState({ 'drawerThreshold': false });
    this.openFormDrawer(true);
  }

  openFormDrawer(status) {
    this.setState({ 'drawerVisible': status });
  }

  render() {
    if (!this.props.thresholds || !this.props.projectData.groups) {
      return <h1>加载中...</h1>;
    }
    const thresholds = this.props.thresholds || [];
    return (
      <Wrapper>
        <Table
          size="small"
          rowKey="id"
          bordered
          title={() => <ThresholdToolBar search={text => this.search(text)}
                                         openDrawer={() => this.addEmptyThreshold(true)} />}
          columns={this.thresholdColumns}
          dataSource={thresholds}
        />
        <Drawer
          title="创建阈值"
          width={500}
          placement="right"
          onClose={() => this.openFormDrawer(false)}
          maskClosable={true}
          visible={this.state.drawerVisible}
          style={{
            height: 'calc(100% - 55px)',
            overflow: 'auto',
            paddingBottom: 53,
          }}
        >
          <ThresholdAddForm
            projects={this.projects}
            serviceTypes={this.serviceTypes}
            services={this.services}
            threshold={this.state.drawerThreshold}
            groups={this.groups}
            cancel={() => this.openFormDrawer(false)}
            submit={data => this.addThreshold(data)} />
        </Drawer>
      </Wrapper>
    );
  }
}


ThresholdList.propTypes = {
  thresholds: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  load: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  thresholds: makeSelectAlarmThreshold(),
  projectData: makeSelectProjectData(),
});

function mapDispatchToProps(dispatch) {
  return {
    addThreshold: data => dispatch(actions.addThreshold(data)),
    deleteThreshold: data => dispatch(actions.deleteThreshold(data)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ThresholdList);
