import React, { PropTypes } from 'react';
import { viewUser } from 'actions';
import ReduxUserSummary from 'containers/fe/ReduxUserSummary.jsx';

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    const idCard = this.props.params.idCard;
    this.state = {
      card: {
        id: idCard,
      },
    };
  }

  render() {
    return (
      <div>
        <ReduxUserSummary />
      </div>
    );
  }
}

UserProfile.propTypes = {
  params: PropTypes.object.isRequired,
};

function onEnterUserProfile(store, nextState) {
  store.dispatch(viewUser(nextState.params.idUser));
}

export { UserProfile, onEnterUserProfile };
