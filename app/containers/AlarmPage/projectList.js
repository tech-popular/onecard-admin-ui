import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { Table, Popover, Input, Button } from "antd";

import { connect } from "react-redux";

import { actions } from "../../reducers/user";

import { createStructuredSelector } from "reselect";
import { makeSelectProjectData } from "../../reducers/selector";
import { ToolBar } from "../../components/toolbar";

const Wrapper = styled.section`
  height: 100%;
`;

class ProjectToolBar extends React.PureComponent {
  render() {
    return <ToolBar style={{ height: 32 }}>
      <span style={{ marginRight: 50 }}><b>项目管理</b></span>
    </ToolBar>;
  }
}

class ProjectList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.projectColumns = [{
      title: "组名",
      width: 100,
      dataIndex: "group",
      key: "group"
    }, {
      title: "项目名",
      width: 100,
      dataIndex: "project",
      key: "project"
    }, {
      title: "服务名",
      width: 200,
      dataIndex: "serviceName",
      key: "serviceName"
    }
    ];
  }

  render() {
    if (!this.props.projects) {
      return <section>暂无项目</section>;
    }
    return (
      <Wrapper>
        <Table
          size="small"
          rowKey="id"
          bordered
          title={() => <ProjectToolBar />}
          columns={this.projectColumns}
          dataSource={this.props.projects}
        />
      </Wrapper>
    );
  }
}


ProjectList.propTypes = {};

const mapStateToProps = createStructuredSelector({
  projects: makeSelectProjectData()
});

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectList);
