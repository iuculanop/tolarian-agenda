import React, { PropTypes } from 'react';
import { Modal, Button, Form, InputNumber, Icon } from 'antd';

const FormItem = Form.Item;

/* eslint-disable */
class UpdateWishlist extends React.Component {
  state = {
    visible: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  closeModal = () => {
    this.props.form.resetFields();
    this.setState({
      visible: false,
    });
  }

  onConfirm = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log('Received values of form: ', values);
      console.warn('state of card prop:', this.props.card);
      const wlc = {
        cardId: this.props.card.info.multiverseid,
        name: this.props.card.info.name,
        cardSet: this.props.card.info.set,
        quantity: values.quantity,
        cardType: (values.quantityFoil > 0 ? true : false),
      };
      console.log('object to send to ajax call', wlc);
      // lancio la chiamata update al WS
      this.props.onUpdate(wlc)
          .then((response) => {
            console.log('debug AddButtonTable, response=', response);
            if (!response.error) {
              this.setState({ visible: false });
            } else {
              // TODO: handle the error case, maybe notification?
              console.log('ERRORE APPROVAZIONE! ', response.error);
            }
          });
    })
  }

  render() {
    const iconType = 'plus-square-o';
    const title = this.props.card.info.name;
    const btTitle = 'Lista Desideri';
    const { getFieldDecorator } = this.props.form;
    if (this.props.viewMode === 'table') {
      return (
        <span>
          <Button icon={iconType} onClick={this.showModal}>{btTitle}</Button>
          <Modal
            title={title}
            visible={this.state.visible}
            onCancel={this.closeModal}
            onOk={this.onConfirm}
          >
            <p>{btTitle}</p>
            <Form>
              <FormItem label={"Quantità normale"}>
                {getFieldDecorator("quantity",{ initialValue: this.props.card.quantity.qty })(
                <InputNumber />
              )}
              </FormItem>
              <FormItem label={"Quantità foil"}>
                {getFieldDecorator("quantityFoil",{ initialValue: this.props.card.quantity.foilQty })(
                <InputNumber />
              )}
              </FormItem>
            </Form>
          </Modal>
        </span>
      );
    }
    return (
      <span>
        <Icon type={iconType} onClick={this.showModal} />
        <Modal
          title={title}
          visible={this.state.visible}
          onCancel={this.closeModal}
          onOk={this.onConfirm}
        >
          <Form>
            <FormItem label={"Quantità normale"}>
              {getFieldDecorator("quantity",{ initialValue: this.props.card.quantity.qty })(
              <InputNumber />
            )}
            </FormItem>
            <FormItem label={"Quantità foil"}>
              {getFieldDecorator("quantityFoil",{ initialValue: this.props.card.quantity.foilQty })(
              <InputNumber />
            )}
            </FormItem>

          </Form>
        </Modal>
      </span>
    );
  }
  /* eslint-enable */
}

UpdateWishlist.propTypes = {
  card: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  updateType: PropTypes.string,
  viewMode: PropTypes.string.isRequired,
};

const WrappedUpdateCard = Form.create()(UpdateWishlist);

export default WrappedUpdateCard;
