// importing lodash
import _ from 'lodash';

// importing actionTypes
import { EDUREC, TRASVERSAL } from 'actions/actionTypes';

// setting initial state
const initialState = {
  data: {},
  isLoaded: false,
  isEditing: false,
  isSaving: false,
};

const registro = (state = initialState, action) => {
  switch (action.type) {
    case EDUREC.FETCH:
      return {
        ...state,
        data: {},
        isLoaded: false,
      };
    case TRASVERSAL.FETCH_COMPLETED:
    case TRASVERSAL.CREATE_COMPLETED:
      if (action.error) {
        return {
          ...state,
          data: {},
          isLoaded: true,
        };
      }
      return {
        ...state,
        data: action.payload[0],
        isLoaded: true,
      };
    case EDUREC.FETCH_COMPLETED:
    case EDUREC.UPDATING_NOTES_COMPLETED:
    case TRASVERSAL.UPDATING_NOTES_COMPLETED:
      return {
        ...state,
        data: action.payload,
        isLoaded: true,
        isSaving: false,
      };
    case EDUREC.OPEN:
    case EDUREC.CLOSE:
    case EDUREC.UPDATING_NOTES:
    case EDUREC.UPDATING_ABSENCES:
    case TRASVERSAL.UPDATING_NOTES:
      return {
        ...state,
        isSaving: true,
      };
    case EDUREC.OPEN_COMPLETED:
    case EDUREC.CLOSE_COMPLETED:
    case TRASVERSAL.OPEN_COMPLETED:
    case TRASVERSAL.CLOSE_COMPLETED:
      return {
        ...state,
        data: action.payload,
        isSaving: false,
      };
    case EDUREC.UPDATING_ABSENCES_COMPLETED: {
      const newState = _.cloneDeep(state);
      newState.data.oreGiustificate = action.payload;
      return {
        ...state,
        data: newState.data,
        isSaving: false,
      };
    }
    default:
      return state;
  }
};

export default registro;
