import React, { PropTypes } from 'react';

function FormaDidStatus({ formaDid, status }) {
  switch (status) {
    case true:
      return (
        <div>
          <p>
            <strong> {formaDid.descFormaDid} : </strong>
            <span className="statusOK">
              {Math.round(formaDid.oreRegistrate * 10) / 10} di {formaDid.orePreviste}
            </span>
            <span className="statusOK mg5">
              <i className="glyphicon glyphicon-check"></i>
            </span>
          </p>
        </div>
      );
    case false:
      return (
        <div>
          <p>
            <strong> {formaDid.descFormaDid} : </strong>
            <span className="statusKO">
              {Math.round(formaDid.oreRegistrate * 10) / 10} di {formaDid.orePreviste}
            </span>
            <span className="statusKO mg5">
              <i className="glyphicon glyphicon-exclamation-sign"></i>
            </span>
          </p>
        </div>
      );
    default:
      return (
        <div>
          <p>
            <strong> {formaDid.descFormaDid} : </strong>
            {Math.round(formaDid.oreRegistrate * 10) / 10} di {formaDid.orePreviste}
          </p>
        </div>
      );
  }
}

FormaDidStatus.propTypes = {
  formaDid: PropTypes.object.isRequired,
  status: PropTypes.bool,
};

export default FormaDidStatus;
