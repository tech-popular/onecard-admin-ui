import React from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import {
  Form, Button, Col, Row, Input, Select, Icon,
} from 'antd';

import {forEach} from 'lodash';

import PopoverInput from 'components/form/popoverInput';
import { makeSelectRoles, makeSelectUsers, makeSelectDrawerUser, makeSelectProjectData } from 'reducers/selector';
import PropTypes from 'prop-types';

const { Option } = Select;

const AddItemLabel = ({ ...props }) => {
  return (<section className='flex' style={{ justifyContent: 'space-between' }}>
    <span>{props.title}</span>
    <PopoverInput type='default' size='small' {...props} />
  </section>);
};


class _AddForm extends React.PureComponent {
  constructor(props) {
    super(props);
    const { groups, services, projects } = this.props.projectData;
    this.state = {
      groups: groups,
      services: services,
      projects: projects,
    };
  }

  cancel = () => {
    this.props.cancel();
  };

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
      },
    );
  };

  insert = (key, text) => {
    this.setState({ [key]: [text, ...this.state[key]] });
  };


  render() {
    const { roles, form } = this.props;
    const { getFieldDecorator } = form;
    const detailEditable = !!!this.props.drawUser;
    return (
      <section>
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="姓名">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请填写姓名' }],
                })(
                  <Input disabled={!detailEditable} placeholder={'请填写姓名'}
                         prefix={<Icon type={'user'} style={{ color: 'rgba(0,0,0,.25)' }} />} />,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="手机号">
                {getFieldDecorator('mobile', {
                  rules: [{ required: true, message: '请填写手机号' }],
                })(
                  <Input disabled={!detailEditable} placeholder={'请填写手机号'}
                         prefix={<Icon type={'phone'} style={{ color: 'rgba(0,0,0,.25)' }} />} />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="钉钉号">
                {getFieldDecorator('dingding', {
                  rules: [{ required: true, message: '请填写钉钉号' }],
                })(
                  <Input disabled={!detailEditable} placeholder={'请填写钉钉号'}
                         prefix={<Icon type={'dingding'} style={{ color: 'rgba(0,0,0,.25)' }} />} />,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="邮箱地址">
                {getFieldDecorator('email', {
                  rules: [{ required: true, message: '请填写邮箱地址' }],
                })(
                  <Input disabled={!detailEditable} placeholder={'请填写手机号'}
                         prefix={<Icon type={'mail'} style={{ color: 'rgba(0,0,0,.25)' }} />} />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="组名">
                {getFieldDecorator('group', {
                  rules: [{ required: true, message: '请输入组名' }],
                })(
                  <Select showSearch={true} placeholder="请输入组名">
                    {this.state.groups.map(group => <Option key={group} value={group}>{group}</Option>)}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="角色">
                {getFieldDecorator('role', {
                  rules: [{ required: true, message: '请选择角色' }],
                })(
                  <Select showSearch={true} placeholder="请选择角色">
                    {roles.map(role => <Option key={role.id} value={role.id}>{role.name}</Option>)}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={<AddItemLabel inputTitle='输入项目名...' title={'创建项目'}
                                     submit={text => this.insert('projects', text)} />}>
                {getFieldDecorator('project', {
                  rules: [{ required: true, message: '输入项目名' }],
                })(
                  <Select placeholder="请选择项目名">
                    {this.state.projects.map(project => <Option key={project} value={project}>{project}</Option>)}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<AddItemLabel inputTitle='输入服务名...' title={'创建服务'}
                                              submit={text => this.insert('services', text)} />}>
                {getFieldDecorator('service', {
                  rules: [{ required: true, message: '输入服务名' }],
                })(
                  <Select placeholder="请选择服务名" showSearch
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                    {this.state.services.map(item => <Option key={item} value={item}>{item}</Option>)}
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
  projectData: makeSelectProjectData(),
});

const AddForm = Form.create({
  mapPropsToFields(props) {
    if (!props.drawUser) {
      return {};
    }
    const value = {};
    forEach(props.drawUser, (v, k) => {
      value[k] = Form.createFormField({
        value: v,
      });
    });
    return value;
  },
})(_AddForm);

AddForm.propTypes = {
  drawUser: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

export default connect(mapStateToProps, null)(AddForm);

