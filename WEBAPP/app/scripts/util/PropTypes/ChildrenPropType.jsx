import { PropTypes } from 'react';

export const SingleChildPropType = PropTypes.oneOfType([
  PropTypes.element,
  PropTypes.node,
]);

export const ChildrenPropType = PropTypes.oneOfType([
  PropTypes.element,
  PropTypes.node,
  PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.node,
  ])),
]);
