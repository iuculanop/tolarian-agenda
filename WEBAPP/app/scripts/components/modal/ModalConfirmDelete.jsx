import React, { PropTypes } from 'react';
import Modal from 'react-modal';

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

class DeleteButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
    };
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

  submitConfirm = () => {
    this.props.deleteFunction(this.props.idRegistro, this.props.objToDelete)
        .then((response) => {
          if (response.error) {
            this.props.notifier.notice(
              'error',
              'Operazione fallita',
              'Salvataggio non effettuato');
            return false;
          }
          this.props.notifier.notice(
            'success',
            'Informazioni salvate',
            'Salvataggio effettuato');
          return true;
        });
    this.setState({
      modalIsOpen: false,
    });
  }

  render() {
    return (
      <div>
        <button type="button" className="btn btn-sm btn-outline-danger" onClick={this.openModal}>
          <i className="glyphicon glyphicon-trash"></i>
        </button>
        <Modal
          isOpen={this.state.modalIsOpen}
          shouldCloseOnOverlayClick={false}
          shouldCloseOnEscPressed={false}
          style={customStyles}
          className="Modal__Bootstrap modal-dialog modal-lg"
        >
          <div className="modal-content">
            <div className="modal-header withaliceblue">
              <button type="button" className="close" onClick={this.closeModal}>
                <span aria-hidden="true">x</span>
                <span className="sr-only">Close</span>
              </button>
              <h4 className="modal-title">Rimuovi attivita</h4>
            </div>
            <div className="modal-body">
              Sicuro di voler cancellare la riga?
            </div>
            <div className="modal-footer withaliceblue">
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
                onClick={this.submitConfirm}
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

DeleteButton.propTypes = {
  idRegistro: PropTypes.number.isRequired,
  objToDelete: PropTypes.object.isRequired,
  deleteFunction: PropTypes.func.isRequired,
  styles: PropTypes.string,
  iconStyles: PropTypes.string,
  notifier: PropTypes.object,
};

export default DeleteButton;
