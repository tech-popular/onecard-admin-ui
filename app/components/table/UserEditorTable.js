import React from 'react';
import { Button, Form, Input, InputNumber, Table } from 'antd';
import Circle from '../status/circle';
import _ from 'lodash';
import DeleteBtn from '../button/delete';
import TipButton from '../button';
import UserItemDetail from 'containers/UserPage/userListItem';
import styled from 'styled-components';

const Wrapper = styled.section`
  height: 100%;
`;

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber size='small' />;
    }
    return <Input size='small' />;
  };


  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: true,
                      message: `请输入 ${title}!`,
                    }],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.editable = _.isUndefined(this.props.editable) && true || this.props.editable;
    this.state = { editingKey: '' };
    this.columns = [{
      width: 100,
      align: 'center',
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      editable: true,
      render: (name, record) => {
        return (<span><Circle style={{ 'marginRight': 5 }} enabled={record.enable === 'ENABLED'} />{name}</span>);
      },
    }, {
      align: 'center',
      title: '钉钉',
      dataIndex: 'dingding',
      editable: true,
      key: 'dingding',
    }, {
      align: 'center',
      title: '邮箱地址',
      editable: true,
      dataIndex: 'email',
      key: 'email',
    }, {
      align: 'center',
      title: '手机',
      key: 'mobile',
      dataIndex: 'mobile',
      editable: true,
    }];

    if (this.editable) {
      this.columns.push({
        width: 100,
        align: 'center',
        title: '角色',
        key: 'roles',
        dataIndex: 'roles',
        render: roles => {
          const names = _.uniq(_.map(roles, role => role.role.name));
          return _.join(names, ",");
        }
      });
      this.columns.push({
        align: 'center',
        title: '操作',
        key: 'id',
        width: 150,
        dataIndex: 'id',
        render: (id, record) => {
          if (!this.isEditing(record)) {
            const status = record.enable === 'ENABLED';
            return (<Button.Group>
              <TipButton tip={status ? '禁用' : '启用'} icon={status ? 'close' : 'check'} size='small'
                         onClick={() => this.updateState(id)} />
              <TipButton tip="编辑用户" icon="edit" size='small' onClick={() => this.edit(id)} />
              <DeleteBtn action={() => this.deleteUser(id)} message="确认删除用户?" tip="删除用户" />
            </Button.Group>);
          } else {
            return (<span>
            <EditableContext.Consumer>
              {form => (
                <a
                  href="javascript:;"
                  onClick={() => this.save(form, record.id)}
                  style={{ marginRight: 8 }}
                >
                  确定
                </a>
              )}
            </EditableContext.Consumer>
            <a onClick={() => this.cancel(id)}>取消</a>
          </span>);
          }
        },
      });
    } else {
      this.columns.push({
        width: 100,
        align: 'center',
        title: '角色',
        key: 'roleList',
        dataIndex: 'roleList',
        render: roles => {
          const names = _.map(roles, r => r.name);
          return _.join(names, ', ');
        },
      });
    }
  }

  isEditing = record => record.id === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form, id) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      this.props.update(id, row);
      this.setState({ editingKey: '' });
    });
  }

  edit(id) {
    this.setState({ editingKey: id });
  }

  deleteUser(id) {
    this.props.delete(id);
  }

  updateState(id) {
    this.props.updateState(id);
  }

  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    const { toolbar } = this.props;
    const users = this.props.users || [];
    const expander = user => <UserItemDetail user={user} />;
    const expandedRowRender = this.editable && expander || undefined;
    return (
      <Wrapper>
        <Table
          locale={{ emptyText: '暂无数据' }}
          components={components}
          rowKey="id"
          bordered
          title={() => toolbar || '用户列表'}
          size="small"
          columns={columns}
          dataSource={users}
          expandedRowRender={expandedRowRender}
        />
      </Wrapper>
    );
  }
}

export default EditableTable;
