import React from 'react';

import gifSpinner from '../../../images/ajaxSpinner.gif';

function Spinner() {
  return (
    <span>
      <img alt="Attendere prego..." src={gifSpinner} />
    </span>
  );
}

export default Spinner;
