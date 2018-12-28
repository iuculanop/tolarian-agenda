import { connect } from 'react-redux';
import SuperUser from 'components/fe/SuperUser.jsx';
import { embodyUser } from 'actions';

const mapStateToProps = (state) => ({
  user: state.userInfo.data,
  acYear: state.academicYears.selectedYear,
});

const mapDispatchToProps = (dispatch) => ({
  onChangeUser: (otherCF, acYear) =>
    dispatch(embodyUser(otherCF, acYear)),
});


const ReduxSuperUser = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SuperUser);

export default ReduxSuperUser;
