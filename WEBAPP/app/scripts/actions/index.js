import _ from 'lodash';

// importing ws calls for entity User
import {
    retrieveUser,
    authenticateUserWS,
    viewUserWS,
} from 'util/Ajax/user.jsx';

import { retrieveAllSetsWS } from 'util/Ajax/sets.jsx';

import { retrieveCardsWS,
         retrieveCardWS,
         updateCardWS,
         removeCardWS,
         retrieveTransactionsWS,
         retrieveWishlistWS,
         updateWishlistWS,
       } from 'util/Ajax/cards.jsx';

import { checkSet } from 'util/CardCollection.jsx';

// importing action types
import {
    USER,
    SETS,
    CARDS,
    COLLECTION,
    TRANSACTION,
    WISHLIST,
} from 'actions/actionTypes.js';

// ACTIONS FOR USER
export function authenticateUserOngoing(userId) {
  return {
    type: USER.AUTHENTICATE,
    payload: userId,
  };
}

export function authenticateUserCompleted(user, error = false) {
  if (error) {
    return {
      type: USER.NOT_AUTHENTICATED,
      payload: user,
    };
  }
  return {
    type: USER.AUTHENTICATED,
    payload: user,
  };
}

export function authenticateUser(userId, password) {
  return (dispatch) => {
    dispatch(authenticateUserOngoing(userId));
    return authenticateUserWS(userId, password)
        .then(response =>
          dispatch(authenticateUserCompleted(response.payLoad))
          , eventerror => {
            dispatch(authenticateUserCompleted(eventerror, true));
            const error = new Error('Unable to authenticate');
            error.error = eventerror;
            return Promise.reject(error);
          });
  };
}

export function logoutUser() {
  sessionStorage.clear();
  return {
    type: USER.NOT_AUTHENTICATED,
    payload: {},
  };
}

export function fetchUserOngoing() {
  return {
    type: USER.FETCH,
    payload: {},
  };
}

export function fetchUserCompleted(user, error = false) {
  console.log('debug fetchUserCompleted value=', user);
  return {
    type: USER.FETCH_COMPLETED,
    payload: user,
    error,
  };
}

export function fetchUser() {
  return (dispatch) => {
    dispatch(fetchUserOngoing());
    return retrieveUser()
      .then(response =>
            dispatch(fetchUserCompleted(response))
            , eventerror => {
              dispatch(fetchUserCompleted({ error: eventerror }, true));
              const error = new Error('Unable to retrieve user infos');
              error.error = eventerror;
              return Promise.reject(error);
            });
  };
}

export function viewUserOngoing() {
  return {
    type: USER.VIEW,
    payload: {},
  };
}

export function viewUserCompleted(user, error = false) {
  console.log('debug fetchUserCompleted value=', user);
  return {
    type: USER.VIEW_COMPLETED,
    payload: user,
    error,
  };
}

export function viewUser(userId) {
  return (dispatch) => {
    dispatch(viewUserOngoing());
    return viewUserWS(userId)
      .then(response =>
            dispatch(viewUserCompleted(response))
            , eventerror => {
              dispatch(viewUserCompleted({ error: eventerror }, true));
              const error = new Error('Unable to retrieve user infos');
              error.error = eventerror;
              return Promise.reject(error);
            });
  };
}

// ACTIONS FOR SETS
export function fetchAllSetsOngoing() {
  return {
    type: SETS.FETCH_ALL,
    payload: {},
  };
}

export function fetchAllSetsCompleted(sets) {
  const fSets = _.reject(sets, (o) => checkSet(o));
  return {
    type: SETS.FETCH_ALL_COMPLETED,
    payload: fSets,
  };
}

export function fetchAllSets() {
  return (dispatch) => {
    dispatch(fetchAllSetsOngoing());
    return retrieveAllSetsWS()
      .then(response =>
            dispatch(fetchAllSetsCompleted(response.payLoad))
            , eventerror => {
              const error = new Error('Unable to retrieve sets');
              error.error = eventerror;
              return Promise.reject(error);
            });
  };
}
// ACTIONS FOR COLLECTION
export function updateCardOngoing() {
  return {
    type: COLLECTION.UPDATECARD,
    payload: {},
  };
}

export function updateCardCompleted(collection, error = false) {
  return {
    type: COLLECTION.UPDATECARD_COMPLETED,
    payload: collection,
    error,
  };
}

export function updateCardCollection(card) {
  return (dispatch) => {
    dispatch(updateCardOngoing());
    return updateCardWS(card)
      .then(response =>
            dispatch(updateCardCompleted(response.payLoad.collection))
            , eventerror => {
              const error = new Error('Unable to add card');
              error.error = eventerror;
              return Promise.reject(error);
            });
  };
}

export function removeCardOngoing() {
  return {
    type: COLLECTION.REMOVECARD,
    payload: {},
  };
}

export function removeCardCompleted(collection, error = false) {
  return {
    type: COLLECTION.REMOVECARD_COMPLETED,
    payload: collection,
    error,
  };
}

export function removeCardCollection(card) {
  return (dispatch) => {
    dispatch(removeCardOngoing());
    return removeCardWS(card)
      .then(response =>
            dispatch(removeCardCompleted(response.payLoad.collection))
            , eventerror => {
              const error = new Error('Unable to remove card');
              error.error = eventerror;
              return Promise.reject(error);
            });
  };
}

export function fetchTransactionsOngoing() {
  return {
    type: TRANSACTION.FETCH_ALL,
    payload: [],
  };
}

export function fetchTransactionsCompleted(transactions, error = false) {
  return {
    type: TRANSACTION.FETCH_ALL_COMPLETED,
    payload: transactions,
    error,
  };
}

export function fetchTransactions() {
  return (dispatch) => {
    dispatch(fetchTransactionsOngoing());
    return retrieveTransactionsWS()
      .then(response =>
            dispatch(fetchTransactionsCompleted(response.payLoad)));
  };
}

// ACTIONS FOR WISHLIST
export function fetchWishlistOngoing() {
  return {
    type: WISHLIST.FETCH,
    payload: [],
  };
}

export function fetchWishlistCompleted(wishlist, error = false) {
  return {
    type: WISHLIST.FETCH_COMPLETED,
    payload: wishlist,
    error,
  };
}

export function fetchWishlist() {
  return (dispatch) => {
    dispatch(fetchWishlistOngoing());
    return retrieveWishlistWS()
      .then(response =>
            dispatch(fetchWishlistCompleted(response.payLoad)));
  };
}

export function updateWishlistOngoing() {
  return {
    type: WISHLIST.UPDATE,
    payload: {},
  };
}

export function updateWishlistCompleted(wishlist, error = false) {
  return {
    type: WISHLIST.UPDATE_COMPLETED,
    payload: wishlist,
    error,
  };
}

export function updateWishlist(card) {
  return (dispatch) => {
    dispatch(updateWishlistOngoing());
    return updateWishlistWS(card)
      .then(response =>
            dispatch(updateWishlistCompleted(response.payLoad))
            , eventerror => {
              const error = new Error('Unable to update wishlist');
              error.error = eventerror;
              return Promise.reject(error);
            });
  };
}

// ACTIONS FOR CARDS
export function fetchCardsOngoing(filterValues) {
  return {
    type: CARDS.FETCH,
    payload: filterValues,
  };
}

export function fetchCardsCompleted(cards, error = false) {
  // console.log('cosa ho recuperato dai servizi:', edurecords);
  return {
    type: CARDS.FETCH_COMPLETED,
    payload: cards,
    error,
  };
}

export function fetchCards(queryParms) {
  // console.log('che valori ho passato:', queryParms);
  return (dispatch, getState) => {
    dispatch(fetchCardsOngoing(queryParms));
    return retrieveCardsWS(queryParms)
      .then(response => {
        const state = getState();
        const nextFilterVal = state.cards.filterValues;
        // console.log('debug controllo filterValues', queryParms);
        // console.log('debug controllo state filterValues', nextFilterVal);
        // console.log(
        //   'debug controllo incrociato',
        //   _.isEqual(queryParms, nextFilterVal)
        // );
        if (_.isEqual(queryParms, nextFilterVal)) {
          dispatch(fetchCardsCompleted(response));
        }
      }, eventerror => {
        dispatch(fetchCardsCompleted({ error: eventerror }, true));
        const error = new Error('Impossible to fetch Cards' +
                                `Cause: ${eventerror.message || eventerror}`);
        error.error = eventerror;
        throw error;
      });
  };
}

export function fetchCardOngoing(cId) {
  return {
    type: CARDS.FETCH_DETAIL,
    payload: cId,
  };
}

export function fetchCardCompleted(card, error = false) {
  // console.log('cosa ho recuperato dai servizi:', edurecords);
  return {
    type: CARDS.FETCH_DETAIL_COMPLETED,
    payload: card,
    error,
  };
}

export function fetchCard(cId) {
  // console.log('che valori ho passato:', queryParms);
  return (dispatch) => {
    dispatch(fetchCardOngoing(cId));
    return retrieveCardWS(cId)
      .then(response =>
          dispatch(fetchCardCompleted(response))
      , eventerror => {
        dispatch(fetchCardCompleted({ error: eventerror }, true));
        const error = new Error('Impossible to fetch Card' +
                                `Cause: ${eventerror.message || eventerror}`);
        error.error = eventerror;
        throw error;
      });
  };
}

export function changeViewMode(checked) {
  return (dispatch) => {
    if (checked) {
      dispatch({
        type: CARDS.CHANGE_VIEW,
        payload: 'image',
      });
    } else {
      dispatch({
        type: CARDS.CHANGE_VIEW,
        payload: 'table',
      });
    }
  };
}
