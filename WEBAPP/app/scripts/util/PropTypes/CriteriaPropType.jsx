import { PropTypes } from 'react';

import { MomentPropType } from './MomentPropType.jsx';

export const CriteriaPropType = PropTypes.shape({
  from: MomentPropType,
  to: MomentPropType,
});
