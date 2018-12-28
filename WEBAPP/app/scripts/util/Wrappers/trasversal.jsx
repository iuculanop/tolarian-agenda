import moment from 'moment';
import { encodeText, decodeText } from 'util/EncodeUtils.jsx';
import { htmlEscape } from 'util/Formatters.jsx';

export function trasversalConvertToModel(trasRec) {
  const trasversal = {};
  if (trasRec) {
    trasversal.idRegistro = trasRec.idRegistro;
    trasversal.annoAccademico = trasRec.annoAccademico;
    trasversal.stato = trasRec.stato;
    trasversal.trasversale = trasRec.trasversale;
    if (trasRec.annotazioni) {
      trasversal.annotazioni = htmlEscape(decodeText(trasRec.annotazioni));
    } else {
      trasversal.annotazioni = '';
    }
    if (trasRec.attivitaRicerca) {
      trasversal.attivitaRicerca = htmlEscape(decodeText(trasRec.attivitaRicerca));
    } else {
      trasversal.attivitaRicerca = '';
    }
  }
  return trasversal;
}

export function trasversalConvertFromModel(trasRec) {
  const trasversal = {};
  if (trasRec) {
    trasversal.idRegistro = trasRec.idRegistro;
    trasversal.annoAccademico = trasRec.annoAccademico;
    trasversal.stato = trasRec.stato;
    trasversal.trasversale = trasRec.trasversale;
    trasversal.annotazioni = htmlEscape(encodeText(trasRec.annotazioni));
    trasversal.attivitaRicerca = htmlEscape(encodeText(trasRec.attivitaRicerca));
  }
  return trasversal;
}

export function trasversalMultipleConversionToModel(response) {
  const trasActivities = [];
  for (let i = 0; i < response.length; i++) {
    trasActivities.push(trasversalConvertToModel(response[i]));
  }
  return trasActivities;
}

export function trasversalMultipleConversionFromModel(response) {
  const activities = [];
  for (let i = 0; i < response.length; i++) {
    activities.push(trasversalConvertFromModel(response[i]));
  }
  return activities;
}

function trasvActivityConvertToModel(trasActivity) {
  const trasvAttivita = {};
  let dateWrapped;
  if (trasActivity.dataAttivita) {
    dateWrapped = moment(trasActivity.dataAttivita);
    trasvAttivita.data = dateWrapped.format('L');
  }
  trasvAttivita.rId = trasActivity.idAttivitaTrasversale;
  if (trasActivity.descrizione) {
    trasvAttivita.descrizione = htmlEscape(decodeText(trasActivity.descrizione));
  } else {
    trasvAttivita.descrizione = '';
  }
  if (trasActivity.altreInformazioni) {
    trasvAttivita.altreInfo = htmlEscape(decodeText(trasActivity.altreInformazioni));
  } else {
    trasvAttivita.altreInfo = '';
  }
  trasvAttivita.descFormaDid = trasActivity.formaDidattica.descrizione;
  trasvAttivita.idFormaDid = trasActivity.formaDidattica.idFormaDidattica;
  trasvAttivita.ore = trasActivity.ore;
  return trasvAttivita;
}

function trasvActivityConvertFromModel(activity) {
  const attivita = {};
  if (activity.rId) {
    attivita.idAttivitaTrasversale = activity.rId;
  }
  if (typeof activity.data === 'string') {
    attivita.dataAttivita = moment(activity.data, 'DD/MM/YYYY');
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
  if (typeof activity.ore === 'string') {
    attivita.ore = parseFloat(activity.ore.replace(',', '.'));
  } else {
    attivita.ore = activity.ore;
  }
  if (activity.descrizione) {
    attivita.descrizione = htmlEscape(encodeText(activity.descrizione));
  } else {
    attivita.descrizione = activity.descrizione;
  }
  if (activity.altreInfo) {
    attivita.altreInformazioni = htmlEscape(encodeText(activity.altreInfo));
  } else {
    attivita.altreInformazioni = activity.altreInfo;
  }
  attivita.formaDidattica = {};
  attivita.formaDidattica.idFormaDidattica = parseInt(activity.idFormaDid, 10);
  attivita.formaDidattica.descrizione = activity.descFormaDid;
  return attivita;
}

export function trasvActivityMultipleConversionToModel(response) {
  const trasActivities = [];
  for (let i = 0; i < response.length; i++) {
    trasActivities.push(trasvActivityConvertToModel(response[i]));
  }
  return trasActivities;
}

export function trasvActivityMultipleConversionFromModel(response) {
  const activities = [];
  for (let i = 0; i < response.length; i++) {
    activities.push(trasvActivityConvertFromModel(response[i]));
  }
  return activities;
}
