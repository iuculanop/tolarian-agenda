import moment from 'moment';

const shortDate = 'DD/MM/YYYY';
const shortTime = 'HH:mm';

function dateFmt(date) {
  return moment(date).format(shortDate);
}

function timeFmt(date) {
  return moment(date).format(shortTime);
}

function datetimeFmt(date) {
  return {
    date: dateFmt(date),
    time: timeFmt(date),
  };
}

const startdayStr = timeFmt(new Date(2000, 0, 1, 0, 0, 0, 0));
const enddayStr = timeFmt(new Date(2000, 0, 1, 23, 59, 59, 0));

function isFromStart(s) {
  return s.time === startdayStr;
}

function isUntilEnd(e) {
  return e.time === enddayStr;
}

function isAllDay(s, e) {
  return isFromStart(s) && isUntilEnd(e);
}

function intFmt(start, end) {
  const s = datetimeFmt(start);
  const e = datetimeFmt(end);
  if (s.date === e.date) {
    if (isAllDay(s, e)) {
      return s.date;
    } else if (isUntilEnd(e)) {
      return `${s.date} ${s.time}`;
    } // else
    return `${s.date} ${s.time}-${e.time}`;
  } // else
  if (isAllDay(s, e)) {
    return `${s.date} - ${e.date}`;
  } // else
  return `${s.date} ${s.time} - ${e.date} ${e.time}`;
}

export function formatOccurrence(occ) {
  return intFmt(occ.StartEnd.StartDateTime,
                 occ.StartEnd.EndDateTime);
}

export const DateQuery = {
  parse: (str) => moment(str, 'YYYY-MM-DD'),
  format: (date) => date.format('YYYY-MM-DD'),
  formatEU: (date) => date.format('DD-MM-YYYY'),
};

export const isSameDate = (date1, date2) => (
  DateQuery.format(date1) === DateQuery.format(date2)
);

export const now = () => moment();

export const today = () => DateQuery.parse(DateQuery.format(now()));
