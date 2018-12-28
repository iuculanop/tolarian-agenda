import moment from 'moment';
import { DateQuery } from 'util/DateFormatter.jsx';

export function getActualYear() {
  const today = DateQuery.parse(DateQuery.format(moment()));
  if (today.month() > 7) {
    const acyear = today.year() + 1;
    return acyear;
  }
  const acyear = today.year();
  return acyear;
}

export function getActualAcademicYear() {
  const today = DateQuery.parse(DateQuery.format(moment()));
  if (today.month() > 7) {
    const acyear = `${today.year()}-${today.year() + 1}`;
    return acyear;
  }
  const acyear = `${today.year() - 1}-${today.year()}`;
  return acyear;
}

export function generateRange() {
  const today = DateQuery.parse(DateQuery.format(moment()));
  const rangeYears = [];
  let acyear;
  if (today.month() > 7) {
    acyear = `${today.year()}-${today.year() + 1}`;
    rangeYears.push(acyear);
  }
  for (let i = 0; i < 7; i++) {
    acyear = `${today.year() - i - 1}-${today.year() - i}`;
    rangeYears.push(acyear);
  }
  return rangeYears;
}

export function isOnAcademicYear() {
  const today = DateQuery.parse(DateQuery.format(moment()));
  const academicYear = getActualYear;
  if (today.year() === (academicYear - 1) && today.month() < 9) {
    return false;
  }
  return true;
}
