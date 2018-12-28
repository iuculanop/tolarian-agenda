import React from 'react';
import { HOC } from 'formsy-react';

/* eslint-disable */
class InputTextArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      hasError: false,
    };
  }

  setNotificationRef = (ref) => {this.Notification = ref; }

  changeValue = (event) => {
    this.setState({
      data: event.currentTarget.value,
    });
    if (this.props.changeCheck) {
      this.props.changeCheck(event);
    }
    this.props.setValue(event.currentTarget.value);
  }

  handleOnBlur = () => {
    const errorMsg = this.props.getErrorMessage();
    if (errorMsg) {
      this.Notification.notice('error', errorMsg, 'Formato non ammissibile');
      this.setState({
        hasErrors: true,
      });
    } else {
      this.setState({
        hasErrors: false,
      })
    }
  }

  render() {
    let className = this.props.size || 'col-sm-3';
    let innerClassName;
    let req = null;
    if (this.props.isRequired()) {
      className = className + ' required';
      req = '*';
    }
    if (this.state.hasErrors) {
      className = className + ' error';
    }

    if (!this.props.cols) {
      innerClassName = 'inputStyle noresize full-width withpre';
    } else {
      innerClassName = 'inputStyle noresize withpre';
    }

    if (this.props.readOnly) {
      return (
        <div className={className}>
          <label className="highlight" htmlFor={this.props.name}>
            {this.props.title}{req}
          </label>
          <textarea
            name={this.props.name}
            rows={this.props.rows || '4'}
            cols={this.props.cols}
            maxLength={this.props.maxLength || '1500'}
            onChange={this.changeValue}
            onBlur={this.handleOnBlur}
            value={this.props.getValue() || ''}
            className={innerClassName}
            readOnly
          />
        </div>
      );
    }

    return (
      <div className={className}>
        <label className="highlight" htmlFor={this.props.name}>
          {this.props.title}{req}
        </label>
        <textarea
          name={this.props.name}
          rows={this.props.rows || '4'}
          cols={this.props.cols}
          maxLength={this.props.maxLength || '1500'}
          onChange={this.changeValue}
          onBlur={this.handleOnBlur}
          value={this.props.getValue() || ''}
          className={innerClassName}
        />
      </div>
    );
  }
}

export default HOC(InputTextArea);
