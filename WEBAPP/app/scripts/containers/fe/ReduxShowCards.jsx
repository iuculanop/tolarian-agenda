import { connect } from 'react-redux';
import ShowCards from 'components/fe/ShowCards.jsx';
import { updateCardCollection,
         removeCardCollection,
         updateWishlist,
} from 'actions/';

const mapStateToProps = (state) => ({
  loading: state.cards.loading,
  cards: state.cards.list,
  collection: state.collection.list,
  wishlist: state.wishlist.list,
  viewMode: state.cards.viewMode,
});

/* eslint-disable */
const mapDispatchToProps = (dispatch) => ({
  updateCard: (card) => dispatch(updateCardCollection(card)),
  removeCard: (card) => dispatch(removeCardCollection(card)),
  updateWishlist: (card) => dispatch(updateWishlist(card)),
});

/* eslint-enable */
const ReduxSearchCards = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShowCards);

export default ReduxSearchCards;
