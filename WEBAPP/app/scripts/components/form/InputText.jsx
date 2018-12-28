import React from 'react';
import { HOC } from 'formsy-react';
import Notification from 'components/generic/Notification.jsx';

/* eslint-disable */
class InputText extends React.Component {
  constructor(props) {
    super(props);
  }

  setNotificationRef = (ref) => { this.Notification = ref; }

  changeValue = (event) => {
    this.props.setValue(event.currentTarget.value);
  }

  handleOnBlur = () => {
    this.props.setValue(this.props.getValue());
    const errorMsg = this.props.getErrorMessage();
    /*if (errorMsg) {
      this.Notification.notice('error', errorMsg, 'Formato non ammissibile');
    } else if (this.props.isRequired() && (!this.props.getValue() || this.props.getValue() === '')) {
      this.Notification.notice('error', errorMsg, 'Il campo è obbligatorio');
    }
    */
  }

  render() {
    let className = this.props.size || 'col-sm-3';
    let req = null;
    if (this.props.isRequired()) {
      className = className + ' required';
      req = '*';
    }
    if ((this.props.showRequired() && !this.props.isPristine()) || this.props.showError()) {
      className = className + ' error';
    }

    return (
      <div className={className}>
        <label className="highlight" htmlFor={this.props.name}>
          {this.props.title}{req}
        </label>
        <input
          type={ this.props.type || 'text'}
          name={this.props.name}
          onChange={this.changeValue}
          onBlur={this.handleOnBlur}
          value={this.props.getValue() || ''}
          className="inputStyle"
        />
        <Notification ref={this.setNotificationRef} />
      </div>
    );
  }
}

export default HOC(InputText);
