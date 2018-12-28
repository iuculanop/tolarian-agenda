import React, { PropTypes } from 'react';
import Formsy from 'formsy-react';
import Loader from 'react-loader-advanced';
import Spinner from 'components/generic/Spinner.jsx';
import Notification from 'components/generic/Notification.jsx';
import InputHours from 'components/form/InputTimeDuration.jsx';
import { aoObjectOf, aoIndexOf } from 'util/ArrayUtils.jsx';
import _ from 'lodash';

const AbsencesForm = Formsy.Form;
const backStyle = { backgroundColor: 'rgba(236,240,245,0.5)' };

class RegistroAbsences extends React.Component {

  onSubmit = () => {
    const absencesToWS = _.cloneDeep(this.props.registryAbsences);
    const dataForm = this.getFormData();
    if (dataForm.salute || dataForm.ufficio === '') {
      if (dataForm.salute === '') {
        dataForm.salute = '0';
      }
      const idx = aoIndexOf(absencesToWS, 'LSA', 'codice');
      if (idx > -1) {
        absencesToWS[idx].ore = parseFloat(dataForm.salute, 10);
      } else {
        const newAbsence = {
          codice: 'LSA',
          ore: parseFloat(dataForm.salute, 10),
        };
        absencesToWS.push(newAbsence);
      }
    }
    if (dataForm.ufficio || dataForm.ufficio === '') {
      if (dataForm.uffcio === '') {
        dataForm.ufficio = '0';
      }
      const idx = aoIndexOf(absencesToWS, 'LUF', 'codice');
      if (idx > -1) {
        absencesToWS[idx].ore = parseFloat(dataForm.ufficio, 10);
      } else {
        const newAbsence = {
          codice: 'LUF',
          ore: parseFloat(dataForm.ufficio, 10),
        };
        absencesToWS.push(newAbsence);
      }
    }
    if (dataForm.altro || dataForm.ufficio === '') {
      if (dataForm.altro === '') {
        dataForm.altro = '0';
      }
      const idx = aoIndexOf(absencesToWS, 'LAL', 'codice');
      if (idx > -1) {
        absencesToWS[idx].ore = parseFloat(dataForm.altro, 10);
      } else {
        const newAbsence = {
          codice: 'LAL',
          ore: parseFloat(dataForm.altro, 10),
        };
        absencesToWS.push(newAbsence);
      }
    }
    this.props.onUpdateAbsences(this.props.registryInfo.idRegistro,
                                absencesToWS)
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
  }

  setNotificationRef = (ref) => { this.Notification = ref; }
  setAbsenceFormRef = (ref) => { this.AbsenceFormRef = ref; }

  getFormData = () => this.AbsenceFormRef.getModel()

  render() {
    const isDisabled = this.props.registryInfo.stato !== 'N';
    const btnClassName = isDisabled ? 'btn btn-primary disabled' : 'btn btn-primary';
    let hoursLAL;
    let hoursLUF;
    let hoursLSA;
    if (this.props.registryAbsences) {
      hoursLAL = aoObjectOf(this.props.registryAbsences, 'LAL', 'codice').ore;
      hoursLUF = aoObjectOf(this.props.registryAbsences, 'LUF', 'codice').ore;
      hoursLSA = aoObjectOf(this.props.registryAbsences, 'LSA', 'codice').ore;
    }
    return (
      <div className="box box-solid box-unimi collapsed-box">
        <div className="box-header">
          <h3 className="box-title">
            Ore non svolte
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
            <div>
              Ore di attività non tenute per motivi di:
              <AbsencesForm
                ref={this.setAbsenceFormRef}
                onValidSubmit={this.onSubmit}
                onInvalidSubmit={this.onSubmit}
                disabled={isDisabled}
              >
                <div className="row displayMiddle">
                  <InputHours
                    name="salute"
                    title="SALUTE"
                    size="col-sm-3"
                    labelClassName="on-bottom"
                    postInput="ore"
                    readOnly={isDisabled}
                    min="0"
                    max={this.props.registryInfo.totaliAssegnate}
                    value={hoursLSA}
                  />
                  <InputHours
                    name="ufficio"
                    title="IMPEGNI DI UFFICIO"
                    size="col-sm-4"
                    labelClassName="on-bottom"
                    postInput="ore"
                    readOnly={isDisabled}
                    min="0"
                    max={this.props.registryInfo.totaliAssegnate}
                    value={hoursLUF}
                  />
                  <InputHours
                    name="altro"
                    title="ALTRO"
                    size="col-sm-3"
                    labelClassName="on-bottom"
                    postInput="ore"
                    readOnly={isDisabled}
                    min="0"
                    max={this.props.registryInfo.totaliAssegnate}
                    value={hoursLAL}
                  />
                  <button
                    type="submit"
                    className={btnClassName}
                  >Salva
                  </button>
                </div>
              </AbsencesForm>
            </div>
          </Loader>
          <Notification ref={this.setNotificationRef} />
        </div>
      </div>
    );
  }
}

RegistroAbsences.propTypes = {
  registryInfo: PropTypes.object.isRequired,
  registryAbsences: PropTypes.arrayOf(PropTypes.object).isRequired,
  onUpdateAbsences: PropTypes.func.isRequired,
  isLoaded: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
};

export default RegistroAbsences;
