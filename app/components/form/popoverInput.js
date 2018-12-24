import React from 'react';
import { Button, Input, Popover } from 'antd';
import PropTypes from 'prop-types';
import { message } from 'antd';

class Form extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { value: '' };
  }


  submit() {
    this.props.submit(this.state.value);
    this.setState({ value: '' });
  }

  changeValue(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    return (<section className='flex'>
      <Input placeholder={this.props.title} value={this.state.value} onChange={e => this.changeValue(e)}
             style={{ marginRight: 10 }} />
      <Button type="primary" onClick={() => this.submit()}>提交</Button>
    </section>);
  }
}

class PopoverInput extends React.PureComponent {
  state = {
    visible: false,
  };

  submit = (text) => {
    this.props.submit(text);
    this.setState({ visible: false }, () => {
      message.success(`${this.props.title}, ${text}`);
    });
  };

  handleVisibleChange = (visible) => {
    this.setState({ visible });
  };

  render() {
    const { title, inputTitle, type = 'primary', size = 'default',
      form = <Form title={inputTitle} submit={text => this.submit(text)} />} = this.props;
    return <section>
      <Popover content={form}
               placement="top"
               title={title}
               visible={this.state.visible}
               onVisibleChange={this.handleVisibleChange}
               trigger="click">
        <Button type={type} size={size} shape="circle" icon="plus" />
      </Popover>
    </section>;
  }
}

PopoverInput.propTypes = {
  submit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  inputTitle: PropTypes.string.isRequired,
};

export default PopoverInput;
