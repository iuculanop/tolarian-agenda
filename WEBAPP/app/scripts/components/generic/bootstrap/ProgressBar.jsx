import React from 'react';

import _ from 'lodash';
import { ChildrenPropType } from 'util/PropTypes/ChildrenPropType.jsx';

function ProgressBar({ min, max, value, children }) {
  const indeterminate = _.isUndefined(value);
  const progressValue = value || min;
  return (
    <div>
      {indeterminate ?
        <p className="text-center"><i className="fa fa-refresh fa-spin fa-2x"></i></p>
        :
        <div className="progress">
          <div
            className="progress-bar progress-bar-striped" role="progressbar"
            aria-valuenow={value} aria-valuemin={min} aria-valuemax={max}
            style={{ width: `${(min + progressValue / (max - min)) * 100}%` }}
          />
        </div>}
      {children}
    </div>
  );
}
ProgressBar.propTypes = {
  min: React.PropTypes.number,
  max: React.PropTypes.number,
  value: React.PropTypes.number,
  indeterminate: React.PropTypes.bool,
  children: ChildrenPropType,
};
ProgressBar.defaultProps = {
  min: 0,
  max: 100,
};

export { ProgressBar };
export default ProgressBar;
