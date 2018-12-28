import { connect } from 'react-redux';
import { updateTrasversalNotes } from 'actions/';
import { TrasversalNotes } from 'components/fe/TrasversalNotes.jsx';

const mapStateToProps = (state) => ({
  registryInfo: state.registroInfo.registro.data,
  isEditing: state.registroInfo.registro.isEditing,
});

const mapDispatchToProps = (dispatch) => ({
  onUpdateNotes: (registryId, notes, descResearch) =>
   dispatch(updateTrasversalNotes(registryId, notes, descResearch)),
});

const ReduxTrasversalNotes = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TrasversalNotes);

export default ReduxTrasversalNotes;
