import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Row, Col } from 'antd';

import UserList from './userList';
import RoleList from './roleList';

export class User extends React.PureComponent {
  render() {
    return (
      <section>
        <Row gutter={8}>
          <Col span={18}>
            <UserList />
          </Col>
          <Col span={6}>
            <Row style={{height: 800}}>
              <RoleList />
            </Row>
            <Row>

            </Row>
          </Col>
        </Row>
      </section>
    );
  }
}

User.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(User);
