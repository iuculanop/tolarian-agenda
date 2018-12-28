import moment from 'moment';
import { encodeText, decodeText } from 'util/EncodeUtils.jsx';
import { htmlEscape } from 'util/Formatters.jsx';

function activityConvertToModel(activity) {
  const attivita = {};
  const dateWrapped = moment(activity.dataAttivita);
  attivita.rId = activity.idAttivitaRegistrate;
  attivita.data = dateWrapped;
  attivita.day = dateWrapped.format('L');
  attivita.time = dateWrapped.format('LT');
  attivita.durata = activity.durata;
  attivita.aula = htmlEscape(decodeText(activity.aula));
  attivita.sede = htmlEscape(decodeText(activity.sede));
  attivita.idFormaDid = activity.formeDidatticheRegistrate.idFormaDidattica;
  attivita.descFormaDid = activity.formeDidatticheRegistrate.descrizione;
  if (activity.argomento) {
    attivita.argomento = htmlEscape(decodeText(activity.argomento));
  } else {
    attivita.argomento = '';
  }
  attivita.stato = activity.stato;
  return attivita;
}

function activityConvertFromModel(activity) {
  const attivita = {};
  let day;
  if (activity.rId) {
    attivita.idAttivitaRegistrate = activity.rId;
  }
  if (activity.day && activity.time) {
    if (typeof activity.day !== 'string') {
      day = activity.day.format('DD/MM/YYYY');
    } else {
      day = activity.day;
    }
    const dateUnwrapped = moment(`${day} ${activity.time}`, 'DD/MM/YYYY HH:mm');
    attivita.dataAttivita = dateUnwrapped.toDate();
  } else {
    attivita.dataAttivita = activity.data;
  }
  /*
  vecchia implementazione, rovesciati i casi if else
  if (activity.data) {
    attivita.dataAttivita = activity.data;
  } else {
    const dateUnwrapped = moment(`${activity.day} ${activity.time}`, 'DD/MM/YYYY HH:mm');
    attivita.dataAttivita = dateUnwrapped.toDate();
  }
  */
  if (typeof activity.durata === 'string') {
    attivita.durata = parseFloat(activity.durata.replace(',', '.'));
  } else {
    attivita.durata = activity.durata;
  }
  attivita.aula = htmlEscape(encodeText(activity.aula));
  attivita.sede = htmlEscape(encodeText(activity.sede));
  attivita.formeDidatticheRegistrate = {};
  attivita.formeDidatticheRegistrate.idFormaDidattica = parseInt(activity.idFormaDid, 10);
  attivita.formeDidatticheRegistrate.descrizione = activity.descFormaDid;
  if (activity.argomento) {
    attivita.argomento = htmlEscape(encodeText(activity.argomento));
  } else {
    attivita.argomento = '';
  }
  attivita.stato = activity.stato;
  return attivita;
}

export function activityMultipleConversionFromModel(response) {
  const activities = [];
  for (let i = 0; i < response.length; i++) {
    activities.push(activityConvertFromModel(response[i]));
  }
  return activities;
}

export function activityMultipleConversionToModel(response) {
  const activities = [];
  if (response) {
    for (let i = 0; i < response.length; i++) {
      activities.push(activityConvertToModel(response[i]));
    }
  }
  return activities;
}
