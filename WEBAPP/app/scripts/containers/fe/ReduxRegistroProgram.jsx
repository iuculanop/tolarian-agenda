import { connect } from 'react-redux';
import { RegistroProgram } from 'components/fe/RegistroProgram.jsx';

const mapStateToProps = (state) => ({
  registryProgram: state.registroInfo.programma.data,
});

const ReduxProgram = connect(
  mapStateToProps,
)(RegistroProgram);

export default ReduxProgram;
