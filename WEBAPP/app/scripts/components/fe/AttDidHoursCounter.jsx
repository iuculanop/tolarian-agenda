import React, { PropTypes } from 'react';

function AttDidHoursCounter({ formaDid }) {
  return (
    <div>
      <p>
        <strong> {formaDid.descFormaDid} : </strong>
        {Math.round(formaDid.ore * 10) / 10} ore
      </p>
    </div>
  );
}

AttDidHoursCounter.propTypes = {
  formaDid: PropTypes.object.isRequired,
};

export default AttDidHoursCounter;
