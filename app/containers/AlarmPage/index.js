import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';


import ProjectList from './projectList';
import TaskList from './task/taskList';
import { Col, Row } from 'antd';

export class Alarm extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }


  render() {
    const thresholds = this.props.thresholds;

    if (thresholds !== false) {
      return (<section>
        <Row gutter={4}>
          <Col span={24}>
            <TaskList/>
          </Col>
        </Row>
      </section>);
    } else {
      return <h1>加载中...</h1>;
    }

  }
}

Alarm.propTypes = {
};

const mapStateToProps = createStructuredSelector({
});

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Alarm);
