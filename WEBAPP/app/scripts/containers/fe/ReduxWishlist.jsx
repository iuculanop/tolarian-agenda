import { connect } from 'react-redux';
import Wishlist from 'components/fe/Wishlist.jsx';
import { fetchWishlist } from 'actions/';

const mapStateToProps = (state) => ({
  isLoading: state.wishlist.loading,
  wishlist: state.wishlist.list,
});

const mapDispatchToProps = (dispatch) => ({
  fetchWishlist: () => dispatch(fetchWishlist()),
});

const ReduxWhislist = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Wishlist);

export default ReduxWhislist;
