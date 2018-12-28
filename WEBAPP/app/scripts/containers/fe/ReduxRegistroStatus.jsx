import { connect } from 'react-redux';
import { RegistroStatus } from 'components/fe/RegistroStatus.jsx';

const mapStateToProps = (state, ownProps) => ({
  registryStatus: state.registroInfo.registro.data.stato,
  context: ownProps.context,
});

const ReduxRegistroStatus = connect(
  mapStateToProps,
)(RegistroStatus);

export default ReduxRegistroStatus;
