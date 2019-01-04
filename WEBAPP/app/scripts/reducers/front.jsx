import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import userInfo from './utente.jsx';
import sets from './sets.jsx';
import cards from './cards.jsx';
import collection from './collection.jsx';
import errorHandler from './errors.jsx';
import transaction from './cardTransactions.jsx';

const rootReducer = combineReducers({
  userInfo,
  sets,
  cards,
  collection,
  transaction,
  errorHandler,
  routing: routerReducer,
});

export default rootReducer;
