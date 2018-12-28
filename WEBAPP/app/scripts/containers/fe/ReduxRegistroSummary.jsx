import { connect } from 'react-redux';
import { RegistroSummary } from 'components/fe/RegistroSummary.jsx';

const mapStateToProps = (state) => ({
  registryInfo: state.registroInfo.registro.data,
});

const ReduxRegistroSummary = connect(
  mapStateToProps,
)(RegistroSummary);

export default ReduxRegistroSummary;
