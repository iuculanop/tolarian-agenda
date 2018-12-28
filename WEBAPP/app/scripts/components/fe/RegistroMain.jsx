import React, { PropTypes } from 'react';
import Loader from 'react-loader-advanced';
import Spinner from 'components/generic/Spinner.jsx';

import ReduxElencoAttivita from 'containers/fe/ReduxElencoAttivita.jsx';
import ReduxRegistroAbsences from 'containers/fe/ReduxRegistroAbsence.jsx';
import ReduxRegistroSummary from 'containers/fe/ReduxRegistroSummary.jsx';
import ReduxRegistroStatus from 'containers/fe/ReduxRegistroStatus.jsx';
import ReduxHoursCounter from 'containers/fe/ReduxHoursCounter.jsx';
import ReduxRegistroActions from 'containers/fe/ReduxRegistroActions.jsx';
import ReduxRegistroProgram from 'containers/fe/ReduxRegistroProgram.jsx';
import ReduxRegistroNotes from 'containers/fe/ReduxRegistroNotes.jsx';

const backStyle = { backgroundColor: 'rgba(236,240,245,0.5)' };

function Registro({ isLoaded, isEditing, isSaving }) {
  const isLoading = !isLoaded;
  return (
    <div>
      <Loader
        show={isLoading || isEditing || isSaving}
        message={<Spinner />}
        backgroundStyle={backStyle}
      >
        <div className="row">
          <div className="col-md-12 col-lg-9">
            <div className="row">
              <ReduxHoursCounter context="activity" />
              <ReduxHoursCounter context="absence" />
              <ReduxRegistroStatus />
            </div>
            <ReduxRegistroAbsences />
            <ReduxElencoAttivita />
          </div>
          <div className="col-md-12 col-lg-3">
            <ReduxRegistroSummary />
            <ReduxRegistroProgram />
            <ReduxRegistroNotes />
            <ReduxRegistroActions />
          </div>
        </div>
      </Loader>
    </div>
  );
}

Registro.propTypes = {
  isLoaded: PropTypes.bool,
  isEditing: PropTypes.bool,
  isSaving: PropTypes.bool,
};

export { Registro };
