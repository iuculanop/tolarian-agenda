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

class AuthAlert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
    };
  }

  onConfirm = () => {
    // TODO: implementare redirect al cas al submit
    window.location.assign(authURL);
    return;
  }

  openModal = (cause) => {
    this.setState({
      modalIsOpen: true,
      cause,
    });
  }

  closeModal = () => {
    this.setState({
      modalIsOpen: false,
    });
  }

  render() {
    const isOpen = (this.props.userInfo.matricola &&
                    !this.props.isAuthenticated &&
                    this.props.hasToken);
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
            <h4 className="modal-title">Sessione scaduta/Non autenticato</h4>
          </div>
          <div className="modal-body">
            <p>Si prega di autenticarsi nuovamente, cliccare su procedi</p>
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

AuthAlert.propTypes = {
  userInfo: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  hasToken: PropTypes.bool.isRequired,
};

export default AuthAlert;
