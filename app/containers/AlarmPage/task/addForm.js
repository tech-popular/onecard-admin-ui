import React from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import {
  Form, Button, Col, Row, Input, Select, InputNumber
} from "antd";

import { forEach } from "lodash";

import { makeSelectRoles, makeSelectUsers, makeSelectDrawerUser, makeSelectProjectData } from "reducers/selector";
import PropTypes from "prop-types";

const { Option } = Select;


class _AddForm extends React.PureComponent {
  constructor(props) {
    super(props);
    const _services = new Set();
    this.props.projectData.forEach(item => {
      _services.add(item.serviceName);
    });
    this.services = [..._services];
  }

  submit = () => {
    this.props.form.validateFields((err) => {
        if (!err) {
          const newUser = this.props.form.getFieldsValue();
          if (this.props.drawUser.id) {
            newUser.id = this.props.drawUser.id;
          }
          this.props.submit(newUser);
          this.props.form.resetFields();
        }
      }
    );
  };

  input(label, key, isNumber = false) {
    const getFieldDecorator = this.props.form.getFieldDecorator;
    const warnText = `请填写${label}`;
    return (<Form.Item label={label}>
      {getFieldDecorator(key, {
        rules: [{ required: true, message: warnText }]
      })(
        isNumber && <InputNumber placeholder={warnText} />  || <Input placeholder={warnText} />

      )}
    </Form.Item>);
  }

  select(label, key, options) {
    const getFieldDecorator = this.props.form.getFieldDecorator;
    const warnText = `请选择${label}`;

    const defaultValue = options[0];
    return (<Form.Item label={label}>
      {getFieldDecorator(key, {
        rules: [{ required: true, message: warnText }]
      })(
        <Select showSearch
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                style={{ width: 120 }}
        >
          {options.map(opt => <Option value={opt}>{opt}</Option>)}
        </Select>
      )}
    </Form.Item>);
  }

  // private String cacheSql;
  // private String sql;
  //
  // private Integer ;
  // private Long projectId;
  // private List <Long> pipelineIds;
  render() {
    return (
      <section>
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={16}>
            <Col span={12}>
              {this.input("告警名称", "name")}
            </Col>
            <Col span={12}>
              {this.input("标签", "tags")}
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              {this.input("TOPIC", "topic")}
            </Col>
            <Col span={12}>
              {this.select("计算类型", "computeType", ["SIMPLE", "MIX"])}
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              {this.select("数据类型", "dataType", ["METRIC", "ZIPKIN"])}
            </Col>
            <Col span={12}>
              {this.select("数据源", "dataSource", ["KAFKA"])}
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              {this.select("项目", "projectId", this.services)}
            </Col>
            <Col span={12}>
              {this.input("频率", "howOften", true)}
            </Col>
          </Row>
        </Form>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            borderTop: "1px solid #e8e8e8",
            padding: "10px 16px",
            textAlign: "right",
            left: 0,
            background: "#fff",
            borderRadius: "0 0 4px 4px"
          }}
        >
          <Button style={{ marginRight: 8 }} onClick={this.cancel}>
            取消
          </Button>
          <Button onClick={this.submit} type="primary">提交</Button>
        </div>
      </section>
    );
  }
}


const mapStateToProps = createStructuredSelector({
  roles: makeSelectRoles(),
  users: makeSelectUsers(),
  drawUser: makeSelectDrawerUser(),
  projectData: makeSelectProjectData()
});

const AddForm = Form.create({
  mapPropsToFields(props) {
    if (!props.drawUser) {
      return {};
    }
    const value = {};
    forEach(props.drawUser, (v, k) => {
      value[k] = Form.createFormField({
        value: v
      });
    });
    return value;
  }
})(_AddForm);

AddForm.propTypes = {
  drawUser: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
};

export default connect(mapStateToProps, null)(AddForm);

