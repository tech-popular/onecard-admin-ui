import React from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import {
  Form, Button, Col, Row, Input, Select, Icon,
} from 'antd';
import {forEach} from 'lodash';
import PropTypes from 'prop-types';
import NumberInput from 'components/form/numberInput';

const { Option } = Select;


class _AddForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.levels = [1, 2, 3];
  }

  cancel() {
    this.props.cancel();
  };

  submit() {
    this.props.form.validateFields((err) => {
        if (!err) {
          const newThreshold = this.props.form.getFieldsValue();
          this.props.submit(newThreshold);
          this.props.form.resetFields();
        }
      },
    );
  };

  render() {
    const { projects, services, serviceTypes, groups, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <section>
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label='服务名'>
                {getFieldDecorator('serviceName', {
                  rules: [{ required: true, message: '选择服务名' }],
                })(
                  <Select placeholder="请选择服务名"  showSearch
                          filterOption={(input, option) => option.props && option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 }>
                    {services.map(item => <Option key={item} value={item}>{item}</Option>)}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='服务类型'>
                {getFieldDecorator('serviceType', {
                  rules: [{ required: true, message: '选择服务类型' }],
                })(
                  <Select placeholder="请选择服务名" showSearch
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {serviceTypes.map(item => <Option key={item} value={item}>{item}</Option>)}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label='项目名'>
                {getFieldDecorator('project', {
                  rules: [{ required: true, message: '选择项目名' }],
                })(
                  <Select placeholder="请选择项目名">
                    {projects.map(project => <Option key={project} value={project}>{project}</Option>)}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="组名">
                {getFieldDecorator('group', {
                  rules: [{ required: true, message: '请选择组名' }],
                })(
                  <Select showSearch={true} placeholder="请输入组名">
                    {groups.map(group => <Option key={group} value={group}>{group}</Option>)}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="阈值">
                {getFieldDecorator('value', {
                  rules: [{ required: true, message: '请填写阈值' }],
                })(
                  <NumberInput />,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="等级">
                {getFieldDecorator('level', {
                  rules: [{ required: true, message: '请选择级别' }],
                })(
                  <Select showSearch={true} placeholder="请选择级别">
                    {this.levels.map(item => <Option key={item} value={item}>{item}</Option>)}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e8e8e8',
            padding: '10px 16px',
            textAlign: 'right',
            left: 0,
            background: '#fff',
            borderRadius: '0 0 4px 4px',
          }}
        >
          <Button style={{ marginRight: 8 }} onClick={() => this.cancel()}>
            取消
          </Button>
          <Button onClick={() => this.submit()} type="primary">提交</Button>
        </div>
      </section>
    );
  }
}


const mapStateToProps = createStructuredSelector({});


const AddForm = Form.create({
  mapPropsToFields(props) {
    if (!props.threshold) {
      return {};
    }
    const value = {};
    forEach(props.threshold, (v, k) => {
      value[k] = Form.createFormField({
        value: v,
      });
    });
    return value;
  },
})(_AddForm);

AddForm.propTypes = {
  groups: PropTypes.array.isRequired,
  threshold: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  serviceTypes: PropTypes.array.isRequired,
  services: PropTypes.array.isRequired,
  projects: PropTypes.array.isRequired,
};

export default connect(mapStateToProps, null)(AddForm);

