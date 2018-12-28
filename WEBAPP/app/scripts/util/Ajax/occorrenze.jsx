import moment from 'moment';
import authFetch from 'util/Ajax/customAjaxCalls.jsx';
import { registriWS } from 'util/AppConfig.jsx';
import { checkStatus, parseJSON } from 'util/Ajax/responseUtils.jsx';
import { activityMultipleConversionToModel,
         activityMultipleConversionFromModel,
} from 'util/Wrappers/occorrenze.jsx';

moment.locale('it');

// setting base urls for webservices
const wsRegistriURL = registriWS;

export function retrieveRegistryOccurrencesWS(idRegistro) {
  return (
    authFetch(`${wsRegistriURL}/registro/${idRegistro}/attivitaRegistrate`, {
      credentials: 'include',
    })
      .then(checkStatus)
      .then(parseJSON)
      .then((response) => activityMultipleConversionToModel(response.payLoad))
  );
}

export function updateRegistryOccurrencesWS(idRegistro, generatedOccurrences) {
  return (
    authFetch(`${wsRegistriURL}/registro/${idRegistro}/attivitaRegistrate`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'put',
      body: JSON.stringify(activityMultipleConversionFromModel(generatedOccurrences)),
    })
      .then(checkStatus)
      .then(parseJSON)
      .then((response) => activityMultipleConversionToModel(response.payLoad))
  );
}

export function insertRegistryOccurrencesWS(idRegistro, generatedOccurrences) {
  return (
    authFetch(`${wsRegistriURL}/registro/${idRegistro}/attivitaRegistrate`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'post',
      body: JSON.stringify(activityMultipleConversionFromModel(generatedOccurrences)),
    })
      .then(checkStatus)
      .then(parseJSON)
      .then((response) => activityMultipleConversionToModel(response.payLoad))
  );
}

export function removeRegistryOccurrencesWS(idRegistro, occurrence) {
  const occurrencesToDelete = [];
  occurrencesToDelete.push(occurrence);
  return (
    authFetch(`${wsRegistriURL}/registro/${idRegistro}/attivitaRegistrate`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'delete',
      body: JSON.stringify(activityMultipleConversionFromModel(occurrencesToDelete)),
    })
      .then(checkStatus)
      .then(parseJSON)
      .then((response) => activityMultipleConversionToModel(response.payLoad))
  );
}
