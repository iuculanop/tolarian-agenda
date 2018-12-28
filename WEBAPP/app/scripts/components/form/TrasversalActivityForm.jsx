import React, { PropTypes } from 'react';
import Formsy from 'formsy-react';
import InputDatePicker from 'components/form/InputDatePicker.jsx';
import InputDuration from 'components/form/InputTimeDuration.jsx';
import InputTextArea from 'components/form/InputTextArea.jsx';
import InputSelect from 'components/form/InputSelect.jsx';

const TrasvActivityForm = Formsy.Form;

function durationValidator(values, value) {
  if (value) {
    const convertedValue = value.toString().replace('.', ',');
    return /^[-+]?([0-9]|([0-9],+([0,5])?|[0,5]|[0-9][0-9])|[0-9][0-9],+([0,5])?|[0,5])$/
      .test(convertedValue);
  }
  return false;
}

function formaDidValidator(values, value) {
  if (value && value !== '') {
    return true;
  }
  return false;
}

Formsy.addValidationRule('isDuration', durationValidator);
Formsy.addValidationRule('isSelected', formaDidValidator);

class TrasversalActivityForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canSubmit: false,
    };
  }

  setTrasvActivityFormRef = (ref) => { this.TrasvActivityForm = ref; }

  getFormData = () => this.TrasvActivityForm.getModel()

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
      <TrasvActivityForm
        ref={this.setTrasvActivityFormRef}
        onValidSubmit={this.onSubmit}
        onValid={this.enableButton}
        onInvalid={this.disableButton}
      >
        <div className="row displayMiddle">
          <div className="col-sm-2">
            <span className="form-section">TIPOLOGIA:</span>
          </div>
          <InputSelect
            name="idFormaDid"
            title="ATTIVITA DIDATTICA"
            validations="isSelected"
            validationError="nessun valore selezionato"
            formeDid={this.props.formeDidScheduled}
            required
          />
        </div>
        <div className="row displayMiddle">
          <div className="col-sm-2">
            <span className="form-section">QUANDO:</span>
          </div>
          <InputDatePicker
            name="data"
            title="DATA ATTIVITA"
            year={this.props.registryYear}
            context="trasversal"
          />
          <InputDuration
            name="ore"
            title="ORE"
            validations="isDuration"
            validationError="Il valore non e ammissibile"
            size="col-sm-2"
            max="99"
            required
          />
        </div>
        <div className="row displayMiddle">
          <div className="col-sm-2">
            <span className="form-section">COSA:</span>
          </div>
          <InputTextArea
            name="descrizione"
            title="DESCRIZIONE"
          />
          <InputTextArea
            name="altreInfo"
            title="ALTRE INFORMAZIONI"
          />
        </div>
      </TrasvActivityForm>
    );
  }
}
// <button type="submit" disabled={!this.state.canSubmit}>Submit</button>

TrasversalActivityForm.propTypes = {
  formeDidScheduled: PropTypes.arrayOf(PropTypes.object),
  registryYear: PropTypes.number.isRequired,
  check: PropTypes.func,
};

export default TrasversalActivityForm;
