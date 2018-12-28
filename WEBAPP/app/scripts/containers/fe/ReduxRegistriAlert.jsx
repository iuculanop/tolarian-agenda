import { connect } from 'react-redux';
import RegistriAlert from 'components/fe/RegistriAlert.jsx';

const mapStateToProps = (state) => ({
  registriCritical: state.registriList.registriCritical,
});

const ReduxRegistriAlert = connect(
  mapStateToProps
)(RegistriAlert);

export default ReduxRegistriAlert;
