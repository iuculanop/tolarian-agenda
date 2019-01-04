import { TRANSACTION } from 'actions/actionTypes.js';

const initialState = {
  /* filterValues: {
   *   name: '',
   *   setCode: '',
   * },*/
  list: [],
  loading: false,
  /* viewMode: 'table',
   * paginationInfo: {},*/
};

const transaction = (state = initialState, action) => {
  switch (action.type) {
    case TRANSACTION.FETCH_ALL:
      return {
        ...state,
        list: [],
        loading: true,
      };
    case TRANSACTION.FETCH_ALL_COMPLETED: {
      if (action.error) {
        return {
          ...state,
          loading: false,
        };
      }
      return {
        ...state,
        list: action.payload,
        loading: false,
      };
    }
    default:
      return state;
  }
};

export default transaction;

