import { PropTypes } from 'react';

export default function statusPropType(messages) {
  return PropTypes.shape({
    msg: PropTypes.oneOf(messages).isRequired,
    error: PropTypes.instanceOf(Error),
  });
}
