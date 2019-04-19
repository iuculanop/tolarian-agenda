import { checkStatus, parseJSON } from 'util/Ajax/responseUtils.jsx';
import { wsURL } from 'util/AppConfig.jsx';

export function retrieveAllSetsWS() {
  const authToken = sessionStorage.getItem('token') || '';
  return (
    fetch(`${wsURL}/sets`, {
      headers: new Headers({
        Authorization: `Bearer ${authToken}`,
      }),
      method: 'GET',
    })
      .then(checkStatus)
      .then(parseJSON)
  );
}
