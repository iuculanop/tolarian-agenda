import { connect } from 'react-redux';
import { RegistroHoursCounter } from 'components/fe/RegistroHoursCounter.jsx';

const mapStateToProps = (state, ownProps) => ({
  registryInfo: state.registroInfo.registro.data,
  registryOccurrences: state.registroInfo.occorrenze.data,
  context: ownProps.context,
});

const ReduxHoursCounter = connect(
  mapStateToProps,
)(RegistroHoursCounter);

export default ReduxHoursCounter;
