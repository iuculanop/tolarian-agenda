import { connect } from 'react-redux';
import { Registro } from 'components/fe/RegistroMain.jsx';

const mapStateToProps = (state) => ({
  isLoaded: state.registroInfo.registro.isLoaded,
  isEditing: state.registroInfo.registro.isEditing,
  isSaving: state.registroInfo.registro.isSaving,
});

const ReduxRegistro = connect(mapStateToProps)(Registro);

export default ReduxRegistro;
