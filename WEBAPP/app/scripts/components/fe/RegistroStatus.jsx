import React, { PropTypes } from 'react';

function RegistroStatus({ registryStatus, context }) {
  let className = 'col-lg-4 col-md-4 col-sm-12';
  if (context) {
    className = 'col-lg-12';
  }
  switch (registryStatus) {
    case 'C':
      return (
        <div className={className}>
          <div className="info-box">
            <span className="info-box-icon bg-orange">
              <i className="glyphicon glyphicon-tasks"></i>
            </span>
            <div className="info-box-content">
              <span className="info-box-text">Stato Registro</span>
              <span className="info-box-number">Chiuso in attesa di approvazione</span>
            </div>
          </div>
        </div>
      );
    case 'A':
      return (
        <div className={className}>
          <div className="info-box">
            <span className="info-box-icon bg-green">
              <i className="glyphicon glyphicon-tasks"></i>
            </span>
            <div className="info-box-content">
              <span className="info-box-text">Stato Registro</span>
              <span className="info-box-number">Approvato</span>
            </div>
          </div>
        </div>
      );
    case 'Z':
      return (
        <div className={className}>
          <div className="info-box">
            <span className="info-box-icon bg-grey">
              <i className="glyphicon glyphicon-tasks"></i>
            </span>
            <div className="info-box-content">
              <span className="info-box-text">Stato Registro</span>
              <span className="info-box-number">Approvato e archiviato</span>
            </div>
          </div>
        </div>
      );
    case 'N':
    default:
      return (
        <div className={className}>
          <div className="info-box">
            <span className="info-box-icon bg-light-blue">
              <i className="glyphicon glyphicon-tasks"></i>
            </span>
            <div className="info-box-content">
              <span className="info-box-text">Stato Registro</span>
              <span className="info-box-number">In compilazione</span>
            </div>
          </div>
        </div>
      );
  }
}

RegistroStatus.propTypes = {
  registryStatus: PropTypes.string.isRequired,
  context: PropTypes.string,
};

export { RegistroStatus };
