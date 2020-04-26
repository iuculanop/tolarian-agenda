import { connect } from 'react-redux';
import FriendList from 'components/fe/FriendList.jsx';

const mapStateToProps = (state) => ({
  isLoading: state.userInfo.isLoading,
  friendList: state.userInfo.data.friendList,
});

const mapDispatchToProps = () => ({});

const ReduxFriendList = connect(
  mapStateToProps,
  mapDispatchToProps,
)(FriendList);

export default ReduxFriendList;
