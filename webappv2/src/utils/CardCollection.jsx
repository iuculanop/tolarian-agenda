import React from 'react';
import { Icon, Popover } from 'antd';
import _ from 'lodash';

export function checkSet(setObj) {
  if (setObj.code.charAt(0) === 'p') return true;
  return false;
}

export function cleanCardList(list) {
  return _.uniqBy(list, function(e) {
    //console.warn('e:', e, ' identified by id: ', cardRowKey(e));
    return cardRowKey(e);
  })
}

export function cardRowKey(record) {
  return `${record.id}${record.number}`;
}

export function ownedCardRowKey(record) {
  return `${record.id_card}${record.id_lang}`;
}

export function cardLink(record) {
  return `./card/${record.multiverseid}`;
}

export function cardQuantity(idCard, collection) {
  // console.warn('cerco la carta con id:', idCard,' nella collezione ', collection);
  const ownedCard = _.filter(collection, { id_card: idCard });
  let totalQty = 0;
  let totalFQty = 0;
  if (ownedCard.length > 0) {
    ownedCard.forEach(function(item) {
      totalQty += item.quantity;
      totalFQty += item.foil_quantity;
    });
  }
  // console.warn('quantita totale: ', totalQty, ' . Foil: ', totalFQty);
  /* if (ownedCard) {
    return {
      qty: ownedCard.quantity,
      foilQty: ownedCard.foil_quantity,
    };
  } */
  return {
    qty: totalQty,
    foilQty: totalFQty,
  };
}

export function getBinderName(bId, binders) {
  // console.warn('parametri passati a getBinderName', bId, binders);
  const binder = _.find(binders, { binderId: bId });
  // console.warn('recuperate info sul binder:', binder);
  return binder.binderName;
  // return "binder name";
}

export function getCollectedItems(idCard, collection) {
  const ownedCards = _.filter(collection, { id_card: idCard});
  // console.warn('in collezione sono presenti le seguenti carte:', ownedCards);
  return ownedCards;
}

export function cardLanguages(record) {
  // console.warn('record', record);
  const cl = [];
  cl.push({ lang: 'English', value: record.multiverseid });
  if (record.foreignNames && record.foreignNames.length > 0) {
    record.foreignNames.forEach(element => {
      cl.push({ lang:element.language, value: element.multiverseid });
    });
  }
  // console.warn('lingue disponibili:', cl);
  return cl;
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
