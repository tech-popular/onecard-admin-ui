import React from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";

import {
  Form, Button, Col, Row, Input, Select, Icon, Modal,
  Steps, message
} from "antd";

import AddForm from "./addForm";


class TaskAddFormContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.steps = [{
      title: "创建任务",
      content: <AddForm />
    }, {
      title: "执行SQL",
      content: "Second-content"
    }, {
      title: "Last",
      content: "Last-content"
    }];
    this.state = { current: 0 };
  }

  next() {
    const current = this.state.step + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state.step - 1;
    this.setState({ current });
  }

  render() {
    const { current } = this.state;
    return (
      <section>
        <Steps current={current}>
          {this.steps.map(item => <Steps.Step key={item.title} title={item.title} />)}
        </Steps>
        <div className="steps-content">{this.steps[current].content}</div>
        <div className="steps-action">
          {
            current < this.steps.length - 1
            && <Button type="primary" onClick={() => this.next()}>下一步</Button>
          }
          {
            current === this.steps.length - 1
            && <Button type="primary" onClick={() => message.success("Processing complete!")}>Done</Button>
          }
          {
            current > 0
            && (
              <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                上一步
              </Button>
            )
          }
        </div>
      </section>
    );
  }
}

const mapStateToProps = createStructuredSelector({});

export default connect(mapStateToProps, null)(TaskAddFormContainer);

