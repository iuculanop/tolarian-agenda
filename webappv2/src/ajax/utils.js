import { connect as baseConnect } from 'react-refetch';

export function composeThen(fn1, fn2) {
  if (fn2 == null) return fn1;
  return (value, meta) => {
    const result = fn1(value, meta);
    fn2(result.value || result);
    return result;
  };
}

export function catch401s(reason, meta) {
  if (meta.response != null && meta.response.status === 401) {
    const error = Promise.reject(
      new Error(
        'Utente non autenticato o non riconosciuto. Collegarsi al sistema di autenticazione di ateneo e riprovare.'
      )
    );
    return {
      meta,
      value: error,
    };
  }
  if (meta.response != null && meta.response.status === 403) {
    //console.warn('arrivato al controllo di autorizzazione');
    const error = Promise.reject(
      {
        cause: {
          description: 'Utente non autorizzato. Collegarsi al sistema di autenticazione di ateneo altre credenziali e riprovare.'
        }
      }
    );
    return {
      meta,
      value: error,
    };
  }
  return undefined;
}

function newError(cause) {
  const e = new Error(parse(cause));
  e.cause = cause;
  return e;
}

function parse(cause) {
  const { error, message } = cause;

  if (error) {
    return error;
  } else if (message) {
    return message;
  } else {
    return '';
  }
}

export const connect = baseConnect.defaults({
  handleResponse(response) {
    if (response.status >= 200 && response.status < 300) {
      return response.json();
    } else {
      const copy = response.clone();
      const json = response.json();
      return json.then(
        (cause) => Promise.reject(newError(cause)),
        () => copy.text().then((text) => Promise.reject(new Error(text)))
      );
    }
  },
  credentials: 'include',
});

export function checkStatus(response) {
  if (response.status && response.status >= 200 && response.status < 300) {
    return response;
  }
  if (response.status && response.status >= 400 && response.status < 500) {
    console.log('DEBUG WS ', response);
    return response.json().then((x) => Promise.reject(x));
  }
  // otherwise signal the error
  const error = new Error(response.json() || 'Invalid response');
  error.response = response;
  throw error;
}

export function parseJSON(response) {
  return response.status === 204 ? { payLoad: [] } : response.json();
}