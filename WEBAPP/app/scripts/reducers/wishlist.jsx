import { WISHLIST } from 'actions/actionTypes.js';

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

const wishlist = (state = initialState, action) => {
  switch (action.type) {
    case WISHLIST.FETCH:
      return {
        list: [],
        loading: true,
      };
    case WISHLIST.FETCH_COMPLETED: {
      if (action.error) {
        return {
          ...state,
          list: [],
          loading: false,
        };
      }
      return {
        list: action.payload,
        loading: false,
      };
    }
    case WISHLIST.UPDATE_COMPLETED: {
      console.log('ecco il payload:', action.payload);
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
    case WISHLIST.UPDATE:
    default:
      return state;
  }
};

export default wishlist;

