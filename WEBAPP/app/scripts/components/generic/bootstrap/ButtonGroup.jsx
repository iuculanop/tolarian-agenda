import React from 'react';

function encapsulateChildren(justified) {
  if (justified) {
    return children => (
      <div className="btn-group" role="group">
        {children}
      </div>
    );
  }
  return children => children;
}

function ButtonGroup({ children, className, justified }) {
  const encapsFn = encapsulateChildren(justified);
  return (
    <div
      className={`btn-group ${className || ''} ${justified ? 'btn-group-justified' : ''}`}
      role="group"
    >
      {React.Children.map(children, encapsFn)}
    </div>
  );
}
ButtonGroup.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  justified: React.PropTypes.bool,
};

export default ButtonGroup;
