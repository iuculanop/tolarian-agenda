import { connect } from 'react-redux';
import RegistroHoursDetails from 'components/fe/RegistroHoursDetails.jsx';

const mapStateToProps = (state) => ({
  registryInfo: state.registroInfo.registro.data,
  registryOccurrences: state.registroInfo.occorrenze.data,
});

const ReduxHoursDetails = connect(
  mapStateToProps,
)(RegistroHoursDetails);

export default ReduxHoursDetails;
