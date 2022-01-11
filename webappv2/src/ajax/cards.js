import { api } from '../AppConfig';

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
    catch: catch401s,
  },
  sets: {
    url: api.card().sets().href,
  },
  search: (resolve,reject, cardName, setCode) => ({
    searchedCards: {
      url: api.card().search(cardName, setCode).href,
      method: 'GET',
      then: resolve,
      catch: reject,
      force: true,
    }
  }),
}));

export default ajaxCards;