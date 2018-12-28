import React, { PropTypes } from 'react';

function RegistriAlert({ registriCritical }) {
  if (registriCritical && registriCritical.length > 0) {
    return (
      <div className="row">
        <div className="col-md-3"></div>
        <div className="col-md-6">
          <div className="callout callout-danger lead">
            <span className="callout-icon bg-red">
              <i className="glyphicon glyphicon-alert"></i>
            </span>
            <h4>Attenzione!</h4>
            <p>
              Registri incompleti in anni precedenti!
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div></div>
  );
}

RegistriAlert.propTypes = {
  registriCritical: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default RegistriAlert;
