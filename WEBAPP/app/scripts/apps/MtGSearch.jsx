import React, { PropTypes } from 'react';
import { Card } from 'antd';
import { connect } from 'react-redux';
import { fetchAllSets, fetchWishlist } from 'actions/';
import ReduxSearchForm from 'containers/fe/ReduxSearchForm.jsx';
import ReduxShowCards from 'containers/fe/ReduxShowCards.jsx';

class MtGSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'loading',
    };
  }

  componentDidMount() {
    this.props.fetchAllSets();
    this.props.fetchWishlist();
  }

  render() {
    return (
      <Card>
        <ReduxSearchForm />
        <ReduxShowCards />
      </Card>
    );
  }
}

MtGSearch.propTypes = {
  isLoaded: PropTypes.bool,
  fetchAllSets: PropTypes.func.isRequired,
  fetchWishlist: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isLoaded: state.sets.isLoaded,
});

const mapDispatchToProps = (dispatch) => ({
  fetchAllSets: () => dispatch(fetchAllSets()),
  fetchWishlist: () => dispatch(fetchWishlist()),
});

const ReduxMtGSearch = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MtGSearch);

export default ReduxMtGSearch;
