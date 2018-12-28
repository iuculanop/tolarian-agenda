// import external functions
import _ from 'lodash';
import { aoIndexOf } from 'util/ArrayUtils.jsx';

// import actionTypes
import { EDURECS, EDUREC, TRASVERSAL } from 'actions/actionTypes.js';

// function for filtering critical registry in the past 2 years
function filterCriticalEduRecs(array) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    if (array[i].stato === 'N' || array[i].stato === null) {
      result.push(array[i]);
    }
  }
  return result;
}

// setting initial state
const initialState = {
  registriOnYear: [],
  registriCritical: [],
  registriTrasversal: [],
  loading: false,
  loadingCritical: true,
};

// setting local variables
let oldEduRec; // copy of the unopened registry before the creation
let registryClone; // cloneDeep of the actual list of registries

const registriList = (state = initialState, action) => {
  switch (action.type) {
    case EDURECS.FETCH:
      return {
        ...state,
        loading: true,
      };
    case EDURECS.FETCH_COMPLETED:
      if (action.payload.error) {
        return {
          ...state,
          registriOnYear: [],
          loading: false,
        };
      }
      return {
        ...state,
        registriOnYear: action.payload,
        loading: false,
      };
    case TRASVERSAL.FETCH_COMPLETED:
      if (action.payload.error) {
        return {
          ...state,
          registriTrasversal: [],
          loading: false,
        };
      }
      return {
        ...state,
        registriTrasversal: action.payload,
        loading: false,
      };
    case EDUREC.FETCH:
      return {
        ...state,
        loadingCritical: false,
      };
    case EDUREC.CLOSE:
    case EDUREC.OPEN:
      return {
        ...state,
        loadingCritical: true,
      };
    case EDURECS.FETCH_CRIT:
      return {
        ...state,
        // loadingCritical: true,
      };
    case EDURECS.FETCH_CRIT_COMPLETED:
      if (action.payload.error) {
        return {
          ...state,
          registriCritical: [],
          loadingCritical: false,
        };
      }
      return {
        ...state,
        registriCritical: filterCriticalEduRecs(action.payload),
        loadingCritical: false,
      };
    case EDUREC.CREATE_COMPLETED:
      oldEduRec = aoIndexOf(state.registriOnYear, action.payload.idCopertura, 'idCopertura');
      registryClone = _.cloneDeep(state.registriOnYear);
      registryClone.splice(oldEduRec, 1, action.payload);
      return {
        ...state,
        registriOnYear: registryClone,
      };
    case TRASVERSAL.CREATE_COMPLETED:
      if (action.error) {
        return state;
      }
      state.registriTrasversal.pop();
      state.registriTrasversal.push(action.payload);
      return state;
    default:
      return state;
  }
};

export default registriList;
