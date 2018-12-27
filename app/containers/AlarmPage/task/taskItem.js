import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { Table, Tooltip, Popover, Tabs, Collapse } from "antd";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";

import { makeSelectAlarmLevels } from "../../../reducers/selector";

import UserList from "../../../components/table/UserEditorTable";

import { isEmpty, truncate } from "lodash";
import { Get } from "../../../utils/client";

const Panel = Collapse.Panel;

const Wrapper = styled.section`
  padding: 5px;
  position: relative;
  height: 100%;
`;


const PipeLineList = ({ pipelines }) => {
  const pipeLineColumns = [{
    align: "center",
    width: 100,
    title: "管道名称",
    dataIndex: "name"
  }, {
    width: 100,
    align: "center",
    title: "渠道",
    dataIndex: "channel"
  }, {
    width: 400,
    align: "center",
    title: "值",
    dataIndex: "value",
    render: value => {
      return <Tooltip title={value}>{truncate(value, 30)}</Tooltip>;
    }
  }, {
    width: 100,
    align: "center",
    title: "模板名称",
    dataIndex: "template.name"
  }, {
    width: 100,
    align: "center",
    title: "模板内容",
    dataIndex: "pipeline.template.template",
    render: data =>
      <Popover content={data} title="表达式" trigger="click">
        <a>显示</a>
      </Popover>
  }];

  return <Table
    style={{ marginTop: 10 }}
    rowKey="id"
    pagination={false}
    scroll={{ y: 300 }}
    size="small"
    title={() => "管道信息"}
    locale={{ emptyText: "暂无数据" }}
    columns={pipeLineColumns}
    dataSource={pipelines}
  />;
};

class Detail extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { "data": { "users": [], "pipelines": [] } };
  }

  componentDidMount() {
    const { level, taskId } = this.props;
    Get(`/alarm/task/${taskId}/level/${level}`).then(data => {
      this.setState({ data });
    });
  }

  render() {
    const { users, pipelines, threshold } = this.state.data;
    if (isEmpty(users) && isEmpty(pipelines)) {
      return <h1 style={{ textAlign: "center", minHeight: 300 }}>暂无数据.....</h1>;
    }

    return (
      <section>
        <div style={{ padding: 15 }}><label>表达式</label>: <b>{threshold.expression}</b></div>
        <UserList users={users} editable={false} />
        <PipeLineList pipelines={pipelines} />
      </section>
    );
  }
}


class TaskItemDetail extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pipelines: []
    };
  }

  deleteRole = id => {
    this.props.deleteUserRole(id);
  };

  viewDrawer = () => {
    this.props.showUserDrawer(this.props.user);
  };

  load = () => {
    Get(`/alarm/task/${this.props.taskId}/pipeline`).then(pipelines => {
      this.setState({ pipelines });
    });
  };

  componentDidMount() {
    this.load();
  }

  render() {
    const { levels, taskId } = this.props;
    return (
      <Wrapper>
        <Tabs>
          {levels.map(level =>
            <Tabs.TabPane tab={`级别${level}`} key={level}><Detail level={level} taskId={taskId} /></Tabs.TabPane>
          )}
        </Tabs>

      </Wrapper>
    );
  }
}

TaskItemDetail.propTypes = {
  taskId: PropTypes.number.isRequired,
  levels: PropTypes.array.isRequired
};


const mapStateToProps = createStructuredSelector({
  levels: makeSelectAlarmLevels()
});


function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskItemDetail);
