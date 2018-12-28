import React from 'react';
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
class TableTimePicker extends React.Component {
  constructor(props) {
    super(props);
    const splittedTime = props.defaultValue.split(':');
    this.state = {
      value: moment({ hour: parseInt(splittedTime[0], 10),
                      minute: parseInt(splittedTime[1], 10) }),
    };
  }

  onBlur = () => {
    const timeMoment = this.state.value;
    this.props.onUpdate(timeMoment.format('HH:mm'));
  }

  setRef = (ref) => { this.tableTimePicker = ref; }

  changeValue = (moment) => {
    this.setState({
      value: moment,
    });
  }

  submit = () => {
    this.onBlur();
  }

  submitAddOn = () => {
    return <button className="btn btn-xs btn-primary mg2" onClick={this.submit}>OK</button>;
  }

  render() {
    return (
      <TimePicker
        open
        ref={this.setRef}
        defaultValue={this.state.value}
        showSecond={false}
        hideDisabledOptions
        disabledHours={disabledHours}
        disabledMinutes={disabledMins}
        addon={this.submitAddOn}
        onChange={this.changeValue}
        onClose={this.onBlur}
        size="5"
      />
    );
  }
}

export default TableTimePicker;
