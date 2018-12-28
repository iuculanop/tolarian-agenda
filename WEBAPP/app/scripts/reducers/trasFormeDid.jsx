// importing actionTypes
import { TRASVERSAL } from 'actions/actionTypes.js';

// setting initial state
const initialState = {
  data: [],
  isLoaded: false,
};

const trasFormeDid = (state = initialState, action) => {
  switch (action.type) {
    case TRASVERSAL.FETCH_FORMEDID:
      return {
        ...state,
        data: action.payload,
        isLoaded: true,
      };
    default:
      return state;
  }
};

export default trasFormeDid;
