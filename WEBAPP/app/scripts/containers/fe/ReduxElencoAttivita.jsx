import { connect } from 'react-redux';
import { insertRegistryOccurrencesRemote,
         removeRegistryOccurrences,
         updateRegistryOccurrences,
} from 'actions/';
import { RegistroActivities } from 'components/fe/RegistroActivities.jsx';

const mapStateToProps = (state) => ({
  registryInfo: state.registroInfo.registro.data,
  registryOccurrences: state.registroInfo.occorrenze.data,
  isLoaded: state.registroInfo.occorrenze.isLoaded,
  isEditing: state.registroInfo.occorrenze.isEditing,
});

const mapDispatchToProps = (dispatch) => ({
  onInsertByWeek: (registryId, occurrences) =>
    dispatch(insertRegistryOccurrencesRemote(registryId, occurrences)),
  deleteOccurrences: (registryId, occurrences) =>
    dispatch(removeRegistryOccurrences(registryId, occurrences)),
  updateOccurrences: (registryId, occurrences) =>
    dispatch(updateRegistryOccurrences(registryId, occurrences)),
});

const ReduxElencoAttivita = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegistroActivities);

export default ReduxElencoAttivita;
