// importing actionTypes
import { USER } from 'actions/actionTypes.js';

function getToken() {
  const cookie = document.cookie;
  const idOf = cookie.indexOf('CASTGC');
  return (cookie && idOf > -1);
}

// setting initial state
const initialState = {
  data: {},
  otherData: {},
  isLoaded: false,
  isAuthenticated: false,
  hasToken: getToken(),
};

const utente = (state = initialState, action) => {
  switch (action.type) {
    case USER.FETCH_COMPLETED:
      if (!action.payload.error) {
        return {
          ...state,
          data: action.payload,
          isLoaded: true,
          isAuthenticated: true,
        };
      }
      return {
        ...state,
        isAuthenticated: false,
      };
    case USER.AUTHENTICATED: {
      console.log('debug authenticateUser', action.payload);
      sessionStorage.setItem('token', action.payload.Token);
      return {
        ...state,
        data: action.payload,
        isAuthenticated: true,
      };
    }
    case USER.NOT_AUTHENTICATED:
      return {
        ...state,
        data: {},
        isAuthenticated: false,
      };
    case USER.VIEW:
      return {
        ...state,
        otherData: {},
      };
    case USER.VIEW_COMPLETED:
      return {
        ...state,
        otherData: action.payload,
      };
    default:
      return state;
  }
};

export default utente;
