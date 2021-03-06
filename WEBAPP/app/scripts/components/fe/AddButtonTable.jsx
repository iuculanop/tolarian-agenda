import React, { PropTypes } from 'react';
import { Modal, Button, Form, InputNumber, Icon, Spin } from 'antd';

const FormItem = Form.Item;

/* eslint-disable */
class UpdateCardTable extends React.Component {
  state = {
    visible: false,
    isLoading: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  closeModal = () => {
    this.setState({
      visible: false,
    });
  }

  onConfirm = (e) => {
    e.preventDefault();
    this.setState({ ...this.state, isLoading: true });
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log('Received values of form: ', values);
      console.warn('state of card prop:', this.props.card);
      const nc = {
        id_card: this.props.card.info.multiverseid,
        mtg_set: this.props.card.info.set,
        quantity: values.quantity,
        foil: (values.quantityFoil > 0 ? true : false),
        foil_quantity: values.quantityFoil,
      };
      console.log('object to send to ajax call', nc);
      // lancio la chiamata delete al WS
      this.props.onUpdate(nc)
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
    const btTitle = 'Aggiorna quantità';
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
            okText={btTitle}
          >
            <Spin spinning={this.state.isLoading}>
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
            </Spin>
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
          okText={btTitle}
        >
          <Spin spinning={this.state.isLoading}>
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
          </Spin>
        </Modal>
      </span>
    );
  }
  /* eslint-enable */
}

UpdateCardTable.propTypes = {
  card: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  updateType: PropTypes.string,
  viewMode: PropTypes.string.isRequired,
};

const WrappedUpdateCard = Form.create()(UpdateCardTable);

export default WrappedUpdateCard;
