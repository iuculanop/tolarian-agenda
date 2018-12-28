import React, { PropTypes } from 'react';
import Modal from 'react-modal';
import { casURL, baseURL } from 'util/AppConfig.jsx';

const customStyles = {
  content: {
    position: 'absolute',
    top: '150px',
    left: '70px',
    right: '40px',
    bottom: 'auto',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    outline: 'none',
    padding: '20px',
  },
  overlay: {
    zIndex: '1050',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

const authURL = casURL + baseURL;

class ErrorAlert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: true,
    };
  }

  onConfirm = () => {
    if (this.props.message.title === 'Servizi non disponibili') {
      window.location.reload();
    } else {
      window.location.assign(authURL);
    }
    return;
  }

  closeModal = () => {
    this.setState({
      modalIsOpen: false,
    });
  }

  render() {
    const isOpen = (this.props.hasError && this.state.modalIsOpen);
    return (
      <Modal
        isOpen={isOpen}
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEscPressed={false}
        style={customStyles}
        className="Modal__Bootstrap modal-dialog modal-lg"
      >
        <div className="modal-content">
          <div className="modal-header withdanger">
            <h4 className="modal-title">{this.props.message.title}</h4>
          </div>
          <div className="modal-body">
            <p>{this.props.message.body}</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.onConfirm}
            >
              Procedi
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}

ErrorAlert.propTypes = {
  hasError: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
};

export default ErrorAlert;
