import { connect } from 'react-redux';
import ShowUserDetail from 'components/fe/ShowUserDetail.jsx';

const mapStateToProps = (state) => ({
  user: state.userInfo.otherData,
//  collection: state.collection.list,
});

const mapDispatchToProps = () => ({});

const ReduxCardSummary = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShowUserDetail);

export default ReduxCardSummary;
