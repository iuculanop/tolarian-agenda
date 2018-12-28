import { connect } from 'react-redux';
import { insertTrasversalActivities,
         removeTrasversalActivities,
         updateTrasversalActivities,
} from 'actions/';

import { TrasversalActivities } from 'components/fe/TrasversalActivities.jsx';

const mapStateToProps = (state) => ({
  registryInfo: state.registroInfo.registro.data,
  registryOccurrences: state.registroInfo.occorrenze.trasversalData,
  attivitaDid: state.registroInfo.trasFormeDid.data,
  isLoaded: state.registroInfo.occorrenze.isLoaded,
  isEditing: state.registroInfo.occorrenze.isEditing,
});

const mapDispatchToProps = (dispatch) => ({
  onInsertActivity: (registryId, occurrences) =>
    dispatch(insertTrasversalActivities(registryId, occurrences)),
  deleteOccurrences: (registryId, occurrences) =>
    dispatch(removeTrasversalActivities(registryId, occurrences)),
  updateOccurrences: (registryId, occurrences) =>
    dispatch(updateTrasversalActivities(registryId, occurrences)),
});

const ReduxTrasversalActivities = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TrasversalActivities);

export default ReduxTrasversalActivities;
