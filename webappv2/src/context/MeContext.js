import { createContext } from 'react';

const MeContext = createContext({
  me: {
    fulfilled: false,
    meta: {},
    pending: false,
    reason: null,
    refreshing: false,
    rejected: false,
    settled: false,
    value: null,
  },
});

export default MeContext;
