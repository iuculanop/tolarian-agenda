import { connect } from 'react-redux';
import { TrasversalHoursCounter } from 'components/fe/TrasversalHoursCounter.jsx';

const mapStateToProps = (state) => ({
  registryOccurrences: state.registroInfo.occorrenze.trasversalData,
});

const ReduxTrasversalHours = connect(
  mapStateToProps,
)(TrasversalHoursCounter);

export default ReduxTrasversalHours;
