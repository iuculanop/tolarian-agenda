import { api } from '../AppConfig';
import { getToken, setUserSession } from '../utils/common';
import { connect, catch401s } from './utils';

const getCards = (resolve, reject) => () => ({
  collection: {
    url: api.card().collected().href,
    then: resolve,
    catch: reject,
    refreshing: true,
    force: true,
  },
});

const ajaxCards = connect(() => ({
  collection: {
    url: api.card().collected().href,
    headers: {
      Authorization: 'Bearer ' + getToken(),
    },
    catch: catch401s,
  },
  sets: {
    url: api.card().sets().href,
  },
  search: (resolve,reject, cardName, setCode) => ({
    searchResults: {
      url: api.card().search(cardName, setCode).href,
      method: 'GET',
      then: resolve,
      catch: reject,
      force: true,
    }
  }),
  addCard: (resolve, reject, cardInfo) => ({
    collection: {
      url: api.card().addCard().href,
      headers: {
        Authorization: 'Bearer ' + getToken(),
      },
      method: 'POST',
      body: JSON.stringify({...cardInfo}),
      then: resolve,
      catch: reject,
      force: true,
    }
  })
}));

export default ajaxCards;