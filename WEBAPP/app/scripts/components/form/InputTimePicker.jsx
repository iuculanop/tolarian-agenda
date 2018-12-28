import React from 'react';
import { HOC } from 'formsy-react';
import TimePicker from 'rc-time-picker';
import moment from 'moment';

function disabledHours() {
  return [0, 1, 2, 3, 4, 5, 6, 23];
}

function disabledMins() {
  const arr = [];
  for (let i = 0; i < 60; i++) {
    if (i !== 0 && i !== 15 && i !== 30 && i !== 45) {
      arr.push(i);
    }
  }
  return arr;
}

/* eslint-disable */
class InputTimePicker extends React.Component {
  constructor(props) {
    super(props);
    const defaultTime = moment();
    defaultTime.hours(0);
    defaultTime.minutes(0);
    this.state = {
      defaultTime,
    };
  }

  changeValue = (moment) => {
    if (moment) {
      this.props.setValue(moment);
    } else {
      this.props.setValue(this.state.defaultTime);
    }
  }

  submit = () => {
    this.setState({
      open: false,
    });
  }

  submitAddOn = () => {
    return <button className="btn btn-xs btn-primary mg2" onClick={this.submit}>OK</button>;
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
        <TimePicker
          open={this.state.open}
          allowEmpty={false}
          name={this.props.name}
          defaultValue={this.props.getValue() || this.state.defaultTime}
          showSecond={false}
          hideDisabledOptions
          disabledHours={disabledHours}
          disabledMinutes={disabledMins}
          onChange={this.changeValue}
          className="inputStyle"
          addon={this.submitAddOn}
          size="5"
        />
      </div>
    );
  }
}

export default HOC(InputTimePicker);
