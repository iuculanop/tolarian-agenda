export function hourStartValidator(value) {
  const response = { isValid: true, notification: { type: 'success', msg: '', title: '' } };
  const isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(value);
  if (!isValid) {
    response.isValid = false;
    response.notification.type = 'error';
    response.notification.msg = 'il formato deve essere hh:mm.(es. 09:00)';
    response.notification.title = 'Valore non ammissibile';
  }
  return response;
}

export function durationValidator(value) {
  const response = { isValid: true, notification: { type: 'success', msg: '', title: '' } };
  // controllo che le lezioni non durino piu di otto ore e che l unita di misura minima e mezzora
  const isValid = /^[-+]?(([0-8])|[0-8],+([0,5])?|[0,5])$/.test(value.toString().replace('.', ','));
  if (!isValid) {
    response.isValid = false;
    response.notification.type = 'error';
    response.notification.msg = 'il formato della durata deve essere in ore \n' +
                                '(es. 2,5 per due ore e mezza)';
    response.notification.title = 'Valore non ammissibile';
  }
  return response;
}

export function roomValidator(value) {
  const response = { isValid: true, notification: { type: 'success', msg: '', title: '' } };
  if (!value) {
    response.isValid = false;
    response.notification.type = 'error';
    response.notification.msg = 'Si prega di inserire l\'aula';
    response.notification.title = 'Campo obbligatorio';
  }
  return response;
}

export function formaDidValidator(value) {
  const response = { isValid: true, notification: { type: 'success', msg: '', title: '' } };
  if (!value || value === '') {
    response.isValid = false;
    response.notification.type = 'error';
    response.notification.msg = 'Si prega di selezionare la forma didattica';
    response.notification.title = 'Campo obbligatorio';
  }
  return response;
}
