// import actionTypes
import { EDUREC } from 'actions/actionTypes.js';

// setting initialState
const initialState = {
  data: {},
  isLoaded: false,
};

const programma = (state = initialState, action) => {
  switch (action.type) {
    case EDUREC.FETCH_PROGRAM:
      return {
        ...state,
        isLoaded: false,
      };
    case EDUREC.FETCH_PROGRAM_COMPLETED:
      return {
        ...state,
        data: action.payload,
        isLoaded: true,
      };
    default:
      return state;
  }
};

export default programma;
