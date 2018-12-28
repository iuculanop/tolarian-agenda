import moment from 'moment';
import authFetch from 'util/Ajax/customAjaxCalls.jsx';
import { registriWS, didatticaWS } from 'util/AppConfig.jsx';
import { checkStatus, parseJSON } from 'util/Ajax/responseUtils.jsx';
import { registryConvertToModel,
         registryMultipleConversion,
         programConvertToModel,
         fixAbsences,
} from 'util/Wrappers/registro.jsx';

moment.locale('it');

// setting base urls for webservices
const wsRegistriURL = registriWS;
const wsDidatticaURL = didatticaWS;

// VRGCTR59D09F205S
// VLTSFN75H03F133K la nostra cavia preferita
// RGMVCL61R23F078E ha registri con piu forme didattiche
// BRNTZN47B45F205S
// LCCCLD73D15C139J
// CLMMNL67L69F205X
// LCNDNL65M50F205X
// STRBCI76E63D122E docente che ha assenze giustificate
export function retrieveEduRecsWS(year) {
  return (
    authFetch(`${wsRegistriURL}/registro/${year}/elenco`, {
      credentials: 'include',
    })
      .then(checkStatus)
      .then(parseJSON)
      .then((response) => registryMultipleConversion(response.payLoad))
  );
}

export function createEduRecWS(idCopertura) {
  return (
    authFetch(`${wsRegistriURL}/registro/creaRegistro/${idCopertura}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'post',
    })
      .then(checkStatus)
      .then(parseJSON)
      .then((response) => registryConvertToModel(response.payLoad))
  );
}

export function retrieveEduRecWS(id) {
  // const registryId = parseInt(id, 10);
  return (
    authFetch(`${wsRegistriURL}/registro/${id}`, {
      credentials: 'include',
    })
      .then(checkStatus)
      .then(parseJSON)
      .then((response) => registryConvertToModel(response.payLoad))
  );
}

export function openEduRecWS(idRegistro) {
  const openedEduRec = {
    idRegistro,
    stato: 'N',
  };
  return (
    authFetch(`${wsRegistriURL}/registro/${idRegistro}/stato`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'put',
      body: JSON.stringify(openedEduRec),
    })
      .then(checkStatus)
      .then(parseJSON)
      .then((response) => registryConvertToModel(response.payLoad))
  );
}

export function closeEduRecWS(idRegistro) {
  const closedEduRec = {
    idRegistro,
    stato: 'C',
  };
  return (
    authFetch(`${wsRegistriURL}/registro/${idRegistro}/stato`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'put',
      body: JSON.stringify(closedEduRec),
    })
      .then(checkStatus)
      .then(parseJSON)
      .then((response) => registryConvertToModel(response.payLoad))
  );
}

export function deleteEduRecWS(idRegistro) {
  return (
    authFetch(`${wsRegistriURL}/registro/${idRegistro}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'delete',
    })
      .then(checkStatus)
  );
}

export function updateEduRecAnnotationWS(idRegistro, notes) {
  const EduRecNotes = {
    idRegistro,
    annotazioni: notes,
  };
  return (
    authFetch(`${wsRegistriURL}/registro/${idRegistro}/annotazioni`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'put',
      body: JSON.stringify(EduRecNotes),
    })
      .then(checkStatus)
      .then(parseJSON)
      .then((response) => registryConvertToModel(response.payLoad))
  );
}

export function callRegistryAbsencesWS(idRegistro, absences, method) {
  return (
    authFetch(`${wsRegistriURL}/registro/${idRegistro}/riepilogoDettaglioAttivita`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: `${method}`,
      body: JSON.stringify(absences),
    })
      .then(checkStatus)
      .then(parseJSON)
      .then((response) => response)
  );
}

export function updateRegistryAbsencesWS(idRegistro, absences) {
  // riorganizzo le assenze per chiamate al WS
  const absencesPut = [];
  const absencesDel = [];
  const absencesPost = [];
  for (let i = 0; i < absences.length; i++) {
    if (absences[i].idRiep) {
      if (absences[i].ore > 0) {
        absencesPut.push(absences[i]);
      } else {
        absencesDel.push(absences[i]);
      }
    } else {
      absencesPost.push(absences[i]);
    }
  }
  return Promise.all([callRegistryAbsencesWS(idRegistro, absencesPut, 'put'),
              callRegistryAbsencesWS(idRegistro, absencesPost, 'post'),
              callRegistryAbsencesWS(idRegistro, absencesDel, 'delete')])
                .then(() =>
                  authFetch(`${wsRegistriURL}/registro/${idRegistro}/riepilogoDettaglioAttivita`, {
                    credentials: 'include',
                  })
             .then(checkStatus)
             .then(parseJSON)
             .then((response) => fixAbsences(response.payLoad))
           );
}

// CON WEBSERVICES DIDATTICA
export function retrieveProgram(year, codCDL, codEd) {
  return (
    fetch(`${wsDidatticaURL}/programmaDidattico/${year}%2F${codCDL}/${codEd}`)
      .then(checkStatus)
      .then(parseJSON)
      .then((response) => programConvertToModel(response.programmi))
  );
}
