import React from 'react';
import _ from 'lodash/fp';

// Route definition facilities (from react-router)
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';

// Apps
import FrontendApp from 'apps/FrontendApp.jsx';
import MtGDashboard from 'apps/MtGDashboard.jsx';
import MtGSearch from 'apps/MtGSearch.jsx';
import { CardDetail, onEnterCardDetail } from 'apps/MtGCard.jsx';
import { UserProfile, onEnterUserProfile } from 'apps/UserProfile.jsx';
import ReduxLogin from 'containers/fe/ReduxLogin.jsx';

// import { EventDetailApp, onEnterEventDetailApp } from 'apps/EventDetailApp.jsx';

// Use _.partial to externally define hooks that dispatch actions (injecting the store)

function routes(store) {
  return (
    <Route
      path="/"
      component={FrontendApp}
    >
      <IndexRoute
        component={MtGDashboard}
      />
      <Route
        path="login"
        component={ReduxLogin}
      />
      <Route
        path="search"
        component={MtGSearch}
      />
      <Route
        path="card/:idCard"
        component={CardDetail}
        onEnter={_.partial(onEnterCardDetail, [store])}
      />
      <Route
        path="profile/:idUser"
        component={UserProfile}
        onEnter={_.partial(onEnterUserProfile, [store])}
      />
    </Route>);
}

export default routes;
