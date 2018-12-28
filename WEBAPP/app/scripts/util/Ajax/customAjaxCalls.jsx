let myStore = null;

export function configureAjax(store) {
  myStore = store;
}

function isDown(response) {
  myStore.dispatch({
    type: 'WEBSERVICE_DOWN',
    payload: {
      title: 'Servizi non disponibili',
      body: `I servizi sono momentaneamente non disponibili,
 verificare la connessione di rete e/o riprovare più tardi`,
    },
  });
  return response;
}

function isAuthenticated(response) {
  if (response.status && (response.status === 401 || response.status === 403)) {
    myStore.dispatch({
      type: 'USER_NOT_AUTHENTICATED',
    });
  }
  return response;
}

function hasError(response) {
  if (response.status && response.status === 500) {
    myStore.dispatch({
      type: 'WEBSERVICE_ERROR',
      payload: {
        title: 'Errore imprevisto',
        body: 'È stato rilevato un errore.' +
'Contattare l\'assistenza all\'indirizzo registri.docenti@unimi.it.',
      },
    });
  }
  return response;
}

// customized fetch with fiscal code, needed when super user logs in as another user
// TODO: add queryParams management
export default function authFetch(url, configs) {
  // if the store is not consistent, return the normal fetch
  if (myStore === null) {
    return (
      fetch(url, configs)
    );
  }
  return (
    fetch(url, configs)
    .catch(isDown)
    .then(isAuthenticated)
    .then(hasError)
  );
}
