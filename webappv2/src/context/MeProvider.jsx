import React from 'react';

import ajaxMe from '../ajax/me';
import MeContext from './MeContext';

function MeProvider({ me, children }) {
  return <MeContext.Provider value={me}>{children}</MeContext.Provider>;
}

export default ajaxMe(MeProvider);