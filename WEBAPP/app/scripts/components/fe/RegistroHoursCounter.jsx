import React, { PropTypes } from 'react';

import ModalHoursDetail from 'components/modal/ModalHoursDetails.jsx';

function calcRegisteredHours(registryOccurrences) {
  let hoursTotal = 0.0;
  for (let index = 0; index < registryOccurrences.length; index++) {
    hoursTotal += parseFloat(registryOccurrences[index].durata);
  }
  return Math.round(hoursTotal * 10) / 10;
}

function calcIncompleteHours(registryOccurrences) {
  console.log('debug 20171102:', registryOccurrences);
  let hoursTotal = 0.0;
  for (let index = 0; index < registryOccurrences.length; index++) {
    if (registryOccurrences[index].argomento === '') {
      hoursTotal += parseFloat(registryOccurrences[index].durata);
    }
  }
  return Math.round(hoursTotal * 10) / 10;
}

function calcRegisteredAbsences(registryAbsences) {
  let hoursTotal = 0.0;
  if (registryAbsences) {
    for (let index = 0; index < registryAbsences.length; index++) {
      hoursTotal += parseFloat(registryAbsences[index].ore);
    }
  }
  return Math.round(hoursTotal * 10) / 10;
}

function calcScheduledHours(registryInfo) {
  let hoursTotal = 0;
  if (registryInfo.hasOwnProperty('descFD') &&
      registryInfo.descFD.length > 0) {
    for (let index = 0; index < registryInfo.descFD.length; index++) {
      hoursTotal += registryInfo.descFD[index].oreDocente;
    }
  }
  return hoursTotal;
}

function RegistroHoursCounter({ registryInfo, registryOccurrences, context }) {
  let registered;
  let scheduled;
  switch (context) {
    case 'absence': {
      registered = calcRegisteredAbsences(registryInfo.oreGiustificate);
      scheduled = calcScheduledHours(registryInfo) - calcRegisteredHours(registryOccurrences);
      return (
        <div className="col-lg-4 col-md-4 col-sm-12">
          <div className="info-box">
            <span className="info-box-icon bg-light-blue">
              <i className="glyphicon glyphicon-tags"></i>
            </span>
            <div className="info-box-content">
              <span className="info-box-text">Ore Assenze</span>
              <span className="info-box-number">
                {registered}</span>
            </div>
          </div>
        </div>
      );
    }
    case 'activity':
    default: {
      registered = calcRegisteredHours(registryOccurrences);
      scheduled = calcScheduledHours(registryInfo);
      const incomplete = calcIncompleteHours(registryOccurrences);
      const title = `Ore senza argomento: ${incomplete}`;
      console.log('debug 20171102:', title);
      return (
        <div className="col-lg-4 col-md-4 col-sm-12">
          <div className="info-box">
            <span className="info-box-icon bg-light-blue">
              <i className="glyphicon glyphicon-time"></i>
            </span>
            <div className="info-box-content">
              <span className="info-box-text">Ore Registrate</span>
              <span className="info-box-number">
                {registered} su {scheduled}
                {
                  incomplete > 0 &&
                    <span className="mg5" title={title}>
                      <i className="glyphicon glyphicon-exclamation-sign"></i>
                    </span>
                }
              </span>
              {
                registryInfo.hasOwnProperty('descFD') && registryInfo.descFD.length > 1 &&
                  <ModalHoursDetail />
              }
            </div>
          </div>
        </div>
      );
    }
  }
}

RegistroHoursCounter.propTypes = {
  registryInfo: PropTypes.object.isRequired,
  registryOccurrences: PropTypes.arrayOf(PropTypes.object).isRequired,
  context: PropTypes.string.isRequired,
};

export { RegistroHoursCounter };
