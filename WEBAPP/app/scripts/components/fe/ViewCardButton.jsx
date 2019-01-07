import React, { PropTypes } from 'react';
import { Icon } from 'antd';
import { tableCardLink } from 'util/NavigationUtils.jsx';

class ViewCardButton extends React.Component {

  onViewCard = (e) => {
    e.preventDefault();
    tableCardLink(this.props.card);
  }

  render() {
    return (
      <Icon type="eye" onClick={this.onViewCard} />
    );
  }
}

ViewCardButton.propTypes = {
  card: PropTypes.object.isRequired,
};

export default ViewCardButton;
