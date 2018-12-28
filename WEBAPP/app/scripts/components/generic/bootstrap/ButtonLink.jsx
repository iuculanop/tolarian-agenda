import React from 'react';

import { appHistory } from 'appHistory';

function gotoHref(href) {
  return () => appHistory.push(href);
}

function ButtonLink({ href, children, className, disabled }) {
  return (
    <button
      type="button"
      onClick={gotoHref(href)}
      className={className}
      disabled={disabled || false}
    >
      {children}
    </button>);
}
ButtonLink.propTypes = {
  href: React.PropTypes.string.isRequired,
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  disabled: React.PropTypes.bool,
};

export default ButtonLink;
