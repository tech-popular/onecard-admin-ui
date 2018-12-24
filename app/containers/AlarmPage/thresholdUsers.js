import React from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import UserEditorTable from 'components/table/UserEditorTable';
import { Get } from 'utils/client';

class ThresholdUsers extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      'users': [],
    };
  }

  componentDidMount() {
    const userId = this.props.usrId;
    Get(`/alarm/threshold/${userId}/users`).then(users => {
      this.setState({users});
    });

  }

  render() {
    return (
      <section>
        <UserEditorTable users={this.state.users} {...this.props} editable={false} />
      </section>
    );
  }
}


const mapStateToProps = createStructuredSelector({});


ThresholdUsers.propTypes = {
  usrId: PropTypes.number.isRequired,
};

export default connect(mapStateToProps, null)(ThresholdUsers);

