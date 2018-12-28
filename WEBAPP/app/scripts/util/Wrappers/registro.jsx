import moment from 'moment';
import _ from 'lodash';
import { aoObjectOf, sumArrayValues } from 'util/ArrayUtils.jsx';
import { decodeText } from 'util/EncodeUtils.jsx';
import { htmlEscape } from 'util/Formatters.jsx';

function registryFilterUnique(response) {
  return _.uniqBy(response, 'insegnamento.idCopertura');
}

export function fixAbsences(arrAbsences) {
  // creo array associativo iniziale
  const assArray = {
    LAL: {
      ore: 0,
      index: false,
    },
    LUF: {
      ore: 0,
      index: false,
    },
    LSA: {
      ore: 0,
      index: false,
    },
    EAL: {
      ore: 0,
      index: false,
    },
    EUF: {
      ore: 0,
      index: false,
    },
    ESA: {
      ore: 0,
      index: false,
    },
  };
  const fixedArray = _.cloneDeep(arrAbsences);
  // recupero il computo delle ore di assenza per tipologia di motivazione
  for (let i = 0; i < arrAbsences.length; i++) {
    switch (arrAbsences[i].codice) {
      case 'LAL':
        assArray.LAL.ore += arrAbsences[i].ore;
        assArray.LAL.index = i;
        break;
      case 'EAL':
        assArray.EAL.ore += arrAbsences[i].ore;
        assArray.EAL.index = i;
        break;
      case 'LUF':
        assArray.LUF.ore += arrAbsences[i].ore;
        assArray.LUF.index = i;
        break;
      case 'EUF':
        assArray.EUF.ore += arrAbsences[i].ore;
        assArray.EUF.index = i;
        break;
      case 'LSA':
        assArray.LSA.ore += arrAbsences[i].ore;
        assArray.LSA.index = i;
        break;
      case 'ESA':
        assArray.ESA.ore += arrAbsences[i].ore;
        assArray.ESA.index = i;
        break;
      default:
        // do nothing
    }
  }

  // rielaboro le ore di LAL
  if (assArray.LAL.ore > 0) {
    fixedArray[assArray.LAL.index].ore = assArray.LAL.ore + assArray.EAL.ore;
    if (assArray.EAL.index) {
      fixedArray[assArray.EAL.index].ore = 0;
    }
  } else {
    if (assArray.EAL.ore > 0) {
      const newAbsence = {
        codFormaDidattica: 'LEZ',
        codice: 'LAL',
        descrizione: 'Lezioni non tenute per altri motivi',
        descrizioneFormaDidattica: 'Lezione Frontale',
        ore: assArray.EAL.ore,
      };
      fixedArray.push(newAbsence);
      fixedArray[assArray.EAL.index].ore = 0;
    }
  }

  // rielaboro le ore di LSA
  if (assArray.LSA.ore > 0) {
    fixedArray[assArray.LSA.index].ore = assArray.LSA.ore + assArray.ESA.ore;
    if (assArray.ESA.index) {
      fixedArray[assArray.ESA.index].ore = 0;
    }
  } else {
    if (assArray.ESA.ore > 0) {
      const newAbsence = {
        codFormaDidattica: 'LEZ',
        codice: 'LSA',
        descrizione: 'Lezioni non tenute per motivi di salute',
        descrizioneFormaDidattica: 'Lezione Frontale',
        ore: assArray.ESA.ore,
      };
      fixedArray.push(newAbsence);
      fixedArray[assArray.ESA.index].ore = 0;
    }
  }

  // rielaboro le ore di LUF
  if (assArray.LUF.ore > 0) {
    fixedArray[assArray.LUF.index].ore = assArray.LUF.ore + assArray.EUF.ore;
    if (assArray.EUF.index) {
      fixedArray[assArray.EUF.index].ore = 0;
    }
  } else {
    if (assArray.EUF.ore > 0) {
      const newAbsence = {
        codFormaDidattica: 'LEZ',
        codice: 'LUF',
        descrizione: 'Lezioni non tenute per impegni di ufficio',
        descrizioneFormaDidattica: 'Lezione Frontale',
        ore: assArray.EUF.ore,
      };
      fixedArray.push(newAbsence);
      fixedArray[assArray.EUF.index].ore = 0;
    }
  }

  return fixedArray;
}

export function registryConvertToModel(registry) {
  const registro = {};
  if (registry.daCreare) {
    registro.idRegistro = null;
    registro.stato = null;
    registro.oreRegistrate = [];
  } else {
    registro.idRegistro = registry.idRegistro;
    registro.stato = registry.stato;
    registro.oreRegistrate = registry.formeDidatticheRegistrate;
  }
  /*
  if (registry.insegnamento.descrEdizione) {
    registro.descEdizione = registry.insegnamento.descrEdizione;
  } else {
    registro.descEdizione = 'Edizione Unica';
  }
  */
  if (registry.RiepilogoDettagliAttivita) {
    registro.oreGiustificate = fixAbsences(registry.RiepilogoDettagliAttivita);
  } else {
    registro.oreGiustificate = [];
  }
  if (registry.annotazioni) {
    registro.annotazioni = htmlEscape(decodeText(registry.annotazioni));
  } else {
    registro.annotazioni = '';
  }
  if (registry.insegnamento.dataChiusuraCopertura) {
    const dateWrapped = moment(registry.insegnamento.dataChiusuraCopertura);
    registro.dataChiusuraCopertura = dateWrapped.format('L');
    registro.descChiusuraCopertura = registry.insegnamento.descrChiusuraCopertura;
  } else {
    registro.dataChiusuraCopertura = null;
    registro.descChiusuraCopertura = null;
  }
  registro.idCopertura = registry.insegnamento.idCopertura;
  registro.trasversale = registry.trasversale;
  registro.annoAccademico = registry.insegnamento.annoAccademico;
  registro.codAF = registry.insegnamento.codiceAttivitaFormativa;
  registro.descAF = registry.insegnamento.descrAttivitaFormativa;
  registro.codEdizione = `${registry.insegnamento.codiceEdizione}
                       - ${registry.insegnamento.descrEdizione || 'Edizione unica'}`;
  registro.codEdizioneSmall = registry.insegnamento.codiceEdizione;
  registro.codCDL = registry.insegnamento.codiceCdl;
  registro.descCDL = registry.insegnamento.descrCdl;
  if (registry.insegnamento.descrTurno) {
    registro.descTurno = decodeText(registry.insegnamento.descrTurno);
  } else {
    registro.descTurno = registry.insegnamento.descrTurno;
  }
  if (registry.insegnamento.descrModulo) {
    registro.descModulo = decodeText(registry.insegnamento.descrModulo);
  } else {
    registro.descModulo = registry.insegnamento.descrModulo;
  }
  registro.descFD = registry.insegnamento.formeDidattiche;
  registro.descCopertura = registry.insegnamento.descrModalitaCopertura;
  registro.orePreviste = registry.insegnamento.formeDidattiche;
  registro.descInsegnamento = registry.insegnamento.descrAttivitaFormativa;
  registro.totaliRegistrate = sumArrayValues(registry.formeDidatticheRegistrate, 'oreRegistrate');
  registro.totaliAssegnate = sumArrayValues(registry.insegnamento.formeDidattiche, 'oreDocente');
  return registro;
}

export function registryMultipleConversion(response) {
  const registri = [];
  const filteredResponse = registryFilterUnique(response);
  for (let i = 0; i < filteredResponse.length; i++) {
    registri.push(registryConvertToModel(filteredResponse[i]));
  }
  return registri;
}

export function programConvertToModel(response) {
  const program = aoObjectOf(response, true, 'frequentanti');
  return program;
}
