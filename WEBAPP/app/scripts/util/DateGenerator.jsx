// Funzione di servizio per aggiungere o togliere X giorni a una data.
function addDays(date, days) {
  const result = new Date(date);
  result.setTime(result.getTime() + days * 24 * 60 * 60 * 1000);
  return result;
}

// Funzione di servizio per controllare se una certa data, in formato date,
// è o no in un array di date in formato date.valueof (cioè i millisecondi dal 1970)
function checkblackdates(date, blackdays) {
  const trovato = blackdays.indexOf(date.valueOf());
  if (trovato === -1) {
    return false;
  }
  return true;
}

// Funzione di servizio per trovare la data della Pasqua
function trovapasqua(year) {
  const a = (year / 100 | 0) * 1483 - (year / 400 | 0) * 2225 + 2613;
  const b = ((year % 19 * 3510 + (a / 25 | 0) * 319) / 330 | 0) % 29;
	// return 56 - b - ((year * 5 / 4 | 0) + a - b) % 7;
  const c = 148 - b - ((year * 5 / 4 | 0) + a - b) % 7;
  const month = (c / 31 | 0) - 1;
  const day = (c % 31 + 1);
  const pasqua = new Date(year, month, day);
  // let pasqua=''+year+'-'+month+'-'+day;
  return pasqua;
}

// Funzione di servizio per caricare le date escluse qualunque sia l'anno.
// QUESTE ANDRANNO POI RECUPERATE DA UN FILE ESTERNO (CON CHIAMATA SINCRONA)
function dateesclusegenerali() {
  const dateoutgenerali = [
    '01-01',
    '01-02',
    '01-03',
    '01-04',
    '01-05',
    '01-06',
    '04-25',
    '05-01',
    '06-02',
    '11-01',
    '12-07',
    '12-08',
    '12-24',
    '12-25',
    '12-26',
    '12-27',
    '12-28',
    '12-29',
    '12-30',
    '12-31',
  ];
  return dateoutgenerali;
}

// Funzione di servizio per caricare le date escluse per specifici anni.
// QUESTE ANDRANNO POI RECUPERATE DA UN FILE ESTERNO (CON CHIAMATA SINCRONA)
function dateescluseanno() {
  const dateoutanno = [
    '2016-01-13', // Ad esempio eslcudo il 13 gennaio
  ];
  return dateoutanno;
}


// Funzione per trovare le date
function trovadate(datastart, dataend, giornisettimana) {
	// INPUT:
	// datastart: data iniziale in formato stringa YYYY-MM-DD
	// dataend: data fine in formato stringa YYYY-MM-DD
	// giornisettimane: array con i giorni della settimana da prendere.
  // Es: [1,3,5] per dire lunedì, mercoledì e venerdì


	// CONVERTO LE STRINGHE CON DATASTART E DATAEND IN OGGETTI DATA
  const startdate = new Date(datastart);
  const enddate = new Date(dataend);
  const ngiorni = giornisettimana.length;

	// QUI DI SEGUITO LE DATE CHE VANNO ESCLUSE QUALUNQUE SIA L'ANNO.
  const dateoutgenerali = dateesclusegenerali();

	// ORA ALLE DATE DA ESCLUDERE AGGIUNGO L'ANNO, METTENDO GLI ANNI INTERESSANTI
  // PER IL PERIODO IN QUESTIONE, OSSIA QUELLI COMPRESI FRA L'ANNO DI STARTDATE E QUELLO DI ENDDATE
  const dateout = [];
  // const ndateout = dateoutgenerali.length;

  const startyear = startdate.getFullYear();
  const endyear = enddate.getFullYear();

  for (let dyear = 0; dyear <= (endyear - startyear); dyear++) {
    for (let indice = 0; indice < dateoutgenerali.length; indice++) {
      dateout.push(`${startyear + dyear}-${dateoutgenerali[indice]}`);
    }
  }

	// ORA AGGIUNGO LE DATE CHE VANNO ESCLUSE PER UN ANNO SPECIFICO
  const dateoutanno = dateescluseanno();
  for (let indice = 0; indice < dateoutanno.length; indice++) {
    dateout.push(dateoutanno[indice]);
  }


	// ORA CONVERTO I GIORNI DA ESCLUDERE IN FORMATO DATE
  const blackdays = [];
  for (let indice = 0; indice < dateout.length; indice++) {
    const singledate = new Date(dateout[indice]);
    blackdays.push(singledate.valueOf());
  }

	// ORA AGGIUNGO AI GIORNI DA ESCLUDERE IN FORMATO DATE PASQUETTA
  // E VENERDI' PRIMA DEL CARNEVALE AMBROSIANO
  for (let dyear = 0; dyear <= (endyear - startyear); dyear++) {
    const pasqua = trovapasqua(startyear + dyear); // Mi restituisce la pasqua come oggetto date
    const pasquetta = addDays(pasqua, 1);
    blackdays.push(pasquetta.valueOf());
    const carnevale = addDays(pasqua, -44);
    // MI dovrebbe restituire il venerdì prima del carnevale ambrosiano
    blackdays.push(carnevale.valueOf());
  }


	// Prima credo l'array con la prima settimana, che poi incrementerò
  // alle settimane successive fino a superare la enddate
  const settimanabase = [];
  const giornitrovati = [];
  let arrivatofine = false;

  for (let i = 0; i < 7; i++) {
    const testdate = addDays(startdate, i);
    const giornosettimana = testdate.getDay();
    // Questo mi dice il giorno della settimana
    const trovato = giornisettimana.indexOf(giornosettimana);

    if (trovato > -1) {
      // Ossia se era un giorno della settimana da prendere
      if (testdate.valueOf() <= enddate.valueOf()) {
        // Devo controllare di non aver già passato la data di fine
        settimanabase.push(testdate);
        const dataesclusa = checkblackdates(testdate, blackdays);
        // QUI CONTROLLO SE LA DATA E' ESCLUSA
        if (!dataesclusa) giornitrovati.push(testdate);
      } else arrivatofine = true;
    }
  }

	// return settimanabase;

	// Ora vado avanti a sommare 7 giorni ai giorni della settimana base,
  // fino a quando non supero la data di fine
  while (!arrivatofine) {
    for (let i = 0; i < ngiorni; i++) {
      const testdate = addDays(settimanabase[i], 7);
      if (testdate.valueOf() <= enddate.valueOf()) {
        const dataesclusa = checkblackdates(testdate, blackdays);
        // QUI CONTROLLO SE LA DATA E' ESCLUSA
        if (!dataesclusa) giornitrovati.push(testdate);
        settimanabase[i] = testdate;
      } else {
        arrivatofine = true;
        break;
      }
    }
  }

  return giornitrovati;
}

// Funzione che converte un array associativo di occorrenze in base giornaliera
// in un array unico di occorrenze
function adaptDays(multiArray) {
  const unifiedOccurrences = [];
  const keys = Object.keys(multiArray);
  let dayNum;

  for (let index = 0; index < keys.length; index++) {
    const day = keys[index];
    switch (day) {
      case 'monday':
        dayNum = 1;
        break;
      case 'tuesday':
        dayNum = 2;
        break;
      case 'wednesday':
        dayNum = 3;
        break;
      case 'thursday':
        dayNum = 4;
        break;
      case 'friday':
        dayNum = 5;
        break;
      case 'saturday':
        dayNum = 6;
        break;
      case 'sunday':
        dayNum = 0;
        break;
      default:
        dayNum = 0;
        break;
    }
    const dayOccurrences = multiArray[day];
    for (let occ = 0; occ < dayOccurrences.length; occ++) {
      const occurrence = {};
      occurrence.giorno = dayNum;
      occurrence.orainizio = dayOccurrences[occ].hourStart;
      occurrence.durata = dayOccurrences[occ].duration;
      occurrence.aula = dayOccurrences[occ].room;
      occurrence.sede = dayOccurrences[occ].place;
      occurrence.idFormaDid = dayOccurrences[occ].idFormaDid;
      occurrence.argomento = '';
      unifiedOccurrences.push(occurrence);
    }
  }
  return unifiedOccurrences;
}

// Funzione che incapsula quella per trovare le date in modo che vengano aggiunti
// anche tutti gli altri dati necessari alla generazione delle righe per il registro
function generateDate(datastart, dataend, giorniedati) {
  // Ora mi devo preoccupare di convertire i due oggetti Date in stringa
  const dataStartString = datastart.toISOString().substring(0, 10);
  const dataEndString = dataend.toISOString().substring(0, 10);

  // A partire dall'oggettone che mi arriva dalla form di inserimento creo una lookup table
  // per accederci a partire dal giorno della settimana
	// Inoltre creo l'array giornisettimana con solo i giorni della settimana che
  // mi interessano e nient'altro (Es. [1,3,5]), che mi servirà per lanciare la funzione trovadate
  const lookupgiorniedati = {};
  const giornisettimana = [];
  for (let i = 0, len = giorniedati.length; i < len; i++) {
    if (!lookupgiorniedati[giorniedati[i].giorno]) {
      lookupgiorniedati[giorniedati[i].giorno] = [];
      giornisettimana.push(giorniedati[i].giorno);
    }
    lookupgiorniedati[giorniedati[i].giorno].push(giorniedati[i]);
    // lookupgiorniedati[giorniedati[i].giorno] = giorniedati[i];
  }


	// Lancio la funzione che mi restituisce l'array con le varie date generate
  const giornitrovati = trovadate(dataStartString, dataEndString, giornisettimana);


	// Creo l'array di oggetti, in cui ciascun oggetto oltre a contenere la data con
  // sistemato l'orario contiene anche le altre informazioni necessarie per
  // generare la riga del registro
  const risultato = [];
  for (let indice = 0; indice < giornitrovati.length; indice++) {
    const data = giornitrovati[indice];
    const giorno = giornitrovati[indice].getDay();
    // Leggo il giorno della settimana

    for (let sottoindice = 0; sottoindice < lookupgiorniedati[giorno].length; sottoindice++) {
      const riga = {};
      riga.data = new Date(data.getTime());

      const orainizio = lookupgiorniedati[giorno][sottoindice].orainizio;
      // Leggo orario di inizio, e poi dovrò separare ore e minuti
      riga.data.setHours(orainizio.split(':')[0], orainizio.split(':')[1], 0, 0);
      riga.aula = lookupgiorniedati[giorno][sottoindice].aula;
      riga.sede = lookupgiorniedati[giorno][sottoindice].sede;
      riga.durata = lookupgiorniedati[giorno][sottoindice].durata;
      riga.idFormaDid = lookupgiorniedati[giorno][sottoindice].idFormaDid;
      riga.argomento = lookupgiorniedati[giorno][sottoindice].argomento;
      riga.stato = 'N';
      risultato.push(riga);
    }
  }

  risultato.sort((a, b) => a.data.getTime() - b.data.getTime());
  // Ordino le date, serve solo nel caso di due lezioni lo stesso giorno
  // se era stata inserita prima quella del pomeriggio

  return risultato;
}

export function generateDateFromUser(startDate, endDate, occurrences) {
  const convertedOcc = adaptDays(occurrences);
  const res = generateDate(startDate, endDate, convertedOcc);
  return res;
}

/* NOTA: datastart,dataend e giorniedati SARANNO IL RISULTATO DI UNA FORM DI INSERIMENTO
const datastart = '2015-12-01';
const dataend = '2016-01-22';

const giorniedati = [
  {
    giorno: 1,
    aula: 'Aula 701',
    sede: 'Via Colombo 46',
    orainizio: '11:30',
    durata: 2,
    idforma: 1,
    argomento: '',
  },
  {
    giorno: 3,
    aula: 'Aula 701',
    sede: 'Via Colombo 46',
    orainizio: '11:00',
    durata: 2,
    idforma: 1,
    argomento: 'Mattina',
  },
  {
    giorno: 3,
    aula: 'Aula 701POM',
    sede: 'Via Colombo 46POM',
    orainizio: '16:30',
    durata: 2,
    idforma: 1,
    argomento: 'Pomeriggio',
  },
];

const dategenerate = generadate(datastart, dataend, giorniedati);
*/
