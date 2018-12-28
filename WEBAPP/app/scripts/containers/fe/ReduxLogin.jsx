import { connect } from 'react-redux';
import { authenticateUser } from 'actions/';
import LoginModal from 'components/modal/LoginModal.jsx';

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  authenticateUser: (userId, password) => dispatch(authenticateUser(userId, password)),
});

const ReduxLogin = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginModal);

export default ReduxLogin;
