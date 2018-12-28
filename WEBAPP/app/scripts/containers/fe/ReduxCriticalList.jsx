import { connect } from 'react-redux';
import { createEduRec } from 'actions/';
import { CriticalList } from 'components/fe/CriticalList.jsx';

const mapStateToProps = (state) => ({
  registriCritical: state.registriList.registriCritical,
});

const mapDispatchToProps = (dispatch) => ({
  openingEduRecord: (idCopertura) => dispatch(createEduRec(idCopertura)),
});

const ReduxCriticalList = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CriticalList);

export default ReduxCriticalList;
