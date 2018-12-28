import React, { PropTypes } from 'react';
import Formsy from 'formsy-react';
import Loader from 'react-loader-advanced';
import Spinner from 'components/generic/Spinner.jsx';
import Notification from 'components/generic/Notification.jsx';
import InputTextArea from 'components/form/InputTextArea.jsx';

const NotesForm = Formsy.Form;
const backStyle = { backgroundColor: 'rgba(236,240,245,0.5)' };

class TrasversalNotes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModified: false,
    };
  }

  onSubmit = () => {
    const notes = this.getFormData();
    if (this.state.isModified && this.props.registryInfo.stato === 'N') {
      this.props.onUpdateNotes(this.props.registryInfo.idRegistro,
                               notes.annotazioni,
                               notes.attivitaRicerca)
          .then((response) => {
            if (response.error) {
              this.Notification.notice(
                'error',
                'Operazione fallita',
                'Salvataggio non effettuato');
              return false;
            }
            this.Notification.notice(
              'success',
              'Informazioni salvate',
              'Salvataggio effettuato');
            return true;
          });
      this.setState({
        isModified: false,
      });
    }
  }

  onChangeCheck = (event) => {
    if (event.currentTarget.value !== this.props.registryInfo.annotazioni) {
      this.setState({
        isModified: true,
      });
    } else {
      this.setState({
        isModified: false,
      });
    }
  }

  setNotificationRef = (ref) => { this.Notification = ref; }
  setNotesFormRef = (ref) => { this.NotesFormRef = ref; }

  getFormData = () => this.NotesFormRef.getModel()

  render() {
    const annotazioni = this.props.registryInfo.annotazioni;
    const attRicerca = this.props.registryInfo.attivitaRicerca;
    const isDisabled = this.props.registryInfo.stato !== 'N';
    const btnClassName = (isDisabled) ?
                         'btn btn-primary btn-block disabled' : 'btn btn-block btn-primary';
    return (
      <div className="box box-solid box-unimi collapsed-box">
        <div className="box-header">
          <h3 className="box-title">
            Note di Registro
          </h3>
          <div className="box-tools pull-right">
            <button className="btn btn-box-tool" data-widget="collapse">
              <i className="fa fa-chevron-down"></i>
            </button>
          </div>
        </div>
        <div className="box-body">
          <Loader
            show={this.props.isEditing}
            message={<Spinner />}
            backgroundStyle={backStyle}
          >
            <NotesForm
              ref={this.setNotesFormRef}
              onValidSubmit={this.onSubmit}
              onInvalidSubmit={this.onSubmit}
              disabled={isDisabled}
            >
              <div className="row displayBottom">
                <div className="col-sm-6 border-right-strong">
                  <InputTextArea
                    title="ANNOTAZIONI"
                    name="annotazioni"
                    size="col-sm-12"
                    rows="3"
                    maxLength="5000"
                    value={annotazioni}
                    changeCheck={this.onChangeCheck}
                    readOnly={isDisabled}
                  />
                  <div className="col-sm-12">
                    <span className="float-right">max numero di caratteri: 5000</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <InputTextArea
                    title="ATTIVITÀ DI RICERCA"
                    name="attivitaRicerca"
                    size="col-sm-12"
                    rows="3"
                    maxLength="20000"
                    value={attRicerca}
                    changeCheck={this.onChangeCheck}
                    readOnly={isDisabled}
                  />
                  <div className="col-sm-12">
                    <span className="float-right">max numero di caratteri: 20000</span>
                  </div>
                </div>
              </div>
              <div className="row vmg10">
                <div className="col-sm-4"></div>
                <div className="col-sm-4">
                  <button
                    type="submit"
                    className={btnClassName}
                  >Salva
                  </button>
                </div>
                <div className="col-sm-4"></div>
              </div>
            </NotesForm>
          </Loader>
          <Notification ref={this.setNotificationRef} />
        </div>
      </div>
    );
  }
}

TrasversalNotes.propTypes = {
  registryInfo: PropTypes.object.isRequired,
  onUpdateNotes: PropTypes.func.isRequired,
  isEditing: PropTypes.bool,
};

export { TrasversalNotes };
