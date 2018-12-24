import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { List, Card, Button } from 'antd';

import _ from 'lodash';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { actions } from 'reducers/kafka';

import { createStructuredSelector } from 'reselect';
import { makeSelectRegistrations } from 'reducers/selector';

import Circle from 'components/status/circle';

import PopoverInput from 'components/form/popoverInput'
import './kafka.less';


const Wrapper = styled.section`
  padding: 5px;
  height: 100%;
`;


const EmptyList = () => {
  return (<h1>No kakfa register</h1>);
};

class KafkaRegisterList extends React.PureComponent {
  componentDidMount() {
    this.props.load();
  }

  view(register) {
    this.props.view(register);
  }

  render() {
    const empty = !this.props.registrations || _.isEmpty(this.props.registrations);

    return (
      <Wrapper>
        <Card
          className="kafka-list-card"
          title="注册列表"
          extra={
            <PopoverInput submit={text => this.props.addRole(text)} title={'注册Kafka'} inputTitle={'角色名称'} />
          }
        >
          {empty && <EmptyList /> ||
          <List
            className="listItemHoverColor"
            itemLayout="horizontal"
            dataSource={this.props.registrations}
            renderItem={register =>
              <List.Item className="kafka-select-link">
                <List.Item.Meta
                  avatar={<Circle enabled={register.status === 'ENABLED'} />}
                  title={register.name}
                  description={`${register.zookeeperAddress}:${register.zookeeperPort}`}
                />
              </List.Item>
            }
          />
          }
        </Card>

      </Wrapper>

    );
  }
}

KafkaRegisterList.propTypes = {
  load: PropTypes.func.isRequired,
  view: PropTypes.func.isRequired,
  registrations: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
};

const mapStateToProps = createStructuredSelector({
  registrations: makeSelectRegistrations(),
});

function mapDispatchToProps(dispatch) {
  return {
    load: () => dispatch(actions.load()),
    view: register => dispatch(actions.view(register)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

// const withReducer = injectReducer({ key: 'kafka', reducer });
export default compose(withConnect)(KafkaRegisterList);
