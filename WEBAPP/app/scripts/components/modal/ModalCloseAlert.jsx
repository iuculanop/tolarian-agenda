import React, { PropTypes } from 'react';
import Modal from 'react-modal';
import ReduxHoursDetails from 'containers/fe/ReduxHoursDetails.jsx';

import { aoIndexOf,
         aoObjectOf,
         calculateHours } from 'util/ArrayUtils.jsx';

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

function checkHours(registry, occurrences) {
  // recupero le forme didattiche previste nel registro
  const formeDid = [];
  for (let i = 0; i < registry.descFD.length; i++) {
    formeDid.push(registry.descFD[i].idFormaDidattica);
  }
  // controllo per ogni forma didattica prevista se le ore coincidono
  for (let i = 0; i < formeDid.length; i++) {
    const formeDidScheduled = aoObjectOf(registry.descFD, formeDid[i], 'idFormaDidattica');
    const formeDidRegistered = calculateHours(occurrences, formeDid[i]);
    if (formeDidScheduled.oreDocente !== formeDidRegistered) {
      return false;
    }
  }
  return true;
}

function checkMissingArgument(occurrences) {
  if (aoIndexOf(occurrences, '', 'argomento') !== -1) {
    return false;
  }
  return true;
}

function checkIsEmpty(registry, occurrences) {
  if (registry.annotazioni === '' &&
      registry.oreGiustificate.length === 0 &&
      occurrences.length === 0) {
    return true;
  }
  return false;
}

class ModalCloseAlert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      cause: '',
    };
  }

  onSubmit = () => {
    if (this.props.trasversal) {
      this.openModal('closeTrasversal');
    } else if (checkIsEmpty(this.props.registryInfo, this.props.occurrences)) {
      this.openModal('emptyRegistry');
    } else if (checkMissingArgument(this.props.occurrences)) {
      // controllo ore svolte: se ok, procede alla chiusura
      if (checkHours(this.props.registryInfo, this.props.occurrences)) {
        // lancia chiamata di chiusura al WS
        this.props.closeRegistry(this.props.registryInfo.idRegistro);
      } else {
        // TODO:
        // chiedere a Gloria come ci dobbiamo comportare con la somma di ore
        // registrate e giustificate uguale a ore previste.
        // apre modale di avviso ore non coincidenti
        this.openModal('hoursNotOk');
      }
    } else {
      // apro modale avviso campi da compilare
      this.openModal('fieldRequired');
    }
  }

  onConfirm = () => {
    this.props.closeRegistry(this.props.registryInfo.idRegistro);
    this.setState({
      modalIsOpen: false,
    });
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
    switch (this.state.cause) {
      case 'hoursNotOk':
        return (
          <div className="col-md-14 col-lg-4">
            <button
              onClick={() => this.onSubmit()}
              className="btn btn-primary btn-block vmg5"
            >
              <i className="glyphicon glyphicon-lock"></i><br />
              <span className="text-center">Chiudi</span>
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
                  <h4 className="modal-title">Anomalia ore registrate</h4>
                </div>
                <div className="modal-body">
                  <p>Le ore registrate non corrispondono a quelle assegnate.</p>
                  <ReduxHoursDetails toCheck />
                  <p>Vuoi comunque procedere alla chiusura del registro?</p>
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
      case 'emptyRegistry':
        return (
          <div className="col-md-4 col-lg-4">
            <button
              onClick={() => this.onSubmit()}
              className="btn btn-primary btn-block vmg5"
            >
              <i className="glyphicon glyphicon-lock"></i><br />
              <span className="text-center">Chiudi</span>
            </button>
            <Modal
              isOpen={this.state.modalIsOpen}
              shouldCloseOnOverlayClick={false}
              shouldCloseOnEscPressed={false}
              style={customStyles}
              className="Modal__Bootstrap modal-dialog modal-lg"
            >
              <div className="modal-content">
                <div className="modal-header withstop">
                  <button type="button" className="close" onClick={this.closeModal}>
                    <span aria-hidden="true">x</span>
                    <span className="sr-only">Close</span>
                  </button>
                  <h4 className="modal-title">Registro vuoto</h4>
                </div>
                <div className="modal-body">
                  <p>Si prega di compilare il registro prima di chiuderlo.</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.closeModal}
                  >
                    Ok
                  </button>
                </div>
              </div>
            </Modal>
          </div>
        );
      case 'closeTrasversal':
        return (
          <div className="col-md-4 col-lg-4">
            <button
              onClick={() => this.onSubmit()}
              className="btn btn-primary btn-block vmg5"
            >
              <i className="glyphicon glyphicon-lock"></i><br />
              <span className="text-center">Chiudi</span>
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
                  <h4 className="modal-title">Chiusura registro trasversale</h4>
                </div>
                <div className="modal-body">
                  <p>Se si vuole chiudere il registro trasversale cliccare su procedi.</p>
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
          </div>
        );
      case 'fieldRequired':
      default:
        return (
          <div className="col-md-4 col-lg-4">
            <button
              onClick={() => this.onSubmit()}
              className="btn btn-primary btn-block vmg5"
            >
              <i className="glyphicon glyphicon-lock"></i><br />
              <span className="text-center">Chiudi</span>
            </button>
            <Modal
              isOpen={this.state.modalIsOpen}
              shouldCloseOnOverlayClick={false}
              shouldCloseOnEscPressed={false}
              style={customStyles}
              className="Modal__Bootstrap modal-dialog modal-lg"
            >
              <div className="modal-content">
                <div className="modal-header withstop">
                  <button type="button" className="close" onClick={this.closeModal}>
                    <span aria-hidden="true">x</span>
                    <span className="sr-only">Close</span>
                  </button>
                  <h4 className="modal-title">Dati non completi</h4>
                </div>
                <div className="modal-body">
                  <p>Si prega di inserire l'argomento per tutte le attività registrate.</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
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
}

ModalCloseAlert.propTypes = {
  registryInfo: PropTypes.object.isRequired,
  occurrences: PropTypes.arrayOf(PropTypes.object).isRequired,
  closeRegistry: PropTypes.func.isRequired,
  trasversal: PropTypes.bool,
};

export default ModalCloseAlert;
