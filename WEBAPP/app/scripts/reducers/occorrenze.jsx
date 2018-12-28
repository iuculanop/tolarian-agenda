// importing actionTypes
import { OCCURRENCES, TRAS_OCCURRENCES } from 'actions/actionTypes.js';

// setting initial state
const initialState = {
  data: [],
  trasversalData: [],
  isLoaded: false,
  isEditing: false,
};

const occurrences = (state = initialState, action) => {
  switch (action.type) {
    case OCCURRENCES.FETCH:
      return {
        ...state,
        data: [],
        isLoaded: false,
      };
    case OCCURRENCES.FETCH_COMPLETED:
      return {
        ...state,
        data: action.payload,
        isLoaded: true,
      };
    case TRAS_OCCURRENCES.FETCH:
      return {
        ...state,
        trasversalData: [],
        isLoaded: false,
      };
    case TRAS_OCCURRENCES.FETCH_COMPLETED:
      if (action.payload.error) {
        return {
          ...state,
          isLoaded: true,
        };
      }
      return {
        ...state,
        trasversalData: action.payload,
        isLoaded: true,
      };
    case OCCURRENCES.CREATE_COMPLETED:
      return {
        ...state,
        data: action.payload,
      };
    case OCCURRENCES.DELETE_COMPLETED:
      return {
        ...state,
        data: action.payload,
      };
    case TRAS_OCCURRENCES.CREATE_COMPLETED:
      return {
        ...state,
        trasversalData: action.payload,
        isLoaded: true,
      };
    case TRAS_OCCURRENCES.DELETE_COMPLETED:
      return {
        ...state,
        trasversalData: action.payload,
      };
    case OCCURRENCES.UPDATE:
      return {
        ...state,
        isEditing: true,
      };
    case OCCURRENCES.UPDATE_COMPLETED:
      if (action.payload.error) {
        return state;
      }
      return {
        ...state,
        data: action.payload,
        isEditing: false,
      };
    case TRAS_OCCURRENCES.UPDATE:
      return {
        ...state,
        isEditing: true,
      };
    case TRAS_OCCURRENCES.UPDATE_COMPLETED:
      if (action.payload.error) {
        return state;
      }
      return {
        ...state,
        trasversalData: action.payload,
        isEditing: false,
      };

    default:
      return state;
  }
};

export default occurrences;
