export function checkStatus(response) {
  console.log('debug checkStatus response=', response);
  if (response.status && response.status >= 200 && response.status < 300) {
    return response;
  }
  if (response.status && response.status === 400) {
    return response.json().then((x) => Promise.reject(x));
  }
  // otherwise signal the error
  const error = new Error('Invalid response');
  error.response = response;
  throw error;
}

export function parseJSON(response) {
  return response.status === 204 ? { payLoad: [] } : response.json();
}
