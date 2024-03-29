import { checkStatus, parseJSON } from 'util/Ajax/responseUtils.jsx';
import { wsURL } from 'util/AppConfig.jsx';
import _ from 'lodash';
import qsParser from 'query-string';

export function retrieveCardsWS(queryParams) {
  const authToken = sessionStorage.getItem('token') || '';
  const filteredQP = _.omitBy(queryParams, (qp) => {
    // console.log('debug pickBy:', qp);
    if (qp == null) { return true; }
    return false;
  });
  const qp = qsParser.stringify(filteredQP);
  return (
    fetch(`${wsURL}/card?${qp}`, {
      headers: new Headers({
        Authorization: `Bearer ${authToken}`,
      }),
      method: 'GET',
    })
      .then(checkStatus)
      .then(parseJSON)
  );
}

export function retrieveCardWS(cId) {
  const authToken = sessionStorage.getItem('token') || '';
  return (
    fetch(`${wsURL}/card/${cId}`, {
      headers: new Headers({
        Authorization: `Bearer ${authToken}`,
      }),
      method: 'GET',
    })
      .then(checkStatus)
      .then(parseJSON)
  );
}

export function updateCardWS(cardInfo) {
  const authToken = sessionStorage.getItem('token') || '';
  return (
    fetch(`${wsURL}/collection/update`, {
      headers: new Headers({
        Authorization: `Bearer ${authToken}`,
      }),
      method: 'POST',
      body: JSON.stringify(cardInfo),
    })
      .then(checkStatus)
      .then(parseJSON)
  );
}

export function removeCardWS(cardInfo) {
  const authToken = sessionStorage.getItem('token') || '';
  return (
    fetch(`${wsURL}/collection/remove`, {
      headers: new Headers({
        Authorization: `Bearer ${authToken}`,
      }),
      method: 'POST',
      body: JSON.stringify(cardInfo),
    })
      .then(checkStatus)
      .then(parseJSON)
  );
}

export function retrieveTransactionsWS() {
  const authToken = sessionStorage.getItem('token') || '';
  return (
    fetch(`${wsURL}/collection/transactions`, {
      headers: new Headers({
        Authorization: `Bearer ${authToken}`,
      }),
      method: 'GET',
    })
      .then(checkStatus)
      .then(parseJSON)
  );
}

export function retrieveWishlistWS() {
  const authToken = sessionStorage.getItem('token') || '';
  return (
    fetch(`${wsURL}/wishlist`, {
      headers: new Headers({
        Authorization: `Bearer ${authToken}`,
      }),
      method: 'GET',
    })
      .then(checkStatus)
      .then(parseJSON)
  );
}

export function updateWishlistWS(wishCard) {
  const authToken = sessionStorage.getItem('token') || '';
  return (
    fetch(`${wsURL}/wishlist/update`, {
      headers: new Headers({
        Authorization: `Bearer ${authToken}`,
      }),
      method: 'POST',
      body: JSON.stringify(wishCard),
    })
      .then(checkStatus)
      .then(parseJSON)
  );
}
