import { connect } from 'react-redux';
import { fetchEduRecs, fetchCriticalEduRecs, createEduRec, createTrasRec } from 'actions/';
import { RegistriList } from 'components/fe/RegistriList.jsx';

const mapStateToProps = (state) => ({
  actualYear: state.academicYears.selectedYear,
  registri: state.registriList.registriOnYear,
  registriTrasv: state.registriList.registriTrasversal,
  loading: state.registriList.loading,
});

const mapDispatchToProps = (dispatch) => ({
  onReceivingEduRecords: (acYear) => dispatch(fetchEduRecs(acYear)),
  onCheckingEduRecords: (acYear) => dispatch(fetchCriticalEduRecs(acYear)),
  openingEduRecord: (idCopertura) => dispatch(createEduRec(idCopertura)),
  openingTrasRecord: (acYear) => dispatch(createTrasRec(acYear)),
});

const ReduxRegistriList = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegistriList);

export default ReduxRegistriList;
