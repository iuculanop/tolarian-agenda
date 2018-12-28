import { USER, COLLECTION } from 'actions/actionTypes.js';

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

const collection = (state = initialState, action) => {
  switch (action.type) {
    case USER.FETCH_COMPLETED:
      return {
        ...state,
        list: action.payload.collection || [],
        loading: false,
      };
    case COLLECTION.REMOVECARD_COMPLETED:
    case COLLECTION.ADDCARD_COMPLETED: {
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
    case COLLECTION.REMOVECARD:
    case COLLECTION.ADDCARD:
    default:
      return state;
  }
};

export default collection;

