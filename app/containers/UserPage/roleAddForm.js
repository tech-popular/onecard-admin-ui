import React from 'react';
import { Button, Input } from 'antd';
import styled from 'styled-components';


const Flex = styled.section`
  display: flex;
`;


class RoleAddForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { value: '' };
  }


  submit() {
    this.props.addRole(this.state.value);
  }

  changeValue(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    return (<Flex>
      <Input placeholder="角色名称" value={this.state.value} onChange={e => this.changeValue(e)} style={{marginRight: 10}} />
      <Button type="primary" onClick={() => this.submit()}>提交</Button>
    </Flex>);
  }
}

export default RoleAddForm;
