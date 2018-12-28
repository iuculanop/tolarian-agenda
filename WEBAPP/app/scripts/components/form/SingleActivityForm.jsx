import React, { PropTypes } from 'react';
import Formsy from 'formsy-react';
import InputDatePicker from 'components/form/InputDatePicker.jsx';
import InputTimePicker from 'components/form/InputTimePicker.jsx';
// import InputTimeStart from 'components/form/InputTimeHours.jsx';
import InputDuration from 'components/form/InputTimeDuration.jsx';
import InputText from 'components/form/InputText.jsx';
import InputTextArea from 'components/form/InputTextArea.jsx';
import InputSelect from 'components/form/InputSelect.jsx';

const ActivityForm = Formsy.Form;

function hourStartValidator(values, value) {
  if (value) {
    const timeStart = value.format('HH:mm');
    return /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(timeStart);
  }
  return false;
}

function durationValidator(values, value) {
  if (value) {
    const convertedValue = value.toString().replace('.', ',');
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

class SingleActivityForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canSubmit: false,
    };
  }

  setActivityFormRef = (ref) => { this.ActivityForm = ref; }

  getFormData = () => this.ActivityForm.getModel()

  enableButton = () => {
    this.setState({
      canSubmit: true,
    });
    this.props.check(true);
  }

  disableButton = () => {
    this.setState({
      canSubmit: false,
    });
    this.props.check(false);
  }

  render() {
    return (
      <ActivityForm
        ref={this.setActivityFormRef}
        onValidSubmit={this.onSubmit}
        onValid={this.enableButton}
        onInvalid={this.disableButton}
      >
        <div className="row displayMiddle">
          <div className="col-sm-2">
            <span className="form-section">QUANDO:</span>
          </div>
          <InputDatePicker
            name="day"
            title="DATA"
            year={this.props.registryYear}
            required
          />
          <InputTimePicker
            name="time"
            title="ORA INIZIO"
            validations="isTimeInHours"
            validationError="Il valore non e ammissibile"
            required
          />
          <InputDuration
            name="durata"
            title="DURATA"
            validations="isDuration"
            validationError="Il valore non e ammissibile"
            size="col-sm-2"
            required
          />
        </div>
        <div className="row displayMiddle">
          <div className="col-sm-2">
            <span className="form-section">DOVE:</span>
          </div>
          <InputText
            name="aula"
            title="AULA"
            required
          />
          <InputText
            name="sede"
            title="SEDE"
            required
          />
        </div>
        <div className="row displayMiddle">
          <div className="col-sm-2">
            <span className="form-section">COSA:</span>
          </div>
          <InputSelect
            name="idFormaDid"
            title="FORMA DIDATTICA"
            validations="isSelected"
            validationError="nessun valore selezionato"
            formeDid={this.props.formeDidScheduled}
            size="col-sm-3"
            required
          />
          <div className="col-sm-3"></div>
          <InputTextArea
            name="argomento"
            title="ARGOMENTO"
          />
        </div>
      </ActivityForm>
    );
  }
}
// <button type="submit" disabled={!this.state.canSubmit}>Submit</button>

SingleActivityForm.propTypes = {
  formeDidScheduled: PropTypes.arrayOf(PropTypes.object),
  registryYear: PropTypes.number.isRequired,
  check: PropTypes.func,
};

export default SingleActivityForm;
