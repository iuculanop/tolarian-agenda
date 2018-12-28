import React from 'react';
import { Select } from 'antd';
import { connect } from 'react-redux';
import { fetchCards, changeViewMode } from 'actions/';
import SearchForm from 'components/form/SearchCardForm.jsx';

const Option = Select.Option;

const mapStateToProps = (state) => ({
  filterValues: state.cards.filterValues,
  sets: state.sets.list.map(setMTG => (
    <Option key={setMTG.code} value={setMTG.code}>
        {setMTG.name.toUpperCase()}
    </Option>)),
  viewMode: state.cards.viewMode,
});

const mapDispatchToProps = (dispatch) => ({
  fetchCards: (queryParms) => dispatch(fetchCards(queryParms)),
  changeViewMode: (checked) => dispatch(changeViewMode(checked)),
});

const ReduxSearchCards = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchForm);

export default ReduxSearchCards;
