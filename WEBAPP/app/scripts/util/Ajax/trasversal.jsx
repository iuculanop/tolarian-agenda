import moment from 'moment';
import authFetch from 'util/Ajax/customAjaxCalls.jsx';
import { registriWS } from 'util/AppConfig.jsx';
import { checkStatus, parseJSON } from 'util/Ajax/responseUtils.jsx';
import { trasvActivityMultipleConversionToModel,
         trasvActivityMultipleConversionFromModel,
         trasversalMultipleConversionToModel,
         trasversalConvertToModel,
} from 'util/Wrappers/trasversal.jsx';

moment.locale('it');

// setting base urls for webservices
const wsRegistriURL = registriWS;

export function retrieveTrasRecsWS(year) {
  return (
    authFetch(`${wsRegistriURL}/registroTrasversale/${year}/elenco`, {
      credentials: 'include',
    })
      .then(checkStatus)
      .then(parseJSON)
      .then(response => trasversalMultipleConversionToModel(response.payLoad))
  );
}

export function createTrasversalRecWS(acYear) {
  return (
    authFetch(`${wsRegistriURL}/registroTrasversale/${acYear}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'post',
    })
      .then(checkStatus)
      .then(parseJSON)
      .then((response) => trasversalConvertToModel(response.payLoad))
  );
}

export function openTrasversalRecWS(idRegistro) {
  const openedEduRec = {
    idRegistro,
    stato: 'N',
  };
  return (
    authFetch(`${wsRegistriURL}/registroTrasversale/${idRegistro}/stato`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'put',
      body: JSON.stringify(openedEduRec),
    })
      .then(checkStatus)
      .then(parseJSON)
      .then((response) => trasversalConvertToModel(response.payLoad))
  );
}

export function closeTrasversalRecWS(idRegistro) {
  const closedEduRec = {
    idRegistro,
    stato: 'C',
  };
  return (
    authFetch(`${wsRegistriURL}/registroTrasversale/${idRegistro}/stato`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'put',
      body: JSON.stringify(closedEduRec),
    })
      .then(checkStatus)
      .then(parseJSON)
      .then((response) => trasversalConvertToModel(response.payLoad))
  );
}

export function deleteTrasversalRecWS(idRegistro) {
  return (
    authFetch(`${wsRegistriURL}/registroTrasversale/${idRegistro}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'delete',
    })
      .then(checkStatus)
  );
}

export function updateTrasversalNotesWS(idRegistro, notes, descResearch) {
  const EduRecNotes = {
    idRegistro,
    annotazioni: notes,
    attivitaRicerca: descResearch,
  };
  return (
    authFetch(`${wsRegistriURL}/registroTrasversale/${idRegistro}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'put',
      body: JSON.stringify(EduRecNotes),
    })
      .then(checkStatus)
      .then(parseJSON)
      .then((response) => trasversalConvertToModel(response.payLoad))
  );
}

export function retrieveTrasOccurrencesWS(idRegistro) {
  return (
    authFetch(`${wsRegistriURL}/registroTrasversale/${idRegistro}/attivitaRegistrate`, {
      credentials: 'include',
    })
      .then(checkStatus)
      .then(parseJSON)
      .then((response) => trasvActivityMultipleConversionToModel(response.payLoad))
  );
}

export function retrieveTrasFormeDidWS() {
  return (
    authFetch(`${wsRegistriURL}/registroTrasversale/formeDidattiche`, {
      credentials: 'include',
    })
      .then(checkStatus)
      .then(parseJSON)
      .then((response) => response)
  );
}

export function insertTrasversalActivitiesWS(idRegistro, trasActivities) {
  return (
    authFetch(`${wsRegistriURL}/registroTrasversale/${idRegistro}/attivitaRegistrate`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'post',
      body: JSON.stringify(trasvActivityMultipleConversionFromModel(trasActivities)),
    })
      .then(checkStatus)
      .then(parseJSON)
      .then((response) => trasvActivityMultipleConversionToModel(response.payLoad))
  );
}

export function removeTrasversalActivitiesWS(idRegistro, occurrence) {
  const occurrencesToDelete = [];
  occurrencesToDelete.push(occurrence);
  return (
    authFetch(`${wsRegistriURL}/registroTrasversale/${idRegistro}/attivitaRegistrate`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'delete',
      body: JSON.stringify(trasvActivityMultipleConversionFromModel(occurrencesToDelete)),
    })
      .then(checkStatus)
      .then(parseJSON)
      .then((response) => trasvActivityMultipleConversionToModel(response.payLoad))
  );
}

export function updateTrasversalActivitiesWS(idRegistro, generatedOccurrences) {
  return (
    authFetch(`${wsRegistriURL}/registroTrasversale/${idRegistro}/attivitaRegistrate`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'put',
      body: JSON.stringify(trasvActivityMultipleConversionFromModel(generatedOccurrences)),
    })
      .then(checkStatus)
      .then(parseJSON)
      .then((response) => trasvActivityMultipleConversionToModel(response.payLoad))
  );
}
