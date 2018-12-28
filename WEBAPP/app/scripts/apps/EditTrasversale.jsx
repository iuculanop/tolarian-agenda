import React, { PropTypes } from 'react';
import { fetchTrasActivities, fetchTrasFormeDid } from 'actions';
import ReduxTrasversale from 'containers/fe/ReduxTrasversale.jsx';

function EditTrasversale() {
  return <ReduxTrasversale />;
}

EditTrasversale.propTypes = {
  params: PropTypes.object.isRequired,
};

function onEnterEditTrasversale(store, nextState) {
  store.dispatch(fetchTrasActivities(nextState.params.id));
  store.dispatch(fetchTrasFormeDid());
}

export { EditTrasversale, onEnterEditTrasversale };
