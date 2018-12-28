import configureStoreWithAReducer from './configureStore.jsx';
import rootReducer from 'reducers/front.jsx';

export default function configureStore(initialState) {
  return configureStoreWithAReducer(initialState, rootReducer);
}
