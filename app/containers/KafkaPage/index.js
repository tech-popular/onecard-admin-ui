import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { Layout } from 'antd';

import { makeSelectCurrent } from 'reducers/selector';


import KafkaRegisterList from './kafkaRegisterList';

import KafkaViewInfo from './kafkaViewInfo';

const { Content, Sider } = Layout;

/* eslint-disable react/prefer-stateless-function */
class Kafka extends React.PureComponent {
  componentDidMount() {
  }

  render() {
    return (
      <Layout style={{ padding: '24px 0', background: '#fff' }}>
        <Sider width={200} style={{ background: '#fff' }}>
          <KafkaRegisterList />
        </Sider>
        <Content style={{ padding: '0 24px', minHeight: 280 }}>
          <KafkaViewInfo kafkaRegister={this.props.kafkaRegister} />
        </Content>
      </Layout>
    );
  }
}

Kafka.propTypes = {
  kafkaRegister: PropTypes.any.isRequired,
};

const mapStateToProps = createStructuredSelector({
  kafkaRegister: makeSelectCurrent(),
});

function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Kafka);
