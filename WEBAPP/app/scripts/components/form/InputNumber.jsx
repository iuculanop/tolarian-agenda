import React from 'react';

/* eslint-disable */
class InputNumber extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.defaultValue || 0,
    };
  }

  onBlur = (event) => {
    this.props.onUpdate(event.currentTarget.value);
  }

  setRef = (ref) => { this.inputNumber = ref; }

  focus() {
    this.inputFloat.focus();
  }

  changeValue = (event) => {
    this.setState({
      value: event.currentTarget.value,
    });
  }

  render() {
    return (
      <span>
        <input
          ref={this.setRef}
          type="number"
          min="0"
          step="1"
          onChange={this.changeValue}
          onBlur={this.onBlur}
          value={this.state.value}
          size="2"
        />
      </span>
    );
  }
}

export default InputNumber;
