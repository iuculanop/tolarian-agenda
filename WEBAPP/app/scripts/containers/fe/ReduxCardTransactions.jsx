import { connect } from 'react-redux';
import CardTransactions from 'components/fe/CardTransactions.jsx';
import { fetchTransactions } from 'actions/';

const mapStateToProps = (state) => ({
  isLoading: state.transaction.loading,
  transactions: state.transaction.list,
});

const mapDispatchToProps = (dispatch) => ({
  fetchTransactions: () => dispatch(fetchTransactions()),
});

const ReduxCardTransactions = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CardTransactions);

export default ReduxCardTransactions;
