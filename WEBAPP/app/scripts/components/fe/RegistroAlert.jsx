import React, { PropTypes } from 'react';

function RegistroAlert({ registryInfo }) {
  if (registryInfo && registryInfo.dataChiusuraCopertura != null) {
    return (
      <div className="alert alert-danger">
        <b>Attenzione:</b> questa copertura è stata chiusa
        in data {registryInfo.dataChiusuraCopertura}.
        Si prega di rendicontare solo le attività svolte fino alla data di chiusura.<br></br>
        <b>Motivazione:</b> {registryInfo.descChiusuraCopertura}
      </div>
    );
  }
  return <div></div>;
}

RegistroAlert.propTypes = {
  registryInfo: PropTypes.object,
};

export default RegistroAlert;
