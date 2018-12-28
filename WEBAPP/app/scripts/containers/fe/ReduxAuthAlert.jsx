import { connect } from 'react-redux';
import AuthAlert from 'components/modal/AuthAlert.jsx';

const mapStateToProps = (state) => ({
  userInfo: state.userInfo.data,
  isAuthenticated: state.userInfo.isAuthenticated,
  hasToken: state.userInfo.hasToken,
});

const ReduxAuthAlert = connect(
  mapStateToProps
)(AuthAlert);

export default ReduxAuthAlert;
