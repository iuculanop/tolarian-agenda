import { connect } from 'react-redux';
import { setTrasRecClosed, setTrasRecOpened, setTrasRecDeleted } from 'actions/';
import { RegistroAction } from 'components/fe/RegistriAction.jsx';

const mapStateToProps = (state) => ({
  registryInfo: state.registroInfo.registro.data,
  registryOccurrences: state.registroInfo.occorrenze.data,
  userInfo: state.userInfo,
  trasversal: true,
});

const mapDispatchToProps = (dispatch) => ({
  onCloseRegistry: (registryId) => dispatch(setTrasRecClosed(registryId)),
  onOpenRegistry: (registryId) => dispatch(setTrasRecOpened(registryId)),
  onDeleteRegistry: (registryId) => dispatch(setTrasRecDeleted(registryId)),
});

const ReduxTrasversalActions = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegistroAction);

export default ReduxTrasversalActions;
