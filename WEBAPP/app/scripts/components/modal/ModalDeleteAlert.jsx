import React, { PropTypes } from 'react';
import Modal from 'react-modal';
import { appHistory } from 'appHistory';

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

class ModalDeleteAlert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
    };
  }

  onSubmit = () => {
    // apro il modale di richiesta conferma azione
    this.openModal();
  }

  onConfirm = () => {
    // chiudo il modale, forse non serve neanche farlo
    this.setState({
      modalIsOpen: false,
    });
    // lancio la chiamata delete al WS
    this.props.deleteRegistry(this.props.registryInfo.idRegistro);
    // ridirigo alla pagina di selezione registro
    appHistory.goBack();
  }

  openModal = () => {
    this.setState({
      modalIsOpen: true,
    });
  }

  closeModal = () => {
    this.setState({
      modalIsOpen: false,
    });
  }

  render() {
    return (
      <div className="col-md-4 col-lg-4">
        <button
          onClick={() => this.onSubmit()}
          className="btn btn-primary btn-block vmg5"
        >
          <i className="fa fa-eraser fa-lg"></i><br />
          <span className="text-center">Cancella</span>
        </button>
        <Modal
          isOpen={this.state.modalIsOpen}
          shouldCloseOnOverlayClick={false}
          shouldCloseOnEscPressed={false}
          style={customStyles}
          className="Modal__Bootstrap modal-dialog modal-lg"
        >
          <div className="modal-content">
            <div className="modal-header withdanger">
              <button type="button" className="close" onClick={this.closeModal}>
                <span aria-hidden="true">x</span>
                <span className="sr-only">Close</span>
              </button>
              <h4 className="modal-title">Cancellazione Registro</h4>
            </div>
            <div className="modal-body">
              <p>
                Il registro verrà cancellato in modo irreversibile.
                Procedere comunque?
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-default"
                onClick={this.closeModal}
              >
                Annulla
              </button>
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
      </div>
    );
  }
}

ModalDeleteAlert.propTypes = {
  registryInfo: PropTypes.object.isRequired,
  deleteRegistry: PropTypes.func.isRequired,
};

export default ModalDeleteAlert;
