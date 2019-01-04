import { appHistory } from 'appHistory';

export function menuLink(item) {
  if (item.key === 'home') {
    appHistory.push('/');
  }
}

export function imgCardLink(mId) {
  //  console.log('che mi arriva da rowClick:', record, index);
  appHistory.push(`card/${mId}`);
}

export function tableCardLink(record) {
  appHistory.push(`card/${record.multiverseid}`);
}

export function transactionCardLink(record) {
  appHistory.push(`card/${record.cardInfo.multiverseid}`);
}

export function trasversalLink(record) {
  appHistory.push(`attivita/${record.idRegistro.toString()}`);
}
