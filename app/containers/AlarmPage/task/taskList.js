import React from "react";
import styled from "styled-components";

import { Table, Popover, Modal, Button } from "antd";

import { connect } from "react-redux";

import { actions } from "reducers/alarm";

import { makeSelectAlarmTask, makeSelectProjectData } from "reducers/selector";
import { createStructuredSelector } from "reselect";
import { ToolBar } from "components/toolbar";
import TaskDetail from "./taskItem";
import TaskAddFormContainer from "./taskAddFormContainer";

const Wrapper = styled.section`
  height: 100%;
`;

const TaskToolBar = ({ add }) => {
  return <ToolBar style={{ height: 32 }}>
    <span style={{ marginRight: 50 }}><b>告警管理</b></span>
    <Button type="primary" shape="circle" icon="plus" onClick={add} />
  </ToolBar>;
};

class TaskList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.taskColumns = [{
      title: "名称",
      width: 100,
      dataIndex: "name",
      key: "name"
    }, {
      title: "标签",
      width: 100,
      dataIndex: "tags",
      key: "tags"
    }, {
      title: "数据源",
      width: 100,
      dataIndex: "datasource"
    }, {
      title: "计算方式",
      width: 100,
      dataIndex: "computeType",
      key: "computeType"
    }, {
      title: "TOPIC",
      width: 100,
      dataIndex: "topic",
      key: "topic"
    }, {
      title: "SQL",
      width: 100,
      dataIndex: "sql",
      key: "sql",
      render: data =>
        <Popover content={data} title="SQL" trigger="click">
          <a>查看</a>
        </Popover>
    }, {
      title: "缓存SQL",
      width: 100,
      dataIndex: "cacheSql",
      key: "cacheSql",
      render: data =>
        <Popover content={data} title="缓存SQL" trigger="click">
          <a>查看</a>
        </Popover>
    }, {
      title: "频率",
      width: 60,
      dataIndex: "howOften",
      key: "howOften"
    }, {
      title: "项目",
      width: 100,
      dataIndex: "project.serviceName"
    }
    ];
    this.state = { addFormVisible: false };
  }

  add() {
    this.setState({ addFormVisible: true });
  }

  handleCancel() {
    this.setState({ addFormVisible: false });
  }

  componentDidMount() {
    this.props.loadTask();
  }

  render() {
    const task = this.props.tasks || [];
    return (
      <Wrapper>
        <Table
          size="small"
          rowKey="id"
          bordered
          title={() => <TaskToolBar add={() => this.add()} />}
          columns={this.taskColumns}
          dataSource={task}
          expandedRowRender={task => <TaskDetail taskId={task.id} />}
        />
        <Modal
          visible={this.state.addFormVisible}
          title="添加任务"
          onCancel={() => this.handleCancel()}
          footer={null}
        >
          <TaskAddFormContainer />
        </Modal>
      </Wrapper>
    );
  }
}


const mapStateToProps = createStructuredSelector({
  projects: makeSelectProjectData(),
  tasks: makeSelectAlarmTask()
});

function mapDispatchToProps(dispatch) {
  return {
    loadTask: () => dispatch(actions.loadTask())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);
