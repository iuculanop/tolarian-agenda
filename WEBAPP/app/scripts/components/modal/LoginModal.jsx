import { appHistory } from 'appHistory';
import React, { PropTypes } from 'react';
import { Modal, Input, Form, Icon } from 'antd';

const FormItem = Form.Item;

class LoginModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
    };
  }

  handleSubmit = () => {
    const form = this.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      console.log('Received values from form ', values);
      // TODO: lanciare chiamata a authenticateUser
      this.props.authenticateUser(values.userId, values.password)
          .then(() => {
            // TODO: chiudere modale
            this.setState({
              isOpen: false,
            });
            appHistory.push('/');
          })
          .catch((error) => {
            console.warn('errore di autenticazione: ', error.error);
          });
    });
  }

  closeModal = () => {
    console.log('ma qui ci arrivo??');
    this.setState({
      isOpen: false,
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        title="Login"
        style={{ top: 20 }}
        visible={this.state.isOpen}
        cancelText="Annulla"
        onCancel={this.closeModal}
        okText="Login"
        onOk={this.handleSubmit}
      >
        <Form layout="vertical" className="simple-form">
          <FormItem>
            {getFieldDecorator('userId', {
              rules: [{ required: true, message: 'Inserire username' }],
            })(
              <Input
                placeholder="Username"
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Inserire password' }],
            })(
              <Input
                placeholder="Password"
                type="password"
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

LoginModal.propTypes = {
  authenticateUser: PropTypes.func.isRequired,
  form: PropTypes.object,
};

const WrappedLoginModal = Form.create()(LoginModal);

export default WrappedLoginModal;
