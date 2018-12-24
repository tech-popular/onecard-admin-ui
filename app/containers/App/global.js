import React from 'react';

import { message as call } from 'antd';

import connect from 'react-redux/es/connect/connect';
import { actions } from 'reducers/global';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';

import { makeNotifyMessage } from 'reducers/selector';


const Wrapper = styled.section`
  padding: 5px;
  height: 100%;
`;

class Global extends React.PureComponent {
  componentDidUpdate(){
    if (this.props.msg) {
      const { type, content } = this.props.msg;

      call[type](content, 2).then(() => {
        this.props.clean();
      });
    }
  }
  render() {
    return (<div />);
  }
}

function mapDispatchToProps(dispatch) {
  return {
    clean: () => dispatch(actions.cleanMessage()),
  };
}


const mapStateToProps = createStructuredSelector({
  msg: makeNotifyMessage(),
});


export default connect(mapStateToProps, mapDispatchToProps)(Global);

