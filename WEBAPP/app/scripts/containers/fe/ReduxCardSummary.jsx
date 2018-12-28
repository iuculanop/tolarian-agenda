import { connect } from 'react-redux';
import ShowCardDetail from 'components/fe/ShowCardDetail.jsx';
import { addCardCollection } from 'actions/';

const mapStateToProps = (state) => ({
  card: state.cards.cardDetails,
  collection: state.collection.list,
});

const mapDispatchToProps = (dispatch) => ({
  addCard: (card) => dispatch(addCardCollection(card)),
});

const ReduxCardSummary = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShowCardDetail);

export default ReduxCardSummary;
