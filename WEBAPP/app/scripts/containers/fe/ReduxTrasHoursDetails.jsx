import { connect } from 'react-redux';
import TrasversalHoursDetails from 'components/fe/TrasversalHoursDetails.jsx';

const mapStateToProps = (state) => ({
  registryOccurrences: state.registroInfo.occorrenze.trasversalData,
});

const ReduxTrasHoursDetails = connect(
  mapStateToProps,
)(TrasversalHoursDetails);

export default ReduxTrasHoursDetails;
