import React from 'react';
import { HOC } from 'formsy-react';

/* eslint-disable */
class InputTimeDuration extends React.Component {
  constructor(props) {
    super(props);
  }

  setNotificationRef = (ref) => { this.Notification = ref; }

  changeValue = (event) => {
    if (this.props.max) {
      if (event.currentTarget.value <= this.props.max) {
      this.props.setValue(event.currentTarget.value);
      } else {
        this.props.setValue(this.props.max);
      }
    } else {
      if (event.currentTarget.value <= 8) {
        this.props.setValue(event.currentTarget.value);
      } else {
        this.props.setValue(8);
      }
    }
  }

  handleOnBlur = () => {
    this.props.setValue(this.props.getValue());
  }

  render() {
    // let className = 'col-sm-2';
    let className = this.props.size || 'col-sm-3';
    let req = null;
    if (this.props.isRequired()) {
      className = className + ' required';
      req = '*';
    }
    if ((this.props.showRequired() && !this.props.isPristine()) || this.props.showError()) {
      className = className + ' error';
    }

    if (this.props.readOnly) {
      return (
        <div className={className}>
          <label className={this.props.labelClassName || 'highlight'} htmlFor={this.props.name}>
            {this.props.title}{req}
          </label>
          <input
            type={ this.props.type || 'number'}
            min="0.5"
            max={ this.props.max || '8'}
            step="0.5"
            name={this.props.name}
            value={this.props.getValue() || ''}
            className="inputStyle"
            size="3"
            readOnly
          />
        {
          this.props.postInput &&
            <span className="post-input"> {this.props.postInput} </span>
        }
        </div>
      );
    }
    return (
      <div className={className}>
        <label className={this.props.labelClassName || 'highlight'} htmlFor={this.props.name}>
          {this.props.title}{req}
        </label>
        <input
          type={ this.props.type || 'number'}
          min={ this.props.min || '0.5' }
          max={ this.props.max || '8' }
          step="0.5"
          name={this.props.name}
          onChange={this.changeValue}
          onBlur={this.handleOnBlur}
          value={this.props.getValue() || ''}
          className="inputStyle"
          size="3"
        />
        {
          this.props.postInput &&
            <span className="post-input"> {this.props.postInput} </span>
        }
      </div>
    );
  }
}

export default HOC(InputTimeDuration);
