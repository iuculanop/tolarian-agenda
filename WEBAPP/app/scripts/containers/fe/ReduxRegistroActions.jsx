import { connect } from 'react-redux';
import { setEduRecClosed, setEduRecOpened, setEduRecDeleted } from 'actions/';
import { RegistroAction } from 'components/fe/RegistriAction.jsx';

const mapStateToProps = (state) => ({
  registryInfo: state.registroInfo.registro.data,
  registryOccurrences: state.registroInfo.occorrenze.data,
  userInfo: state.userInfo,
});

const mapDispatchToProps = (dispatch) => ({
  onCloseRegistry: (registryId) => dispatch(setEduRecClosed(registryId)),
  onOpenRegistry: (registryId) => dispatch(setEduRecOpened(registryId)),
  onDeleteRegistry: (registryId) => dispatch(setEduRecDeleted(registryId)),
});

const ReduxRegistroActions = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegistroAction);

export default ReduxRegistroActions;
