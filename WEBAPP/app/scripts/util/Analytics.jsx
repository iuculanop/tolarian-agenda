import ReactGA from 'react-ga';

import { analytics as analyticsConfig } from 'util/AppConfig.jsx';

const analytics = {
  ...ReactGA,
  initialize() {
    ReactGA.initialize(analyticsConfig.trackingId);
    ReactGA.set({ appName: 'UNIMI Registri Docente', appVersion: '1.0' });
  },
  setUser(userInfo) {
    if (analyticsConfig.trackUsers) {
      ReactGA.set({ userId: userInfo && userInfo.userId });
    }
  },
};

if (!analyticsConfig.enabled || !analyticsConfig.trackingId) {
  Object.keys(analytics).forEach((method) => {
    analytics[method] = () => true;
  });
}

export default analytics;
