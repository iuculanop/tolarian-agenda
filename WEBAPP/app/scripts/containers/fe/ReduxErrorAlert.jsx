import { connect } from 'react-redux';
import ErrorAlert from 'components/modal/ErrorAlert.jsx';

const mapStateToProps = (state) => ({
  hasError: state.errorHandler.hasError,
  message: state.errorHandler.message,
});

const ReduxErrorAlert = connect(
  mapStateToProps
)(ErrorAlert);

export default ReduxErrorAlert;
