import { api } from '../AppConfig';
import { getToken, setUserSession } from '../utils/common';

import { connect, catch401s } from './utils';

const ajaxMe = connect(() => ({
  me: {
    url: api.me().href,
    headers: {
      Authorization: 'Bearer ' + getToken(),
    },
    // then: removeTicket,
    catch: catch401s,
  },
  login: (resolve,reject, uc) => ({
    loginData: {
      url: api.meLogin(uc).href,
      method: 'POST',
      body: JSON.stringify({ ...uc }),
      andThen: response => {
        setUserSession(response.payLoad.Token,response.payLoad.id_name);
        return {
          me: {
            url: api.me().href,
            headers: {
              Authorization: 'Bearer ' + getToken(),
            },
            then: resolve,
            catch: reject,
            force: true,
            refreshing: true,
          },
      }},
      catch: reject,
      force: true,
    }
  }),
}));

export default ajaxMe;