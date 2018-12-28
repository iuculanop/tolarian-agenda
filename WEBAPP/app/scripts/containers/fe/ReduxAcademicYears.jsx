import { connect } from 'react-redux';
import { selectACYear } from 'actions/';
import { AcademicYearSelect } from 'components/fe/AcademicYearSelect.jsx';

const mapStateToProps = (state) => ({
  actualYear: state.academicYears.selectedYear,
});

const mapDispatchToProps = (dispatch) => ({
  onChangeYear: (event) => dispatch(selectACYear(event.target.value)),
});

const ReduxAcademicYears = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AcademicYearSelect);

export default ReduxAcademicYears;
