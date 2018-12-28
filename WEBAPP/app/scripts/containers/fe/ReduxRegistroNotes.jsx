import { connect } from 'react-redux';
import { updateRegistryNotes } from 'actions/';
import { RegistroNotes } from 'components/fe/RegistroNotes.jsx';

const mapStateToProps = (state) => ({
  registryInfo: state.registroInfo.registro.data,
  isEditing: state.registroInfo.registro.isEditing,
});

const mapDispatchToProps = (dispatch) => ({
  onUpdateNotes: (registryId, notes) =>
    dispatch(updateRegistryNotes(registryId, notes)),
});

const ReduxRegistroNotes = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegistroNotes);

export default ReduxRegistroNotes;
