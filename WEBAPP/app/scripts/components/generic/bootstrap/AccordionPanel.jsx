import React from 'react';

import cx from 'classnames';

import { ChildrenPropType } from 'util/PropTypes/ChildrenPropType.jsx';


class AccordionPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: props.isOpen,
    };
  }

  // Use ES6 arrow-style functions to avoid to rebind this
  handleClick = (e) => {
    e.preventDefault();
    this.setState({ isOpen: !this.state.isOpen });
    e.stopPropagation();
  }

  render() {
    const outerClasses = cx('panel', this.props.panelClassName);
    const innerClasses = cx('panel-collapse', 'collapse', {
      in: this.state.isOpen,
    });
    return (
      <div className={outerClasses}>
        {
          React.cloneElement(this.props.header, {
            isOpen: this.state.isOpen,
            onClick: this.handleClick,
          })
        }
        <div className={innerClasses}>
          <div className="panel-body">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
AccordionPanel.propTypes = {
  header: React.PropTypes.node.isRequired,
  children: React.PropTypes.element.isRequired,
  isOpen: React.PropTypes.bool,
  panelClassName: React.PropTypes.string,
};
AccordionPanel.defaultProps = {
  isOpen: false,
};

function TitleHeader({ children, isOpen, onClick }) {
  const iconClasses = cx(
    'fa', 'fa-fw',
    {
      'fa-caret-down': isOpen,
      'fa-caret-right': !isOpen,
    }
  );
  return (
    <div className="panel-heading" style={{ cursor: 'pointer' }} onClick={onClick}>
      <h3 className="panel-title"><i className={iconClasses}></i>
        {children}
      </h3>
    </div>
  );
}
TitleHeader.propTypes = {
  children: ChildrenPropType,
  isOpen: React.PropTypes.bool,
  onClick: React.PropTypes.func,
  panelClassName: React.PropTypes.string,
};
AccordionPanel.TitleHeader = TitleHeader;

export default AccordionPanel;
