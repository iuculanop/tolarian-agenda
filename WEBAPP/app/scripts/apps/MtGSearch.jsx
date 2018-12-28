import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchAllSets } from 'actions/';
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
  }

  render() {
    return (
      <div>
        <ReduxSearchForm />
        <ReduxShowCards />
      </div>
    );
  }
}

MtGSearch.propTypes = {
  isLoaded: PropTypes.bool,
  fetchAllSets: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isLoaded: state.sets.isLoaded,
});

const mapDispatchToProps = (dispatch) => ({
  fetchAllSets: () => dispatch(fetchAllSets()),
});

const ReduxMtGSearch = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MtGSearch);

export default ReduxMtGSearch;
