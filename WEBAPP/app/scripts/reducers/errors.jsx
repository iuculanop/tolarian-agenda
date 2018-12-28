// setting initial state
const initialState = {
  hasError: false,
  message: '',
};

const errore = (state = initialState, action) => {
  switch (action.type) {
    case 'WEBSERVICE_DOWN':
      return {
        ...state,
        message: action.payload,
        hasError: true,
      };
    case 'WEBSERVICE_ERROR':
      return {
        ...state,
        message: action.payload,
        hasError: true,
      };
    default:
      return state;
  }
};

export default errore;
