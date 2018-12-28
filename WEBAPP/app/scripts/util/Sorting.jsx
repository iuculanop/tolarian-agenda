import moment from 'moment';

export function sortDate(a, b, sorting) {
  const aDate = moment(a.data || '01/01/1970', 'DD/MM/YYYY');
  const bDate = moment(b.data || '02/01/1970', 'DD/MM/YYYY');
  if (sorting === 'desc') {
    if (aDate.isBefore(bDate)) return -1;
    if (aDate.isAfter(bDate)) return 1;
  }
  if (sorting === 'asc') {
    if (bDate.isBefore(aDate)) return -1;
    if (bDate.isAfter(aDate)) return 1;
  }
  return 0;
}

export function sortName(a, b, sorting) {
  if (sorting === 'desc') {
    if (a.descFormaDid > b.descFormaDid) return -1;
    if (a.descFormaDid < b.descFormaDid) return 1;
  }
  if (sorting === 'asc') {
    if (b.descFormaDid > a.descFormaDid) return -1;
    if (b.descFormaDid < a.descFormaDid) return 1;
  }
  return 0;
}
