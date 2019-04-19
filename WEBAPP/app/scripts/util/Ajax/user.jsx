// import { registriWS } from 'util/AppConfig.jsx';
import { checkStatus, parseJSON } from 'util/Ajax/responseUtils.jsx';
import { wsURL } from 'util/AppConfig.jsx';
// import authFetch from 'util/Ajax/customAjaxCalls.jsx';

export function retrieveUser() {
  const authToken = sessionStorage.getItem('token') || '';
  return (
    fetch(`${wsURL}/userInfo`, {
      headers: new Headers({
        Authorization: `Bearer ${authToken}`,
      }),
    })
      .then(checkStatus)
      .then(parseJSON)
      .then((response) => response.payLoad)
  );
}

export function authenticateUserWS(userId, password) {
  const credentials = {
    username: userId,
    password,
  };
  return (
    fetch(`${wsURL}/login`, {
      headers: {
        'Content-type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(credentials),
    })
      .then(checkStatus)
      .then(parseJSON)
  );
}

export function viewUserWS(userId) {
  const authToken = sessionStorage.getItem('token') || '';
  return (
    fetch(`${wsURL}/profile/${userId}`, {
      headers: new Headers({
        Authorization: `Bearer ${authToken}`,
      }),
    })
      .then(checkStatus)
      .then(parseJSON)
      .then((response) => response.payLoad)
  );
}
