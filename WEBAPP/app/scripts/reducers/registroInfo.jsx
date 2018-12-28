import { combineReducers } from 'redux';

import registro from './registro.jsx';
import occorrenze from './occorrenze.jsx';
import programma from './programma.jsx';
import trasFormeDid from './trasFormeDid.jsx';

const registroInfo = combineReducers({
  registro,
  occorrenze,
  programma,
  trasFormeDid,
});

export default registroInfo;
