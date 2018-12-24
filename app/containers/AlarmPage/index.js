import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectAlarmThreshold, makeSelectRoles } from 'reducers/selector';

import { actions } from 'reducers/alarm';

import ThresholdList from './thresholdList';
import { Col, Row } from 'antd';
import LevelMappingList from './levelMappingList';

export class Alarm extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.load();
  }

  load(text){
    this.props.load(text);
  }

  render() {
    const thresholds = this.props.thresholds;

    if (thresholds !== false) {
      return (<section>
        <Row gutter={8}>
          <Col span={16}>
            <ThresholdList load={text=>this.load(text)} thresholds={thresholds} />
          </Col>
          <Col span={8}>
            <LevelMappingList />
          </Col>
        </Row>
      </section>);
    } else {
      return <h1>加载中...</h1>;
    }

  }
}

Alarm.propTypes = {
  load: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  thresholds: makeSelectAlarmThreshold(),
});

function mapDispatchToProps(dispatch) {
  return {
    load: (text) => dispatch(actions.loadThreshold(text)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Alarm);
