import React from 'react';
import { Modal } from 'antd';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
    };
  }

  closeModal = () => {
    console.log('ma qui ci arrivo??');
    this.setState({
      isOpen: false,
    });
  }

  render() {
    return (
      <Modal
        title="Login"
        style={{ top: 20 }}
        visible={this.state.isOpen}
        cancelText="Annulla"
        onCancel={this.closeModal}
      >
        <p> form di login </p>
      </Modal>
    );
  }
}

export default LoginForm;
