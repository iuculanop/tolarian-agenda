import React from 'react';
import _ from 'lodash';

export function checkSet(setObj) {
  if (setObj.code.charAt(0) === 'p') return true;
  return false;
}

export function cardQuantity(idCard, collection) {
  const ownedCard = _.find(collection, { id_card: idCard });
  if (ownedCard) {
    return {
      qty: ownedCard.quantity,
      foilQty: ownedCard.foil_quantity,
    };
  }
  return {
    qty: 0,
    foilQty: 0,
  };
}

export function formatQuantity(card) {
  return `${card.qty + card.foilQty} (${card.foilQty})`;
}

export function formatPrintings(printings) {
  if (!printings || printings === null) return '';
  return _.join(printings, ' ');
}

export function formatRulings(rulings) {
  console.log('formatRulings:', rulings);
  if (!rulings || rulings === null) return '';
  return (
    <ul className="no-margin-table">
      {rulings.map((rule, index) => (<li key={index}>{rule.text}</li>))}
    </ul>
 );
  // return rulings.map((ruling) => <strong>ruling.date</strong> ruling.text);
}
