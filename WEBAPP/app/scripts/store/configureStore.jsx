import { createStore, applyMiddleware, compose } from 'redux';

import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
// Used to dispatch actions in order to change locations (see below too)
import appHistory from 'appHistory';

export default function configureStoreWithAReducer(
  initialState, rootReducer, useRouterMiddleware = false) {
  const middlewares = [
    thunkMiddleware,
  ];

  if (useRouterMiddleware) {
    // Used to dispatch actions in order to change locations
    middlewares.push(routerMiddleware(appHistory));
  }

  if (process.env.NODE_ENV === 'development') {
    const createLogger = require('redux-logger'); // eslint-disable-line global-require
    const logger = createLogger({ collapsed: true, duration: true });
    middlewares.push(logger);
  }

  const enhancers = [
    applyMiddleware(...middlewares),
  ];

  if (process.env.NODE_ENV === 'development' &&
      window && window.devToolsExtension) {   // eslint-disable-line no-undef
    enhancers.push(window.devToolsExtension());   // eslint-disable-line no-undef
  }

  const store = createStore(
    rootReducer,
    initialState,
    compose(...enhancers)
  );

  return store;
}
