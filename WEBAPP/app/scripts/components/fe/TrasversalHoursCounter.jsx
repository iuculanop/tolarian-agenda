import React, { PropTypes } from 'react';
import { hasMultipleFormeDid } from 'util/ArrayUtils.jsx';

import ModalHoursDetail from 'components/modal/ModalHoursDetails.jsx';

function calcRegisteredHours(registryOccurrences) {
  let hoursTotal = 0.0;
  for (let index = 0; index < registryOccurrences.length; index++) {
    hoursTotal += parseFloat(registryOccurrences[index].ore);
  }
  return Math.round(hoursTotal * 10) / 10;
}

function TrasversalHoursCounter({ registryOccurrences }) {
  let registered;
  const multipleActivities = hasMultipleFormeDid(registryOccurrences);
  registered = calcRegisteredHours(registryOccurrences);
  return (
    <div className="col-lg-12 col-md-12 col-sm-12">
      <div className="info-box">
        <span className="info-box-icon bg-light-blue">
          <i className="glyphicon glyphicon-time"></i>
        </span>
        <div className="info-box-content">
          <span className="info-box-text">Ore Registrate</span>
          <span className="info-box-number">
            {registered}</span>
          {
            multipleActivities &&
              <ModalHoursDetail trasversal />
          }
        </div>
      </div>
    </div>
  );
}

TrasversalHoursCounter.propTypes = {
  registryOccurrences: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export { TrasversalHoursCounter };
