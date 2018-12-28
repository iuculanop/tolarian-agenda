import { connect } from 'react-redux';
import { Trasversale } from 'components/fe/TrasversaleMain.jsx';
import { loadTrasversal } from 'actions/';

const mapStateToProps = (state) => ({
  isLoaded: state.registroInfo.registro.isLoaded,
  isEditing: state.registroInfo.registro.isEditing,
  isSaving: state.registroInfo.registro.isSaving,
});

const mapDispatchToProps = (dispatch) => ({
  loadTrasversal: () => dispatch(loadTrasversal()),
});

const ReduxTrasversale = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Trasversale);

export default ReduxTrasversale;
