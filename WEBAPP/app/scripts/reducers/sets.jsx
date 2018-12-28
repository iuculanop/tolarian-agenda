import { SETS } from 'actions/actionTypes.js';

const initialState = {
  list: [],
  isLoaded: false,
};

const sets = (state = initialState, action) => {
  switch (action.type) {
    case SETS.FETCH_ALL:
      return {
        ...state,
        list: [],
        isLoaded: false,
      };
    case SETS.FETCH_ALL_COMPLETED:
      return {
        list: action.payload,
        isLoaded: true,
      };
    default:
      return state;
  }
};

export default sets;
