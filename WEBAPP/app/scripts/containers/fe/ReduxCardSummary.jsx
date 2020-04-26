import { connect } from 'react-redux';
import ShowCardDetail from 'components/fe/ShowCardDetail.jsx';
import { updateCardCollection } from 'actions/';

const mapStateToProps = (state) => ({
  card: state.cards.cardDetails,
  collection: state.collection.list,
});

const mapDispatchToProps = (dispatch) => ({
  updateCard: (card) => dispatch(updateCardCollection(card)),
});

const ReduxCardSummary = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShowCardDetail);

export default ReduxCardSummary;
