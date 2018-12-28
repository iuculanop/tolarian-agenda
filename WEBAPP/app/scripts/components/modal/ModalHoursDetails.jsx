import React, { PropTypes } from 'react';
import Modal from 'react-modal';
import ReduxHoursDetails from 'containers/fe/ReduxHoursDetails.jsx';
import ReduxTrasHoursDetails from 'containers/fe/ReduxTrasHoursDetails.jsx';

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

class ModalHoursDetail extends React.Component {
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

  render() {
    let description;
    if (!this.props.trasversal) {
      description = 'Elenco ore divise per forma didattica:';
    } else {
      description = 'Elenco ore divise per attivita:';
    }
    return (
      <div className="inline">
        <button
          onClick={() => this.openModal()}
          className="btn btn-primary btn-xs"
        >
          Dettagli
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
              <h4 className="modal-title">Dettaglio Ore di attivita</h4>
            </div>
            <div className="modal-body">
              <p>{description}</p>
              {
                !this.props.trasversal &&
                  <ReduxHoursDetails />
              }
              {
                this.props.trasversal &&
                  <ReduxTrasHoursDetails />
              }
            </div>
            <div className="modal-footer withaliceblue">
              <button
                type="button"
                className="btn btn-default"
                onClick={this.closeModal}
              >
                Ok
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

ModalHoursDetail.propTypes = {
  trasversal: PropTypes.bool,
};

export default ModalHoursDetail;
