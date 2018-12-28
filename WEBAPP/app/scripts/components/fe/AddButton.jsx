import React, { PropTypes } from 'react';
import { Icon } from 'antd';

class UpdateCardButton extends React.Component {

  handleUpdate = () => {
    console.log(this.props.card);
    let qty;
    if (this.props.updateType === 'remove') {
      qty = (this.props.card.quantity === 0 ? 0 : this.props.card.quantity - 1);
    } else {
      qty = this.props.card.quantity + 1;
    }
    const nc = {
      id_card: this.props.card.idCard,
      mtg_set: this.props.card.idSet,
      quantity: qty,
      foil: false,
      foil_quantity: 0,
    };
    console.log('DEBUG handleUpdate: ', nc);
    this.props.onUpdate(nc);
  }

  render() {
    const iconType = (this.props.updateType === 'remove' ? 'minus-square-o' : 'plus-square-o');
    return (
      <Icon
        type={iconType}
        onClick={this.handleUpdate}
      />
    );
  }
}

UpdateCardButton.propTypes = {
  card: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  updateType: PropTypes.string,
};

export default UpdateCardButton;
