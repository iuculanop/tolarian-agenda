import QS from './QueryString.jsx';

import { ENTRYPOINTS } from 'constants';

function checkStatus(response) {
  if (response.status && response.status >= 200 && response.status < 300) {
    return response;
  } // otherwise signal the error
  const error = new Error(response.statusText || 'Invalid response');
  error.response = response;
  throw error;
}

function parseJSON(response) {
  return response.json();
}

function wait(duration) {  // eslint-disable-line no-unused-vars
  function realWait(...theArgs) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(...theArgs),
                 duration);
    });
  }
  return realWait;
}


export function retrieveEvents(params) {
  return (
    fetch(`${ENTRYPOINTS.EVENTS}/?${QS.stringify(params)}`)
//      .then(wait(1500))
      .then(checkStatus)
      .then(parseJSON)
      .then((response) => {
        if (!response.Event) return { EventIds: [] };
        const EventIds = response.Event.map((event) => event.Id);
        return { EventIds };
      })
  );
}

export function retrieveEvent(eventId) {
  return (
    fetch(`${ENTRYPOINTS.EVENTS}/event?idevento=${eventId}`)
//      .then(wait(2000 * Math.random() + 400))
      .then(checkStatus)
      .then(parseJSON)
      .then((response) => {
//        if (Math.random() > 0.98) throw new Error('Network error (SIMULATED!!)');
        if (!response || !response.Event || !response.Event[0]) {
          throw new Error(`Impossible to fetch event ${eventId}. ` +
                          `Received: ${JSON.stringify(response)}`);
        } // else
        if (response.Event[0].Id !== eventId) {
          throw new Error('Returned an event with a different ID. ' +
                          `Searched: "${eventId}" ` +
                          `Received: "${response.Event[0].Id || 'NO ID'}"`);
        } // else
        return response.Event[0];
      })
  );
}
