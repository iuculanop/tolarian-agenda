import { connect } from 'react-redux';
import ShowCards from 'components/fe/ShowCards.jsx';
import { addCardCollection, removeCardCollection } from 'actions/';

const mapStateToProps = (state) => ({
  cards: state.cards.list,
  collection: state.collection.list,
  viewMode: state.cards.viewMode,
});

/* eslint-disable */
const mapDispatchToProps = (dispatch) => ({
  addCard: (card) => dispatch(addCardCollection(card)),
  removeCard: (card) => dispatch(removeCardCollection(card)),
});

/* eslint-enable */
const ReduxSearchCards = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShowCards);

export default ReduxSearchCards;
