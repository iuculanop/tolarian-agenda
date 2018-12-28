import React from 'react';
import { render } from 'react-dom';

// react <-> redux bindings
import { Provider } from 'react-redux';

// Route definition facilities (from react-router)
import Router from 'react-router/lib/Router';
import { appHistory } from 'appHistory';

// Our store
import configureStore from 'store/front.jsx';
const store = configureStore();

// Our routes
import routesFactory from 'routes/mtgorganizer-routes.jsx';
const routes = routesFactory(store);

// react-router <-> redux state bindings
import { syncHistoryWithStore } from 'react-router-redux';
const history = syncHistoryWithStore(appHistory, store);

// ajax bindings with redux state
import { configureAjax } from 'util/Ajax/customAjaxCalls.jsx';
configureAjax(store);

render(
  <Provider store={store}>
    <Router history={history} >
      {routes}
    </Router>
  </Provider>,
  document.getElementById('app'));

// import Google Analytics
/* import analytics from 'util/Analytics.jsx';
 * analytics.initialize();
 * const logPageView = () => {
 *   const loc = window.location;
 *   const page = `${loc.pathname}${loc.search || ''}`;
 *   analytics.set({ page });
 *   analytics.pageview(page);
 *   analytics.event({
 *     category: 'Navigation',
 *     action: 'Page change',
 *     label: loc.pathname,
 *   });
 * };
 *
 * render(
 *   <Provider store={store}>
 *     <Router history={history} onUpdate={logPageView}>
 *       {routes}
 *     </Router>
 *   </Provider>,
 *   document.getElementById('app'));
 */
