import React, { PropTypes } from 'react';

function HeaderProfile({ user }) {
  if (user.id_name) {
    let welcome = `${user.name} ${user.surname}`;
    return (
      <div className="navbar-profile">
        <span>{welcome}</span>
      </div>
    );
  }
  return (
    <div className="navbar-profile">
      <span>Utente non loggato</span>
    </div>
  );
}

HeaderProfile.propTypes = {
  user: PropTypes.object,
};

export default HeaderProfile;
