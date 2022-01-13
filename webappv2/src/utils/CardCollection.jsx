import React from 'react';
import { Icon, Popover } from 'antd';
import _ from 'lodash';

export function checkSet(setObj) {
  if (setObj.code.charAt(0) === 'p') return true;
  return false;
}

export function cardRowKey(record) {
  return `${record.id}${record.number}`;
}

export function cardLink(record) {
  return `./card/${record.multiverseid}`;
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

export function wishQuantity(cardId, wishlist) {
  const wQty = {
    qty: 0,
    foilQty: 0,
  };
  const wishes = _.filter(wishlist, { cardId });
  if (wishes && wishes.length === 1) {
    console.log('arrivato alla build della risposta');
    wQty.qty = (wishes[0].cardType === 0 ? wishes[0].quantity : 0);
    wQty.foilQty = (wishes[0].cardType === 1 ? wishes[0].quantity : 0);
  }
  if (wishes && wishes.length === 2) {
    wQty.qty = _.find(wishes, { cardType: 0 }).quantity;
    wQty.foilQty = _.find(wishes, { cardType: 1 }).quantity;
  }
  return wQty;
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

export function isFoilFormatter(value) {
  if (value === 1) {
    return (
      <span>
        <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
      </span>
    );
  }
  return (
    <span></span>
  );
}

// Formatter per nomi carta
export function cardNameFormatter(card, withLink = true) {
  let fullName = card.name;
  if (card.names && card.names !== null && card.names.length > 1) {
    fullName = card.names.join('//');
  }

  const idCard = (card.cardId ? card.cardId : card.multiverseid);
  const imgUrl = `http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${idCard}&type=card`;
  const cardImage = (
    <img
      className="full-width"
      alt={card.name}
      src={imgUrl}
    />
  );
  if (withLink) {
    return (
      <Popover placement="right" content={cardImage}>
        <a>{fullName}</a>
      </Popover>
    );
  }
  return (<span>{fullName}</span>);
}
