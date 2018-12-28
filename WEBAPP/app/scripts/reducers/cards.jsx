import { CARDS } from 'actions/actionTypes.js';

const initialState = {
  filterValues: {
    name: '',
    setCode: '',
    id: '',
  },
  cardDetails: {},
  list: [],
  loading: false,
  viewMode: 'table',
  paginationInfo: {},
};

const cards = (state = initialState, action) => {
  switch (action.type) {
    case CARDS.FETCH:
      // TODO: aggiungere controllo per verificare se filterValues viene dalla
      // ricerca oppure se dalla pagina di dettaglio della carta. Se viene da
      // carta non va salvato nello stato
      return {
        ...state,
        list: [],
        filterValues: action.payload,
        paginationInfo: {},
        loading: true,
      };
    case CARDS.FETCH_COMPLETED: {
      if (action.error) {
        return {
          ...state,
          list: [],
          paginationInfo: {},
          loading: false,
        };
      }
      return {
        ...state,
        list: action.payload.payLoad,
        loading: false,
        paginationInfo: {},
      };
    }
    case CARDS.CHANGE_VIEW:
      return {
        ...state,
        viewMode: action.payload,
      };
    case CARDS.FETCH_DETAIL:
      return {
        ...state,
        cardDetails: {},
      };
    case CARDS.FETCH_DETAIL_COMPLETED:
      if (action.error) {
        return {
          ...state,
          cardDetails: {},
        };
      }
      return {
        ...state,
        cardDetails: action.payload.payLoad,
      };
    default:
      return state;
  }
};

export default cards;

