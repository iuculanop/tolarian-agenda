import React from 'react';

import cx from 'classnames';

function DivContainer({ children, fluid }) {
  const classes = cx({
    'container-fluid': fluid,
    container: !fluid,
  });
  return (
    <div className={classes}>
      {children}
    </div>
  );
}
DivContainer.propTypes = {
  children: React.PropTypes.node,
  fluid: React.PropTypes.bool,
};

export default DivContainer;
