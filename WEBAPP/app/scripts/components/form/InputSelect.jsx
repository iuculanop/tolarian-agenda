import React, { PropTypes } from 'react';
import { HOC } from 'formsy-react';
import Notification from 'components/generic/Notification.jsx';
import FormaDidSelect from 'components/form/FormaDidSelect.jsx';

/* eslint-disable */
class InputSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  setNotificationRef = (ref) => { this.Notification = ref; }

  changeValue = (selected) => {
    this.props.setValue(selected);
    const errorMsg = this.props.getErrorMessage();
    if (selected.toString() === '') {
      this.Notification.notice('error', 'Valore non ammissibile', 'Selezione non valida');
      this.setState({
        hasErrors: true,
      });
    } else {
      this.setState({
        hasErrors: false,
      });
    }
  }

  componentWillMount() {
    if (this.props.formeDid.length === 1) {
      this.props.setValue((this.props.formeDid[0].idFormaDidattica).toString());
    }
  }

  render() {
    let className = this.props.size || 'col-sm-6 min-padding';
    let req = null;
    if (this.props.isRequired()) {
      className = className + ' required';
      req = '*';
    }
    if (this.state.hasErrors) {
      className = className + ' error';
    }

    return (
      <div className={className}>
        <label className="highlight" htmlFor={this.props.name}>
          {this.props.title}{req}
        </label>
        <FormaDidSelect
          name={this.props.name}
          inputStyle="inputStyle"
          onUpdate={this.changeValue}
          formeDid={this.props.formeDid}
          selected={this.props.getValue()}
        />
        <Notification ref={this.setNotificationRef} />
      </div>
    );
  }
}

InputSelect.propTypes = {
  formeDid: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default HOC(InputSelect);
