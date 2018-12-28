import React from 'react';

/* eslint-disable */
class InputFloat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.defaultValue || 0.5,
      max: props.max || 8,
    };
  }

  // IMPORTANTE: è stato necessario mettere il controllo se il valore è cambiato a causa di un bug di firefox
  // che scatena due volte il focus sul componente input di tipo number()
  onBlur = (event) => {
    if (event.currentTarget.value != this.props.defaultValue) {
      this.props.onUpdate(event.currentTarget.value);
    }
  }

  setRef = (ref) => { this.inputFloat = ref; }

  focus() {
    this.inputFloat.focus();
  }

  changeValue = (event) => {
    if (event.currentTarget.value <= 0) {
      return;
    }
    if (event.currentTarget.value <= this.state.max) {
      this.setState({
        value: event.currentTarget.value,
      });
    } else {
      this.setState({
        value: this.state.max,
      });
    }
  }

  render() {
    return (
      <input
        ref={this.setRef}
        className={ ( this.props.editorClass || '') + ' form-control editor edit-text' }
        style={ { width: '100%' } }
        type="number"
        min="0.5"
        max={this.state.max}
        step="0.5"
        onKeyDown={ this.props.onKeyDown }
        onChange={this.changeValue}
        onBlur={this.onBlur}
        value={this.state.value}
        size="3"
      />
    );
  }
}

export default InputFloat;
