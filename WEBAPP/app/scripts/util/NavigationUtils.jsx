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
//  appHistory.push(`card/${record.cardInfo.multiverseid}`);
  appHistory.push(`card/${record.cardId}`);
}

export function wishlistCardLink(record) {
  appHistory.push(`card/${record.cardId}`);
}

export function friendLink(record) {
  appHistory.push(`profile/${record.id.toString()}`);
}
