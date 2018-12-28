import { connect } from 'react-redux';

import { updateRegistryAbsences } from 'actions/';

import RegistroAbsences from 'components/fe/RegistroAbsences.jsx';

const mapStateToProps = (state) => ({
  registryInfo: state.registroInfo.registro.data,
  registryAbsences: state.registroInfo.registro.data.oreGiustificate,
  isLoaded: state.registroInfo.registro.isLoaded,
  isEditing: state.registroInfo.registro.isEditing,
});


const mapDispatchToProps = (dispatch) => ({
  onUpdateAbsences: (registryId, absences) =>
    dispatch(updateRegistryAbsences(registryId, absences)),
});


const ReduxRegistroAbsence = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegistroAbsences);

export default ReduxRegistroAbsence;
