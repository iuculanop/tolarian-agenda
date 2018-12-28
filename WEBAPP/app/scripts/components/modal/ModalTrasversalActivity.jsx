import React, { PropTypes } from 'react';
import Modal from 'react-modal';
import TrasversalActivityForm from 'components/form/TrasversalActivityForm.jsx';
import { aoObjectOf } from 'util/ArrayUtils.jsx';

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

class TrasversalActivity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      isValid: false,
    };
  }

  componentWillUnmount() {
    this.setState = {
      modalIsOpen: false,
      isValid: false,
    };
  }

  setTrasvActivityFormRef = (ref) => { this.TrasvActivityForm = ref; }

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

  checkValidity = (status) => {
    this.setState({
      isValid: status,
    });
  }

  handleSubmit = () => {
    const sendToWS = [];
    const activity = this.TrasvActivityForm.getFormData();
    if (this.state.isValid) {
      const formaDid = aoObjectOf(this.props.formeDidScheduled,
                                  parseInt(activity.idFormaDid, 10),
                                  'idFormaDidattica');
      activity.descFormaDid = formaDid.descrizione;
      activity.stato = 'N';
      sendToWS.push(activity);
      this.props.onSaveClick(this.props.registryId, sendToWS);
      this.setState({
        modalIsOpen: false,
      });
    }
  }

  render() {
    let buttonClassName = 'btn btn-primary';
    if (!this.state.isValid) {
      buttonClassName = `${buttonClassName} disabled`;
    }

    return (
      <div className="row-buttons">
        <button type="button" className="btn btn-primary" onClick={this.openModal}>
          <i className="glyphicon glyphicon-plus"></i>Nuova Attivita
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
              <h4 className="modal-title">Inserisci nuova attivita</h4>
            </div>
            <div className="modal-body">
              <TrasversalActivityForm
                ref={this.setTrasvActivityFormRef}
                formeDidScheduled={this.props.formeDidScheduled}
                registryYear={this.props.registryYear}
                check={this.checkValidity}
              />
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
                className={buttonClassName}
                onClick={this.handleSubmit}
              >
                Crea
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

}

TrasversalActivity.propTypes = {
  registryId: PropTypes.number.isRequired,
  registryYear: PropTypes.number.isRequired,
  formeDidScheduled: PropTypes.arrayOf(PropTypes.object),
  onSaveClick: PropTypes.func.isRequired,
};

export default TrasversalActivity;
