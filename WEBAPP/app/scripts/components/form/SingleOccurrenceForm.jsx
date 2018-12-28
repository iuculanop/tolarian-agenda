import React, { PropTypes } from 'react';
import Formsy from 'formsy-react';
import moment from 'moment';
import InputTimePicker from 'components/form/InputTimePicker.jsx';
import InputDuration from 'components/form/InputTimeDuration.jsx';
import InputText from 'components/form/InputText.jsx';
import InputSelect from 'components/form/InputSelect.jsx';

const OccurrenceForm = Formsy.Form;

function hourStartValidator(values, value) {
  if (value) {
    const timeStart = value.format('HH:mm');
    return /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(timeStart);
  }
  return false;
}

function durationValidator(values, value) {
  if (value) {
    const convertedValue = value.replace('.', ',');
    return /^[-+]?(([0-8])|[0-8],+([0,5])?|[0,5])$/.test(convertedValue);
  }
  return false;
}

function formaDidValidator(values, value) {
  if (value && value !== '') {
    return true;
  }
  return false;
}

Formsy.addValidationRule('isTimeInHours', hourStartValidator);
Formsy.addValidationRule('isDuration', durationValidator);
Formsy.addValidationRule('isSelected', formaDidValidator);

class SingleOccurrenceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timestamp: moment(),
      canSubmit: false,
    };
  }

  onSubmit = () => {
    this.props.onSaveClick();
    this.OccurrenceForm.reset();
  }

  setOccurrenceFormRef = (ref) => { this.OccurrenceForm = ref; }

  getFormData = () => this.OccurrenceForm.getModel()

  resetFormData = () => {
    this.OccurrenceForm.reset();
    this.setState({
      timestamp: moment(),
    });
  }

  enableButton = () => {
    this.setState({
      canSubmit: true,
    });
  }

  disableButton = () => {
    this.setState({
      canSubmit: false,
    });
  }

  cancelButton = () => {
    this.props.onCancelClick();
    this.resetFormData();
  }

// onInvalidSubmit={this.cancelButton}
  render() {
    const className = this.props.isHidden ? 'hidden-form' : 'hidden-form opened';
    return (
      <div className={className}>
        <OccurrenceForm
          key={this.state.timestamp}
          ref={this.setOccurrenceFormRef}
          onValidSubmit={this.onSubmit}
          onValid={this.enableButton}
          onInvalid={this.disableButton}
        >
          <div className="row displayMiddle">
            <InputTimePicker
              name="time"
              title="ORA INIZIO"
              validations="isTimeInHours"
              validationError="Il valore non e ammissibile"
              size="col-sm-3 min-padding"
              required
            />
            <InputDuration
              name="durata"
              title="DURATA"
              validations="isDuration"
              validationError="Il valore non e ammissibile"
              size="col-sm-2 min-padding"
              required
            />
            <InputText
              name="aula"
              title="AULA"
              size="col-sm-3 min-padding"
              required
            />
            <InputText
              name="sede"
              title="SEDE"
              size="col-sm-3 min-padding"
              required
            />
            <InputSelect
              name="idFormaDid"
              title="FORMA DID."
              validations="isSelected"
              validationError="nessun valore selezionato"
              formeDid={this.props.formeDidScheduled}
              required
            />
          </div>
          <button
            type="reset"
            className="btn btn-xs btn-danger mg5"
            onClick={() => this.cancelButton()}
          >Annulla
          </button>
          <button
            type="submit"
            className="btn btn-xs btn-success"
            disabled={!this.state.canSubmit}
          >Salva
          </button>
        </OccurrenceForm>
      </div>
    );
  }
}

SingleOccurrenceForm.propTypes = {
  formeDidScheduled: PropTypes.arrayOf(PropTypes.object),
  isHidden: PropTypes.bool.isRequired,
  onSaveClick: PropTypes.func.isRequired,
  onCancelClick: PropTypes.func.isRequired,
};

export default SingleOccurrenceForm;
